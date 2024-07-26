import Peer from 'peerjs'
import { socket } from '../tool/socketIO'

const peer = new Peer()
var peerId
peer.on('open', (id) => {
  peerId = id
})

export const getPeerId = () => {
  return peerId
}

export const callRTC = async (peerId, addAudio) => {
  navigator.getUserMedia(
    { video: false, audio: true },
    (stream) => {
      const call = peer.call(peerId, stream)
      call.on("stream", (remoteStream) => {
        // Show stream in some <video> element.
        console.log('call success:', remoteStream)
        addAudio({ userId: peerId, stream: remoteStream })
      })
    },
    (err) => {
      console.error("Failed to get local stream", err)
    },
  )
}

export const answerRTC = async (addAudio) => {
  peer.on("call", (call) => {
    navigator.getUserMedia(
      { video: false, audio: true },
      (stream) => {
        call.answer(stream) // Answer the call with an A/V stream.
        call.on("stream", (remoteStream) => {
          // Show stream in some <video> element.
          console.log('answer success:', remoteStream)
          addAudio({ userId: call.peer, stream: remoteStream })
        })
      },
      (err) => {
        console.error("Failed to get local stream", err)
      },
    )
  })
}

export const subscribeToGroupAudio = (userId, groupId, addAudio, removeAudio) => {
  // Subscribe to RTC group
  socket.emit('subscribe RTC', userId, peerId, groupId)

  // Define event handlers
  const handleConnection = (userId, peerId) => {
    callRTC(peerId, addAudio)
  }
  const handleDisconnection = (userId, peerId) => removeAudio(userId)

  // Attach event listeners
  socket.on('RTC-connection', handleConnection)
  socket.on('RTC-disconnection', handleDisconnection)

  // Cleanup function to remove event listeners and unsubscribe from the group
  return () => {
    socket.emit('unsubscribe RTC', userId, peerId, groupId)
    socket.off('RTC-connection', handleConnection)
    socket.off('RTC-disconnection', handleDisconnection)
  }
}

export const unsubscribeFromGroupAudio = (userId, groupId) => {
  socket.emit('unsubscribe RTC', userId, peerId, groupId)
}