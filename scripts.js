document.addEventListener("DOMContentLoaded", () => {
    const user = localStorage.getItem("user");
    if (!user) {
        document.getElementById("login-container").style.display = "block";
        document.getElementById("main-content").style.display = "none";
    } else {
        cargarPacientes(); // Cargar pacientes si está logueado
        document.getElementById("login-container").style.display = "none";
        document.getElementById("main-content").style.display = "block";
    }

    const addPatientBtn = document.getElementById("add-patient-btn");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementsByClassName("close");

    if (addPatientBtn) {
        addPatientBtn.onclick = () => {
            modal.style.display = "block";
        };
    }

    if (closeModal.length > 0) {
        for (let i = 0; i < closeModal.length; i++) {
            closeModal[i].onclick = () => {
                modal.style.display = "none";
            };
        }
    }

    const patientForm = document.getElementById("patient-form");
    if (patientForm) {
        patientForm.addEventListener("submit", (e) => {
            e.preventDefault();
            agregarPaciente();
            modal.style.display = "none";
        });
    }
});

// Función para cargar pacientes
function cargarPacientes() {
    const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
    const pacientesList = document.getElementById("patients-list");
    const patientCount = document.getElementById("patient-count");

    if (pacientesList) {
        const isAdmin = true; // Cambiar a false para simular un usuario no admin

        pacientesList.innerHTML = pacientes.map((p, index) => `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.edad}</td>
                <td>${p.fechaIngreso}</td>
                <td>
                    <button onclick="verDetalles('${p.nombre}')">Ver</button>
                    ${isAdmin ? `<button onclick="eliminarPaciente(${index})">Eliminar</button>` : ''}
                </td>
            </tr>
        `).join('');

        patientCount.innerHTML = `Pacientes Atendidos: ${pacientes.length}`;
    } else {
        console.error("El elemento 'patients-list' no se encontró.");
    }
}

// Función para agregar un paciente
function agregarPaciente() {
    const nombre = document.getElementById("patient-name").value;
    const tipoDocumento = document.getElementById("document-type").value;
    const numeroDocumento = document.getElementById("document-number").value;
    const edad = document.getElementById("patient-age").value;
    const fechaNacimiento = document.getElementById("birth-date").value;
    const fechaIngreso = document.getElementById("admission-date").value;

    const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
    pacientes.push({
        nombre,
        tipoDocumento,
        numeroDocumento,
        edad,
        fechaNacimiento,
        fechaIngreso
    });

    localStorage.setItem("pacientes", JSON.stringify(pacientes));
    cargarPacientes();
}

// Función para eliminar un paciente
function eliminarPaciente(index) {
    const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
    pacientes.splice(index, 1);
    localStorage.setItem("pacientes", JSON.stringify(pacientes));
    cargarPacientes();
}

// Función para ver detalles
function verDetalles(nombre) {
    const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
    const paciente = pacientes.find(p => p.nombre === nombre);
    if (paciente) {
        localStorage.setItem("currentPatient", JSON.stringify(paciente));
        window.location.href = "details.html";
    }
}
