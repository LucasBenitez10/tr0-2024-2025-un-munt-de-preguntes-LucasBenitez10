//CRUUUUUD

document.addEventListener('DOMContentLoaded', function () {
    const agregarPreguntaForm = document.getElementById('agregarPreguntaForm');
    const editarPreguntaForm = document.getElementById('editarPreguntaForm');
    const eliminarPreguntaForm = document.getElementById('eliminarPreguntaForm');
    const verPreguntasForm = document.getElementById('verPreguntasForm');
    const preguntasList = document.getElementById('preguntasList');

    agregarPreguntaForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const pregunta = document.getElementById('pregunta').value;
        const resposta_correcta = document.getElementById('resposta_correcta').value;
        const imatge = document.getElementById('imatge').value;

        const data = { pregunta, resposta_correcta, imatge };

        fetch('/tr0-2024-2025-un-munt-de-preguntes-LucasBenitez10/back/addPregunta.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Pregunta agregada correctamente.');
                agregarPreguntaForm.reset(); 
            }
        });
    });

  
    editarPreguntaForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const id = document.getElementById('editarPreguntaId').value;
        const nuevaPregunta = document.getElementById('nuevaPregunta').value;

        fetch('/tr0-2024-2025-un-munt-de-preguntes-LucasBenitez10/back/updatePregunta.php', {
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


    eliminarPreguntaForm.addEventListener('submit', function (e) {
        e.preventDefault();
    
        const id = document.getElementById('eliminarPreguntaId').value;
    
        if (confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
    
            fetch(`/tr0-2024-2025-un-munt-de-preguntes-LucasBenitez10/back/deletePregunta.php`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })  
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Pregunta eliminada correctamente.');
                    eliminarPreguntaForm.reset(); 
                    cargarPreguntas(); 
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
    

    verPreguntasForm.addEventListener('submit', function (e) {
        e.preventDefault();
        cargarPreguntas();
    });

    function cargarPreguntas() {
        fetch('/tr0-2024-2025-un-munt-de-preguntes-LucasBenitez10/back/leerPreguntas.php')
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
    const respuestasList = document.getElementById('respuestasList'); 

    
    agregarRespuestaForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const pregunta_id = document.getElementById('pregunta_id').value;
        const etiqueta = document.getElementById('respuesta').value; 

        const data = { pregunta_id, etiqueta }; 

        
        fetch('../../back/addRespuesta.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Respuesta agregada correctamente.');
                agregarRespuestaForm.reset(); 
            } else {
                alert('Error al agregar respuesta: ' + result.error);
            }
        });
    });

    
    editarRespuestaForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const id = document.getElementById('editarRespuestaId').value;
        const nuevaEtiqueta = document.getElementById('nuevaRespuesta').value; 

        fetch('/tr0-2024-2025-un-munt-de-preguntes-LucasBenitez10/back/updateRespuesta.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, etiqueta: nuevaEtiqueta }) 
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

   
    eliminarRespuestaForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const id = document.getElementById('eliminarRespuestaId').value;

        if (confirm('¿Estás seguro de que deseas eliminar esta respuesta?')) {
            fetch('/tr0-2024-2025-un-munt-de-preguntes-LucasBenitez10/back/deleteRespuesta.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Respuesta eliminada correctamente.');
                    eliminarRespuestaForm.reset(); 
                    cargarRespuestas(); 
                } else {
                    alert('Error al eliminar la respuesta: ' + result.error);
                }
            });
        }
    });

   
    verRespuestasForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const pregunta_id = document.getElementById('verPreguntaId').value; 
        cargarRespuestas(pregunta_id); 
    });

    
    function cargarRespuestas(pregunta_id) {
        fetch(`/tr0-2024-2025-un-munt-de-preguntes-LucasBenitez10/back/leerRespuestas.php?id=${pregunta_id}`) 
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    respuestasList.innerHTML = '';
    
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

});
