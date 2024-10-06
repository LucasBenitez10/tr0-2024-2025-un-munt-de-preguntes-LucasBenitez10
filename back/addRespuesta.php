<?php
header('Content-Type: application/json');
include 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

// Verifica que se reciban los datos necesarios
if (isset($data->pregunta_id) && isset($data->etiqueta)) {
    $pregunta_id = $data->pregunta_id;
    $etiqueta = $data->etiqueta;

    // Obtiene la cantidad de respuestas para esta pregunta
    $result = $conn->query("SELECT COUNT(*) as total FROM respostes WHERE pregunta_id = $pregunta_id");
    $row = $result->fetch_assoc();
    $total_respuestas = $row['total'];

    // Asignar el nuevo ID para la respuesta
    // Si es la primera respuesta, se le asigna el 1, si es la segunda el 2, y así sucesivamente
    $new_id = $total_respuestas + 1;

    // Inserta la nueva respuesta
    $sql = "INSERT INTO respostes (id, pregunta_id, etiqueta) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iis", $new_id, $pregunta_id, $etiqueta);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $new_id]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos.']);
}

$conn->close();
?>
