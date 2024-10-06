<?php
header('Content-Type: application/json');
include 'conexion.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id)) {
    $id = intval($data->id);

    $sql = "DELETE FROM respostes WHERE pregunta_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'ID no válido.']);
}
$conn->close();
?>
