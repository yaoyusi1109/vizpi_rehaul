let socket
let microphone

async function getMicrophone () {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    return new MediaRecorder(stream, { mimeType: "audio/webm" })
  } catch (error) {
    console.error("error accessing microphone:", error)
    throw error
  }
}

async function openMicrophone (microphone, socket) {
  return new Promise((resolve) => {
    microphone.onstart = () => {
      console.log("client: microphone opened")
      document.body.classList.add("recording")
      resolve()
    }

    microphone.onstop = () => {
      console.log("client: microphone closed")
      document.body.classList.remove("recording")
    }

    microphone.ondataavailable = (event) => {
      console.log("client: microphone data received")
      if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
        socket.send(event.data)
      }
    }

    microphone.start(1000)
  })
}

export async function closeMicrophone () {
  if (microphone) {
    microphone.stop()
    microphone.stream.getTracks().forEach(track => track.stop())
  }
  microphone = undefined
  document.body.classList.remove("recording")
}

async function start (socket) {
  console.log("client: waiting to open microphone")

  if (!microphone) {
    try {
      microphone = await getMicrophone()
      await openMicrophone(microphone, socket)
    } catch (error) {
      console.error("error opening microphone:", error)
    }
  } else {
    await closeMicrophone(microphone)
    // microphone = undefined
  }

}

export const setupDeepgram = (sendMessage) => {
  socket = new WebSocket(process.env.REACT_APP_HOST_WS + "/transcribe")

  socket.addEventListener("open", async () => {
    console.log("client: connected to server")
    await start(socket)
  })

  socket.addEventListener("message", (event) => {
    if (event.data === "") {
      return
    }

    let data
    try {
      data = JSON.parse(event.data)
    } catch (e) {
      console.error("Failed to parse JSON:", e)
      return
    }

    if (data && data.channel && data.channel.alternatives[0].transcript !== "") {
      // captions.innerHTML = `<span>${data.channel.alternatives[0].transcript}</span>`
      console.log("client: transcript received", data.channel.alternatives[0].transcript)
      sendMessage("[Transcript] " + data.channel.alternatives[0].transcript)
    }
  })

  socket.addEventListener("close", () => {
    console.log("client: disconnected from server")
  })
}


export const closeDeepgram = () => {
  if (socket) {
    socket.close()
  }
  closeMicrophone()
}