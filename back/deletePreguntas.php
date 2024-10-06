<?php
include 'conexion.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];

if (isset($id) && is_numeric($id)) {
    $query = "DELETE FROM preguntas WHERE id = $id";
    $result = mysqli_query($conn, $query);

    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Pregunta eliminada correctamente.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar la pregunta.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'ID inválido.']);
}

?>
