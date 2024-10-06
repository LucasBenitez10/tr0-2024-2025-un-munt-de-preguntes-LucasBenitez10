<?php
header('Content-Type: application/json');
include 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->etiqueta)) {
    $id = intval($data->id);
    $etiqueta = $data->etiqueta;

    $sql = "UPDATE respostes SET etiqueta = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $etiqueta, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
}
$conn->close();
?>
