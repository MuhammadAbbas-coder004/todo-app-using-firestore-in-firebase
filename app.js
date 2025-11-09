import {collection, 
  addDoc,  
  getDocs, 
  Timestamp, 
  query,
   orderBy,
  deleteDoc,
  doc,
  updateDoc,} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js"; 
  import {signOut,
onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth, db } from "/config.js";

const form = document.querySelector("#form");
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const todocontainer = document.querySelector(".container");

const alltodo = [];

async function readformdata() {
const querySnapshot = await getDocs(collection(db, "todos"));
const q = query(collection(db, "todos"), orderBy("time", "desc"));
querySnapshot.forEach((doc) => {
alltodo.push({...doc.data(), docid: doc.id});
});
 console.log(alltodo);
  rendertodo(alltodo);

}
readformdata();

form.addEventListener("submit" , async(event)=>{
event.preventDefault();
const userData = {
title : title.value,
time: Timestamp.fromDate(new Date()),
description: description.value,

};

try {
const docRef = await addDoc(collection(db, "todos"), userData);
console.log("Document written with ID: ", docRef.id);
alltodo.push({...userData, docid: docRef.id});

rendertodo(alltodo);
} catch (e) {
console.error("Error adding document: ", e);
}
});
function rendertodo(arr){
todocontainer.innerHTML = "";
arr.map((item)=>{
todocontainer.innerHTML +=  `<div class="todo-card">
<div class="button-group">
<button class="edit">✏️ Edit</button>
<button class="delete">🗑️ Delete</button></div>
<h2 class="todo-title">Title : ${item.title}</h2>
<h3 class="todo-desc">Description : ${item.description}</h3>
</div> `
});
const edit = document.querySelectorAll(".edit");
const  del = document.querySelectorAll(".delete");

edit.forEach((btn, index) => {
  btn.addEventListener("click", async () => {
    const item = alltodo[index];
    const newtitle = prompt("Update title", item.title);
    const newdesc = prompt("Update description", item.description);

    if (newtitle && newdesc) {
      const docRef = doc(db, "todos", item.docid);
      try {
        await updateDoc(docRef, { title: newtitle, description: newdesc});
        console.log("Updated:", item.docid);
        alltodo[index].title = newtitle;
        alltodo[index].description = newdesc;
        Swal.fire({
  title: "Todo Updated!",
  text: "Your todo has been updated successfully! The page will now reload",
  icon: "success"
});
      } catch (err) {
        console.error("Error updating:", err);
      }
    }
  });
});






del.forEach((btn ,index) =>{
const todoid = alltodo[index].docid
btn.addEventListener("click" , async()=>{
Swal.fire({  
title: "are you sure the todo will be deleted?",
icon: "warning",
showCancelButton: true,
confirmButtonColor: "#ff4b2b",
cancelButtonColor: "rgba(27, 224, 27, 1)",
confirmButtonText: "Yes, delete it!"
}).then(async(result) => {
if (result.isConfirmed) {
await deleteDoc(doc(db, "todos", todoid))
alltodo.splice(index, 1);
rendertodo(alltodo);
Swal.fire({
title: "Your Are Todo Is Deleted",
icon: "success"
});
}
});
try {
console.log("res");
}catch(err){
console.log(err , "error");
}
})
})
};

let logout = document.querySelector(".Btn");
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(`User logged in : ${uid}`);   
  }
else{
window.location = "index.html";
}
});

logout.addEventListener("click" , (event) =>{
  event.preventDefault();
signOut(auth)
.then(() => {
window.location = "index.html"
console.log("response");

}).catch((error) => {
console.log(error, "error");

}); 
} )