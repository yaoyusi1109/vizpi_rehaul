// import { getFirestore, collection, query, where, getDoc, doc, getDocs, updateDoc, arrayUnion, runTransaction, addDoc } from "firebase/firestore"
// import { db } from "../tool/firebase"


// export const getCourseList = async () => {
//   const coursesRef = collection(db, 'course')
//   const querySnapshot = await getDocs(coursesRef)
//   const courses = querySnapshot.docs.map(doc => doc.data().crn)
//   return courses
// }

// export const getCourseByCrn = async (crn) => {
//   try {
//     const coursesRef = collection(db, 'course')
//     const q = query(coursesRef, where("crn", "==", crn))
//     const querySnapshot = await getDocs(q)

//     if (querySnapshot.empty) {
//       // No document matched the query
//       console.error(`No course found with CRN: ${crn}`)
//       return null
//     }

//     // Assuming CRN is unique, so there is only one document matching the query
//     const courseDoc = querySnapshot.docs[0]
//     return courseDoc.data()

//   } catch (error) {
//     // An error occurred while executing the query
//     console.error(`Error occurred while fetching course with CRN: ${crn}`, error)
//     return null
//   }
// }