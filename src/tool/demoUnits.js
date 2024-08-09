

// export const generateMsgInCurrentSession = async (sessionId) => {
//   if (!sessionId) {
//     return false
//   }
//   // Get session reference
//   const sessionRef = doc(db, 'session', sessionId)
//   // Get groups in the session
//   const groupsRef = collection(sessionRef, 'groups')
//   const groupSnapshot = await getDocs(groupsRef)

//   if (groupSnapshot.empty) {
//     //console.log('No groups found.')
//     return
//   }

//   groupSnapshot.forEach(async (group) => {
//     // Get users in the group
//     const users = group.data().users || []

//     if (users.length > 0) {
//       // Randomly select a user
//       const userId = users[Math.floor(Math.random() * users.length)]
//       const progressAndPassrate = Math.floor(Math.random() * 100)
//       // Simulate a message
//       const newMessage = {
//         'sender_id': userId,
//         'code_id': null,
//         'content': `This is a simulated message. Pass rate=${progressAndPassrate}`,
//         'time': new Date(),
//         'progress': {
//           'passrate': progressAndPassrate
//         }
//       }
//       // Add the message to the group's messages
//       const groupRef = doc(groupsRef, group.id)
//       await updateDoc(groupRef, { 'messages': arrayUnion(newMessage) })
//       //console.log(`Message sent by user ${userId} in group ${group.id}.`)

//     } else {
//       //console.log('No users in group.')
//     }
//   })

// }

// export const removeMsgInCurrentSession = async (sessionId) => {
//   // Get session reference
//   const sessionRef = doc(db, 'session', sessionId)
//   // Get groups in the session
//   const groupsRef = collection(sessionRef, 'groups')
//   const groupSnapshot = await getDocs(groupsRef)

//   if (groupSnapshot.empty) {
//     //console.log('No groups found.')
//     return
//   }

//   groupSnapshot.forEach(async (group) => {
//     // Get group reference
//     const groupRef = doc(groupsRef, group.id)
//     // Clear the group's messages
//     await updateDoc(groupRef, { 'messages': [] })
//     //console.log(`Messages deleted in group ${group.id}.`)
//   })
// }

// export const generateMulMsg = async (sessionId, times) => {
//   let count = 0
//   const intervalId = setInterval(() => {
//     //console.log('Executing operation')
//     generateMsgInCurrentSession(sessionId)
//     count += 1
//     if (count === times) {
//       clearInterval(intervalId)
//     }
//   }, 1000)
// }