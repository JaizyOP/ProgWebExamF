import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref as refS, onValue, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyAiRwuCoJMBB9Osw0MwvLpi9xHZtwirZYM",
    authDomain: "pf-progweb.firebaseapp.com",
    projectId: "pf-progweb",
    storageBucket: "pf-progweb.appspot.com",
    messagingSenderId: "466440754580",
    appId: "1:466440754580:web:94343f9debd31abcdc2b81",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

const btnAgregar = document.getElementById("btnAgregar");
const btnActualizarProd = document.getElementById("btnActualizarProd");
const btnEliminar = document.getElementById("btnEliminar");
const archivoImg = document.getElementById("archivo");
const imgUpdate = document.getElementById("imgUpdate");
const container = document.getElementById("cont");

let nombreArt = "";
let precio = "";
let desc = "";
let imagen = "";
let idProducto = "";

// MOSTRAMOS LOS PRODUCTOS


window.addEventListener('DOMContentLoaded', (event) => {
    MostrarProductos();
});


// FUNCION LIMPIAR INPUTS
function limpiarInputs() {
    document.getElementById("lblCodigo").value = "";
    document.getElementById("lblNomArt").value = "";
    document.getElementById("lblPrecio").value = "";
    document.getElementById("lblDesc").value = "";
    document.getElementById("archivo").value = "";
}

// FUNCION LEER INPUTS
function leerInputs() {
    idProducto = document.getElementById("lblCodigo").value;
    nombreArt = document.getElementById("lblNomArt").value;
    precio = document.getElementById("lblPrecio").value;
    desc = document.getElementById("lblDesc").value;
}

function MostrarProductos() {
    const dbRef = refS(db, "productos");

    onValue(
        dbRef,
        (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                let id = childSnapshot.key;

                let cartaProducto = `
                <div class="card">
                    <img id="imgMerch" src="${data.urlImagen}" class="card-img-top" alt="Img"/>
                    <div class="card-body">
                        <h5 class="card-title">${id}.- ${data.nombre}</h5> 
                        <h5 class="card-precio">Precio: $${data.precio}</h5>
                        <p class="card-text">${data.descripcion}</p>
                        <button id="btnActualizar"data-bs-toggle="modal" data-bs-target="#modalActu" class="btnEditar">Editar</button>
                    </div>
                </div>
            `;

                container.innerHTML += cartaProducto;
            });
        }, { onlyOnce: true }
    );
}

function insertarProducto(event) {
    event.preventDefault();
    leerInputs();

    const container = document.getElementById("cont");
    const file = archivoImg.files[0];
    let urlImg = "";

    if (file) {
        const storageRef = ref(storage, file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                alert("Progreso: " + progress.toFixed(2) + "%");
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        urlImg = downloadURL;

                        set(refS(db, "productos/" + idProducto), {
                                nombre: nombreArt,
                                precio: precio,
                                descripcion: desc,
                                urlImagen: urlImg
                            })
                            .then(() => {
                                alert("Se insertó con éxito.");
                                limpiarInputs();
                                MostrarProductos();
                            })
                            .catch((error) => {
                                alert("Ocurrió un error: " + error);
                            });
                    })
                    .catch((error) => {
                        alert(error);
                    });
            }
        );
    }
}

// BOTON AGREGAR
btnAgregar.addEventListener("click", (event) => {
    insertarProducto(event);
});
// BOTON ACTUALIZAR
btnActualizarProd.addEventListener("click", (event) => {
    actualizarProducto();
});
// BOTON ELIMINAR 
btnEliminar.addEventListener("click", (event) => {
    EliminarProducto();
});

// BOTON ELIMINAR
function EliminarProducto(event) {
    let id = document.getElementById('codigoAct').value;
    if (id === "") {
        return alert("No se ingresó un Codigo válido.");;
    }
    const dbref = refS(db);
    get(child(dbref, 'productos/' + id)).then((snapshot) => {
        if (snapshot.exists()) {
            remove(refS(db, 'productos/' + id))
                .then(() => {
                    alert("Producto eliminado con éxito.");
                    limpiarInputs();
                    MostrarProductos();
                })
                .catch((error) => {
                    alert("Ocurrió un error al eliminar el producto: " + error);
                });
        } else {
            limpiarInputs();
            alert("El producto con ID " + id + " no existe.");
        }
    });

}

// ACTUALIZAR PRODUCTO POR ID
function actualizarProducto(event) {
    let nuevoId = document.getElementById("codigoAct").value;
    let nuevoNom = document.getElementById("nomAct").value;
    let nuevoPrecio = document.getElementById("precioAct").value;
    let nuevoDesc = document.getElementById("descAct").value;

    const container = document.getElementById("cont");
    const file = imgUpdate.files[0];
    let urlImg = "";

    if (file) {
        const storageRef = ref(storage, file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                alert("Progreso: " + progress.toFixed(2) + "%");
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        urlImg = downloadURL;

                        set(refS(db, "productos/" + nuevoId), {
                                nombre: nuevoNom,
                                precio: nuevoPrecio,
                                descripcion: nuevoDesc,
                                urlImagen: urlImg
                            })
                            .then(() => {
                                alert("Se insertó con éxito.");
                                limpiarInputs();
                                MostrarProductos();
                            })
                            .catch((error) => {
                                alert("Ocurrió un error: " + error);
                            });
                    })
                    .catch((error) => {
                        alert(error);
                    });
            }
        );
    }

}