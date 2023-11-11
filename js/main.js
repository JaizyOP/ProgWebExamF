// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js'
import { getDatabase, onValue, ref as refS, set, child, get, update, remove } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";



const firebaseConfig = {
    apiKey: "AIzaSyAiRwuCoJMBB9Osw0MwvLpi9xHZtwirZYM",
    authDomain: "pf-progweb.firebaseapp.com",
    projectId: "pf-progweb",
    storageBucket: "pf-progweb.appspot.com",
    messagingSenderId: "466440754580",
    appId: "1:466440754580:web:94343f9debd31abcdc2b81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

const btnLogin = document.getElementById('btnLogin');

function login() {
    const email = document.getElementById('email').value;
    const passwd = document.getElementById('passwd').value;

    signInWithEmailAndPassword(auth, email, passwd).then(() => {
            alert("Se inicio sesion correctamente");
            window.location.href = "/html/main.html";
        })
        .catch(() => {
            alert("El correo o la contraseña son incorrectas");
        });
}

btnLogin.addEventListener('click', () => {
    login();
});