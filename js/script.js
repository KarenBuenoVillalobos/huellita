let header = '<a href="index.html" class="logo"><img id="logo" src="img/logo.png" alt="huellitas-de-amor"></a><input type="checkbox" id="check"><label for="check" class="mostrar-menu">&#8801</label><nav class="menu"><a href="index.html">Home</a><a href="nosotros.html">Nosotros</a><a href="adopta.html">Adopta</a><a href="abm-mascotas.html">Listado</a><a href="contacto.html">Contacto</a><a href="donar.html">Donar</a><label for="check" class="esconder-menu">&#215</label></nav>';
document.getElementById('header').innerHTML = header;

let footer = '<a href="https://www.facebook.com" target="_blank"><img src="img/ico-facebook.ico" alt="Facebook"></a><a href="https://www.instagram.com" target="_blank"><img src="img/ico-instagram.ico" alt="Instagram"></a><a href="https://www.whatsapp.com" target="_blank"><img src="img/ico-whatsapp.ico" alt="WhatsApp"></a><a href="https://www.twitter.com" target="_blank"><img src="img/ico-twitter.ico" alt="Twitter"></a><a href="https://www.youtube.com" target="_blank"><img src="img/ico-youtube.ico" alt="Youtube"></a><p>Derechos reservados © 2024</p><p>Terminos y condiciones</p><p>Soporte</p>';
document.getElementById('footer').innerHTML = footer;

//-----------------------------------------------
// Crear la lista de tareas

let tasks = []; // crear un lista o array vacio

const form = document.querySelector(".form_task"); // Formulario
const taskInput = document.querySelector("#taskInput"); // Input
const taskInputEdad = document.querySelector("#taskInputEdad"); // Input
const selectTipoEdad = document.querySelector("#select__tipoedad"); // Input
const taskInputDescrip = document.querySelector("#taskInputDescrip"); // Input
const taskList = document.querySelector("#taskList"); // Lista li

// Mostrar las tareas en HTML
const renderTasks = () => {  //render seria Presentacion, en este caso presentar tareas
    taskList.innerHTML = ""; // Borrar toda la infor del ul
    tasks.forEach((task) => {
        // Dinamico con el texto ingresado en el input
        const html = `
            <li data-id="${task.id}" class="tasks__item">
                <p class="${task.completa && "done"}">${task.txt_tarea}</p>
                <p class="${task.completa && "done"}">${task.edad + " " + task.tipoEdad}</p>
                <p class="${task.completa && "done"}">${task.txt_descrip}</p>
                <div>
                    <i class="bx bx-check"></i>
                    <i class="bx bx-trash"></i>
                </div>
            </li>
        `;
        // class="tasks-item" era el error en li
        taskList.innerHTML += html;
    })
}

form.addEventListener("submit", async (event) => {
    event.preventDefault(); //tomo el control del evento, lo atrapo porque sino se va
    const txt_tarea = (taskInput.value.trim()); //guarda el valor del input sin espacios (al principio y fin) en una variable
    const edad = parseInt(taskInputEdad.value); // convertir a numero
    const tipoEdad = selectTipoEdad.options[selectTipoEdad.selectedIndex].text;
    const txt_descrip = (taskInputDescrip.value.trim()); //guarda el valor del input sin espacios (al principio y fin) en una variable

    let erroresValidacion = false;

    if (txt_tarea.length < 3) {
        erroresValidacion = true;
        const error = document.querySelector(".error-nombre");
        error.textContent = "El nombre debe contener al menos 3 caracteres.";

        setTimeout(() => {
            error.textContent = "";
        }, 4000); // 4.000 milisengundos = 4 segundos
    }

    if (edad === 0) {
        erroresValidacion = true;
        const error = document.querySelector(".error-edad");
        error.textContent = "Se debe agregar edad.";
        
        setTimeout(() => {
            error.textContent = "";
        }, 4000); // 4.000 milisengundos = 4 segundos
    }
    if (isNaN(edad) || edad < 0) {
        erroresValidacion = true;
        const error = document.querySelector(".error-edad");
        error.textContent = "La edad debe ser mayor a 0.";
        
        setTimeout(() => {
            error.textContent = "";
        }, 4000); // 4.000 milisengundos = 4 segundos
    }

    if (txt_descrip.length === 0) {
        erroresValidacion = true;
        const error = document.querySelector(".error-descrip");
        error.textContent = "Se debe agregar descripción.";
        
        setTimeout(() => {
            error.textContent = "";
        }, 4000); // 4.000 milisengundos = 4 segundos
    }

    if (!erroresValidacion) { //Si no hay errores, procede a crear la tarea
        const task = {
            //id: Date.now(), // nos da la cantidad de milisegundos desde 01/01/1970. Genero un numero unico
            txt_tarea: txt_tarea,
            edad: parseInt(edad),
            tipoEdad: tipoEdad,
            txt_descrip: txt_descrip,
            completa: false,
        }

        // MODIFICO ESTAS LINEAS DE CODIGO USANDO TRY - CATCH */

        try {
            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                body: JSON.stringify(task),  // TAREA CREADA EN LA LINEA 42
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })

            const json = await response.json(); // ESPERO A QUE ESA RESPUESTA SE TRANSFORME EN UN JSON
            task.id = json.id;
            tasks.push(task); // AGREGUE LA TAREA A LA LISTA DE TAREAS

        } catch (error) {
            console.log(error);
        }

        taskInput.value = ""; // limpiar el texto en el input //es lo mismo que poner con el evento focus
        taskInputEdad.value = "";
        selectTipoEdad.selectedIndex = 0;
        taskInputDescrip.value = "";
        renderTasks();
    }
})

// VAMOS A OBTENER li
taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("bx-check")) {
        const id = event.target.closest("li").dataset.id;
        const task = tasks.find((task) => task.id == id);
        task.completa = !task.completa; 

        fetch(`http://localhost:3000/tasks/${id}`, { // CAMBIO URL Y ID
            method: 'PUT',
            body: JSON.stringify(task),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((json) => console.log(json))
            .catch((error) => console.log(error)); // AGREGAMOS A LA DOCs CATCH

        event.target.closest("li").querySelector("p").classList.toggle("done");

    };

    if (event.target.classList.contains("bx-trash")) {
        const id = event.target.closest("li").dataset.id;
        const taskIndex = tasks.find((task) => task.id == id);

        tasks.splice(taskIndex, 1);

        fetch(`http://localhost:3000/tasks/${id}`, { // CAMBIO URL Y ID
            method: 'DELETE',
        });

        event.target.closest("li").remove();
    }

});

document.addEventListener("DOMContentLoaded", () => {

    fetch("http://localhost:3000/tasks") // NO NECESITO PONER EL METODO GET
        .then((response) => response.json())
        .then((json) => {
            tasks = json;
            renderTasks();
        })

});
