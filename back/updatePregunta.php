<?php
// updatePregunta.php
include 'conexion.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];
$nuevaPregunta = $data['nuevaPregunta'];

$query = "UPDATE preguntas SET pregunta = '$nuevaPregunta' WHERE id = $id";
$result = mysqli_query($conn, $query);

echo json_encode(['success' => $result]);
?>
