//CRUUUUUD

document.addEventListener('DOMContentLoaded', function () {
    const agregarPreguntaForm = document.getElementById('agregarPreguntaForm');
    const editarPreguntaForm = document.getElementById('editarPreguntaForm');
    const eliminarPreguntaForm = document.getElementById('eliminarPreguntaForm');
    const verPreguntasForm = document.getElementById('verPreguntasForm');
    const preguntasList = document.getElementById('preguntasList');

    // Manejador del formulario para agregar una nueva pregunta
    agregarPreguntaForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const pregunta = document.getElementById('pregunta').value;
        const resposta_correcta = document.getElementById('resposta_correcta').value;
        const imatge = document.getElementById('imatge').value;

        const data = { pregunta, resposta_correcta, imatge };

        // Enviar la pregunta al servidor para ser creada
        fetch('../../back/addPregunta.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Pregunta agregada correctamente.');
                agregarPreguntaForm.reset(); // Limpiar formulario
            }
        });
    });

    // Manejador del formulario para editar una pregunta
    editarPreguntaForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const id = document.getElementById('editarPreguntaId').value;
        const nuevaPregunta = document.getElementById('nuevaPregunta').value;

        fetch('../../back/updatePregunta.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, nuevaPregunta })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Pregunta actualizada correctamente.');
                editarPreguntaForm.reset();
            }
        });
    });

    // Manejador del formulario para eliminar una pregunta
    // Manejador del formulario para eliminar una pregunta
    eliminarPreguntaForm.addEventListener('submit', function (e) {
        e.preventDefault();
    
        const id = document.getElementById('eliminarPreguntaId').value;
    
        if (confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
            // Usar el método POST con body en lugar de DELETE con query string
            fetch(`../../back/deletePregunta.php`, {
                method: 'POST', // O POST si es necesario en lugar de DELETE
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })  // Pasamos el ID en el cuerpo de la solicitud
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Pregunta eliminada correctamente.');
                    eliminarPreguntaForm.reset(); // Limpiar el formulario
                    cargarPreguntas(); // Recargar la lista de preguntas actualizada
                } else {
                    alert('Error al eliminar la pregunta: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Error al eliminar la pregunta:', error);
                alert('Error al eliminar la pregunta.');
            });
        }
    });
    


    // Manejador del formulario para ver todas las preguntas
    verPreguntasForm.addEventListener('submit', function (e) {
        e.preventDefault();
        cargarPreguntas();
    });

    // Función para cargar todas las preguntas desde el servidor
    function cargarPreguntas() {
        fetch('../../back/leerPreguntas.php')
            .then(response => response.json())
            .then(preguntas => {
                preguntasList.innerHTML = '';

                preguntas.forEach(pregunta => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>ID ${pregunta.id}</strong>: ${pregunta.pregunta} 
                        (Correcta: ${pregunta.resposta_correcta}) 
                        <img src="${pregunta.imatge}" alt="Imagen" style="max-width:100px;" />
                    `;
                    preguntasList.appendChild(li);
                });
            });
    }
});



document.addEventListener('DOMContentLoaded', function () {
    const agregarRespuestaForm = document.getElementById('agregarRespuestaForm');
    const editarRespuestaForm = document.getElementById('editarRespuestaForm');
    const eliminarRespuestaForm = document.getElementById('eliminarRespuestaForm');
    const verRespuestasForm = document.getElementById('verRespuestasForm');
    const respuestasList = document.getElementById('respuestasList'); // Asegúrate de que este elemento exista

    // Manejador del formulario para agregar una nueva respuesta
    agregarRespuestaForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const pregunta_id = document.getElementById('pregunta_id').value;
        const etiqueta = document.getElementById('respuesta').value; // Cambié respuesta a etiqueta

        const data = { pregunta_id, etiqueta }; 

        // Enviar la respuesta al servidor para ser creada
        fetch('../../back/addRespuesta.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Respuesta agregada correctamente.');
                agregarRespuestaForm.reset(); // Limpiar formulario
            } else {
                alert('Error al agregar respuesta: ' + result.error);
            }
        });
    });

    // Manejador del formulario para editar una respuesta
    editarRespuestaForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const id = document.getElementById('editarRespuestaId').value;
        const nuevaEtiqueta = document.getElementById('nuevaRespuesta').value; // Cambié nuevaRespuesta a nuevaEtiqueta

        fetch('../../back/updateRespuesta.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, etiqueta: nuevaEtiqueta }) // Cambié nuevaRespuesta a etiqueta
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Respuesta actualizada correctamente.');
                editarRespuestaForm.reset();
            } else {
                alert('Error al actualizar respuesta: ' + result.error);
            }
        });
    });

    // Manejador del formulario para eliminar una respuesta
    eliminarRespuestaForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const id = document.getElementById('eliminarRespuestaId').value;

        if (confirm('¿Estás seguro de que deseas eliminar esta respuesta?')) {
            fetch('../back/deleteRespuesta.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Respuesta eliminada correctamente.');
                    eliminarRespuestaForm.reset(); // Limpiar el formulario
                    cargarRespuestas(); // Recargar la lista de respuestas actualizada
                } else {
                    alert('Error al eliminar la respuesta: ' + result.error);
                }
            });
        }
    });

    // Manejador del formulario para ver todas las respuestas
    verRespuestasForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const pregunta_id = document.getElementById('verPreguntaId').value; // Agregado para pasar el ID de la pregunta
        cargarRespuestas(pregunta_id); // Pasar el ID de la pregunta
    });

    // Función para cargar todas las respuestas desde el servidor
    function cargarRespuestas(pregunta_id) {
        fetch('../../back/leerRespuestas.php')
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    respuestasList.innerHTML = ''; // Asegúrate de que el elemento respuestasList exista

                    result.data.forEach(respuesta => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <strong>ID ${respuesta.id}</strong>: ${respuesta.etiqueta} 
                            (ID Pregunta: ${respuesta.pregunta_id}) 
                        `;
                        respuestasList.appendChild(li);
                    });
                } else {
                    alert('No se encontraron respuestas: ' + result.message);
                }
            })
            .catch(error => {
                console.error('Error al cargar las respuestas:', error);
            });
    }

    // Asegúrate de que el elemento respuestasList exista en tu HTML
});
