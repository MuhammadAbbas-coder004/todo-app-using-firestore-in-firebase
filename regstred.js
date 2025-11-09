import {  createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth } from "./firesotreconfig.js";
const regsterForm = document.querySelector("#login-form");
const inputEmail = document.querySelector("#login-email");
const inputPassword = document.querySelector("#login-password");

regsterForm.addEventListener("submit" , (event)=>{
event.preventDefault();
createUserWithEmailAndPassword(auth, inputEmail.value, inputPassword.value)
.then((userCredential) => {
    const user = userCredential.user;
    console.log(user);
    Swal.fire({
  text: "Your Email Regestred",
  icon: "success"
});
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "This Email Is Already Registred",
});
  });
})