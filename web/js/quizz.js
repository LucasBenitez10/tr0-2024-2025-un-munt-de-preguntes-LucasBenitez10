let preguntas = []; 
const estatDeLaPartida = {
    contadorPreguntas: 0, 
    respuestas: [] 
};

let indiceActual = 0;
let timer; 
const tiempoLimite = 30;

// Elementos del DOM
const botonIniciar = document.getElementById("iniciarJuego");
const botonesSigAnt = document.getElementById("botones");
const botonAnterior = document.getElementById('anteriorPregunta');
const botonSiguiente = document.getElementById("siguientePregunta");
const botonEnviarRespuestas = document.getElementById("enviarRespuestas"); 
const botonReiniciar = document.getElementById("reiniciarJuego");
const pantallaFinal = document.getElementById("pantallaFinal");
const timerDisplay = document.getElementById("timer");
const preguntaContainer = document.getElementById('contenedor-preguntas');
const tBody = document.getElementById('tBody');


botonIniciar.addEventListener("click", () => {
    const nombreInput = document.getElementById("nombre");
    const cantidadPreguntasInput = document.getElementById("cantidadPreguntas");
    const nombre = nombreInput.value;

    const cantidadPreguntas = parseInt(cantidadPreguntasInput.value); 

    if (nombre && cantidadPreguntas > 0 && cantidadPreguntas < 11) {
        localStorage.setItem("nombre", nombre);
        botonesSigAnt.classList.remove("none");
        document.getElementById("iniciar").className = "none";
        cargarPreguntas(cantidadPreguntas); 
    } else {
        alert("Por favor, ingresa tu nombre y la cantidad de preguntas (1-10).");
    }
});

function cargarPreguntas(cantidadPreguntas) {
    fetch('/tr0-2024-2025-un-munt-de-preguntes-LucasBenitez10/back/getPreguntas.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red al cargar las preguntas');
            }
            return response.json();
        })
        .then(data => {
            preguntas = data.preguntes.slice(0, cantidadPreguntas); 
            estatDeLaPartida.respuestas = preguntas.map(pregunta => ({
                id: pregunta.id,
                respuesta: null, 
            }));
            mostrarPreguntas();
            iniciarTemporizador();
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error al cargar las preguntas.");
        });
}

function mostrarPreguntas() {
    const contenedor_preguntas = document.getElementById('contenedor-preguntas');
    const preguntaActual = preguntas[indiceActual]; 

    let htmlStr = `<h2>${preguntaActual.pregunta}</h2>`;
    htmlStr += `<img src="${preguntaActual.imatge}" alt="Imagen de la pregunta" style="max-width: 400px; height: auto;"> <br/>`;
    preguntaActual.respostes.forEach((resposta) => {
        htmlStr += `<input type="radio" name="pregunta-${indiceActual}" value="${resposta.id}">${resposta.resposta}</input> <br/>`;
    });

    contenedor_preguntas.innerHTML = htmlStr;

    const radios = contenedor_preguntas.querySelectorAll(`input[name="pregunta-${indiceActual}"]`);
    radios.forEach(radio => {
        radio.addEventListener('click', actualizarEstatPartida);
    });

    
    if (indiceActual === estatDeLaPartida.respuestas.length - 1) { 
        botonEnviarRespuestas.classList.remove("none");
    } else {
        botonEnviarRespuestas.classList.add("none");
    }

    actualizarEstatPartida();
    actualizarBotones();
}

function iniciarTemporizador() {
    let tiempoRestante = tiempoLimite; 
    timerDisplay.innerText = `Tiempo restante: ${tiempoRestante} segundos`; 

    timer = setInterval(() => {
        tiempoRestante--; 
        timerDisplay.innerText = `Tiempo restante: ${tiempoRestante} segundos`; 
        
        if (tiempoRestante <= 0) {
            clearInterval(timer); 
            alert("¡Se acabó el tiempo!"); 
            enviarResultados(estatDeLaPartida.respuestas.map(p => ({
                preguntaId: p.id,
                respuestaId: p.respuesta
            }))); 
        }
    }, 1000); 
}

function actualizarEstatPartida() {
    const respuestaSeleccionada = document.querySelector(`input[name="pregunta-${indiceActual}"]:checked`);

    if (respuestaSeleccionada) {
        const respuestaId = respuestaSeleccionada.value;
        estatDeLaPartida.respuestas[indiceActual].respuesta = respuestaId; 
    }
    
    
    estatDeLaPartida.contadorPreguntas = estatDeLaPartida.respuestas.filter(r => r.respuesta !== null).length;
}

function actualizarBotones() {
    botonAnterior.disabled = indiceActual === 0;
    botonSiguiente.disabled = indiceActual === estatDeLaPartida.respuestas.length - 1;
}

botonAnterior.addEventListener("click", () => {
    if (indiceActual > 0) {
        actualizarEstatPartida(); 
        indiceActual--; 
        mostrarPreguntas(); 
    }
});

botonSiguiente.addEventListener("click", () => {
    if (indiceActual < estatDeLaPartida.respuestas.length - 1) {
        actualizarEstatPartida();
        indiceActual++; 
        mostrarPreguntas(); 
    }
});

botonEnviarRespuestas.addEventListener("click", () => {
    const respuestas = estatDeLaPartida.respuestas.map(p => ({
        preguntaId: p.id,
        respuestaId: p.respuesta
    }));
    console.log(respuestas);
    clearInterval(timer); 
    enviarResultados(respuestas);
    preguntaContainer.className = "none";
    botonesSigAnt.className = "none";
});

function enviarResultados(respuestas) {
    fetch('/tr0-2024-2025-un-munt-de-preguntes-LucasBenitez10/back/finalitza.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ respuestas }) 
    })
    .then(response => response.json())
    .then(data => {
        mostrarResultados(data);
        preguntaContainer.className = "none";
        botonesSigAnt.className = "none";
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function mostrarResultados(data) {
    let htmlStr = '';
    htmlStr += `<h2>Resultados de ${localStorage.getItem("nombre")}</h2>
    <p>Respuestas correctas: ${data.correctas} / ${data.total}</p>
    `;
    pantallaFinal.innerHTML = htmlStr;
    pantallaFinal.className = "block";
    botonReiniciar.className = "block";
}

botonReiniciar.addEventListener("click", () => {
    location.reload();
    localStorage.clear();
    fetch ("../back/finalizarJoc.php",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
     }).then(response => response.json())
     .then(data => {
         console.log("Respuesta" + data);
     })
     .catch(error => {
         console.error('Error:', error);
     });
});