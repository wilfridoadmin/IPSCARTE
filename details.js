document.addEventListener("DOMContentLoaded", () => {
    const paciente = JSON.parse(localStorage.getItem("currentPatient"));
    if (paciente) {
        document.getElementById("patient-name").innerText = paciente.nombre;
        document.getElementById("patient-age").innerText = paciente.edad;
        document.getElementById("patient-doc-type").innerText = paciente.tipoDocumento;
        document.getElementById("patient-doc-number").innerText = paciente.numeroDocumento;
    }

    cargarDetallesGuardados();

    document.getElementById("history-btn").onclick = () => {
        mostrarDetalles("Historia Clínica");
    };
    document.getElementById("order-btn").onclick = () => {
        mostrarDetalles("Orden");
    };
    document.getElementById("evolution-btn").onclick = () => {
        mostrarDetalles("Evolución");
    };

    document.getElementById("save-details-btn").onclick = () => {
        guardarDetalles();
    };

    document.getElementById("cancel-details-btn").onclick = () => {
        ocultarDetalles();
    };

    document.getElementById("final-save-btn").onclick = () => {
        alert("Cambios guardados.");
    };

    document.getElementById("cancel-btn").onclick = () => {
        window.history.back();
    };
});

// Función para mostrar el área de detalles
function mostrarDetalles(tipo) {
    document.getElementById("details-area").style.display = "block";
    document.getElementById("details-text").placeholder = `Escribe aquí la ${tipo.toLowerCase()}.`;
}

// Función para ocultar el área de detalles
function ocultarDetalles() {
    document.getElementById("details-area").style.display = "none";
    document.getElementById("details-text").value = ''; // Limpiar el área de texto
}

// Función para guardar los detalles
function guardarDetalles() {
    const date = document.getElementById("date-selector").value;
    const text = document.getElementById("details-text").value;

    if (date && text) {
        const tipo = document.getElementById("details-text").placeholder.includes("historia") ? "Historia Clínica" : 
                     document.getElementById("details-text").placeholder.includes("orden") ? "Orden" : 
                     "Evolución";

        const detalle = {
            tipo,
            text,
            date,
        };

        // Guardar en localStorage
        let detallesGuardados = JSON.parse(localStorage.getItem("detallesGuardados")) || [];
        detallesGuardados.push(detalle);
        localStorage.setItem("detallesGuardados", JSON.stringify(detallesGuardados));

        agregarDetalleALista(detalle);
        ocultarDetalles();
    } else {
        alert("Por favor, completa todos los campos.");
    }
}

// Función para agregar un detalle a la lista en la interfaz
function agregarDetalleALista(detalle) {
    const listItem = document.createElement("li");
    listItem.classList.add("detail-item");
    listItem.innerHTML = `
        ${detalle.tipo}: ${detalle.text} <span style="font-weight: bold;">(Fecha de Atención: ${detalle.date})</span>
        <button onclick="imprimirDetalle(this)">Imprimir</button>
        <button onclick="eliminarDetalle(this)">Eliminar</button>
    `;
    document.getElementById("details-items").appendChild(listItem);
}

// Función para cargar detalles guardados desde localStorage
function cargarDetallesGuardados() {
    const detallesGuardados = JSON.parse(localStorage.getItem("detallesGuardados")) || [];
    detallesGuardados.forEach(detalle => {
        agregarDetalleALista(detalle);
    });
}

function imprimirDetalle(btn) {
    const detailText = btn.parentElement.textContent;
    const tipo = detailText.split(': ')[0]; // Extrae el tipo
    const text = detailText.split(': ')[1].split(' (')[0]; // Extrae el texto
    const date = detailText.match(/Fecha de Atención: (.*)/)[1]; // Extrae la fecha

    const newWindow = window.open('', '', 'width=600,height=400');
    newWindow.document.write(`
        <html>
            <head>
                <title>Imprimir Detalle</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        padding: 20px;
                        text-align: center;
                    }
                    .ips-name {
                        color: #28A745;
                        border: 2px solid #28A745;
                        padding: 10px;
                        margin-bottom: 20px;
                        font-size: 1.5em;
                    }
                    .patient-info {
                        margin-bottom: 20px;
                        border: 1px solid #ccc;
                        padding: 10px;
                        border-radius: 5px;
                    }
                    .patient-info p {
                        margin: 5px 0;
                    }
                    .file-name {
                        font-size: 2em;
                        font-weight: bold;
                        color: #007BFF;
                        margin: 20px 0;
                        border: 2px solid #28A745;
                        padding: 10px;
                    }
                    .attention-date {
                        font-weight: bold;
                        font-size: 1.2em;
                        margin: 10px 0;
                    }
                    .detail-text {
                        margin-top: 20px;
                        font-size: 1.5em; /* Aumenta el tamaño de la letra */
                        font-weight: bold; /* Negritas */
                        border: 1px solid #ccc;
                        padding: 10px;
                        border-radius: 5px;
                        background-color: #f9f9f9;
                    }
                    .patient-info {
                        display: flex;
                        justify-content: space-between;
                    }
                    .patient-info div {
                        flex: 1;
                        margin: 0 10px;
                        padding: 5px;
                        border: 1px solid #ccc;
                        text-align: left;
                    }
                    @media print {
                        button {
                            display: none; /* Oculta los botones al imprimir */
                        }
                    }
                </style>
            </head>
            <body>
                <h1 class="ips-name">IPS Corazón de Arte Terapia</h1>
                <div class="patient-info">
                    <div><strong>Nombre:</strong> ${document.getElementById("patient-name").innerText}</div>
                    <div><strong>Edad:</strong> ${document.getElementById("patient-age").innerText}</div>
                    <div><strong>Tipo de Documento:</strong> ${document.getElementById("patient-doc-type").innerText}</div>
                    <div><strong>Número de Documento:</strong> ${document.getElementById("patient-doc-number").innerText}</div>
                </div>
                <h3 class="file-name">${tipo}</h3>
                <p class="attention-date">Fecha de Atención: ${date}</p>
                <div class="detail-text">${text}</div>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
        </html>
    `);
}


// Función para eliminar un detalle
function eliminarDetalle(btn) {
    const detailText = btn.parentElement.textContent;
    const date = detailText.match(/Fecha de Atención: (.*)/)[1]; // Extrae la fecha

    // Elimina el elemento de la interfaz
    btn.parentElement.remove();

    // Actualiza localStorage
    let detallesGuardados = JSON.parse(localStorage.getItem("detallesGuardados")) || [];
    detallesGuardados = detallesGuardados.filter(detalle => !(detalle.date === date && detalle.text === detailText.split(': ')[1].split(' (')[0]));
    localStorage.setItem("detallesGuardados", JSON.stringify(detallesGuardados));
}


