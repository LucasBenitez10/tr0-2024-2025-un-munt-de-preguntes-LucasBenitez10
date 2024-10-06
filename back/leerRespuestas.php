<?php
header('Content-Type: application/json');
include 'conexion.php';

if (isset($_GET['id']) && is_numeric($_GET['id'])) {
    $pregunta_id = intval($_GET['id']);
} else {
    echo json_encode(['success' => false, 'message' => 'ID de pregunta no válido.']);
    exit;
}

$sql = "SELECT * FROM respostes WHERE pregunta_id = ?"; 
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $pregunta_id);
$stmt->execute();
$result = $stmt->get_result();

$respuestas = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $respuestas[] = $row; 
    }
}

echo json_encode(['success' => true, 'data' => $respuestas]);
$stmt->close();
$conn->close();
?>
