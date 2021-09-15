const d = document;
const formulario = d.getElementById("formulario");
const input = d.getElementById("input");
const listaTarea = d.getElementById("lista-tareas");
const template = d.getElementById("template").content;
//el fragment se utiliza para evitar el reflow o la carga de archivos masiva,
//sature la aplicacion y se vuelva mas lenta
const fragment = d.createDocumentFragment();
let tareas = {};

d.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("tareas")) {
        tareas = JSON.parse(localStorage.getItem("tareas"));
    }
    pintarTareas();
});

listaTarea.addEventListener("click", e => {
    btnAccion(e);
})
formulario.addEventListener("submit", e => {
    e.preventDefault();
    setTarea(e);
});

const setTarea = e => {
    if (input.value.trim() === '') {
        return;
    }
    const tarea = {
        id: Date.now(),
        texto: input.value,
        estado: false
    }

    tareas[tarea.id] = tarea;
    formulario.reset();
    input.focus();

    pintarTareas();
}

const pintarTareas = () => {

    localStorage.setItem("tareas", JSON.stringify(tareas));

    if (Object.values(tareas).length === 0) {
        listaTarea.innerHTML = `
        <div class="alert alert-dark text-center">
            No hay tareas pendientes
        </div>
        `
        return;
    }
    listaTarea.innerHTML = "";
    Object.values(tareas).forEach(tarea => {
        //cuando se estan utilizando templates; para llenarlos hay que clonar
        //ese template llenarlo y luego pasarlo con el fragment evitando el reflow
        const clone = template.cloneNode(true);
        clone.querySelector("p").textContent = tarea.texto;

        if (tarea.estado) {
            clone.querySelector(".alert").classList.replace("alert-warning", "alert-primary")
            clone.querySelectorAll(".fas")[0].classList.replace("fa-check-circle", "fa-undo-alt")
            clone.querySelector("p").style.textDecoration = "line-through";
        }
        clone.querySelectorAll(".fas")[0].dataset.id = tarea.id;
        clone.querySelectorAll(".fas")[1].dataset.id = tarea.id;
        fragment.appendChild(clone);
    });
    listaTarea.appendChild(fragment);
}

const btnAccion = e => {
    cambiarEstado(e, "fa-check-circle");
    cambiarEstado(e, "fa-undo-alt", false)

    if (e.target.classList.contains("fa-minus-circle")) {
        delete tareas[e.target.dataset.id];
        pintarTareas();
    }
    e.stopPropagation();
}

const cambiarEstado = (e, clase, estado = true) => {
    if (e.target.classList.contains(clase)) {
        tareas[e.target.dataset.id].estado = estado;
        pintarTareas();
    }
}
