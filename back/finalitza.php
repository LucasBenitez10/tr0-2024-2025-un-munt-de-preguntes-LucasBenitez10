<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(404);
    echo json_encode(['error' => 'Petición HTTP no válida']);
    exit;
}

if (!isset($_SESSION['preguntas'])) {
    http_response_code(404);
    echo json_encode(['error' => 'No hay preguntas']);
    exit;
}

$datos = json_decode(file_get_contents('php://input'), true);

if (!isset($datos['respuestas']) || !is_array($datos['respuestas'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato de datos no válido']);
    exit;
}

$respuesta_usuario = $datos['respuestas'];
$preguntas = $_SESSION['preguntas'];
$correctas = 0;
$cantidad_preguntas = count($respuesta_usuario); // Cambiar aquí

foreach ($preguntas as $pregunta) {
    $pregunta_id = $pregunta['id'];
    $correcta = $pregunta['correcta'];

    foreach ($respuesta_usuario as $respuesta) { // Cambiar aquí
        if ($respuesta['preguntaId'] == $pregunta_id) {
            if ($respuesta['respuestaId'] == $correcta) {
                $correctas++;
            }
        }
    }
}

echo json_encode(['correctas' => $correctas, 'total' => $cantidad_preguntas]);

?>
