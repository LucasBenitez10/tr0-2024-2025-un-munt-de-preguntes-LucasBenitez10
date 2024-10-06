<?php
// addPregunta.php
include 'conexion.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$pregunta = $data['pregunta'];
$resposta_correcta = $data['resposta_correcta'];
$imatge = $data['imatge'];

$query = "INSERT INTO preguntas (pregunta, resposta_correcta, imatge) VALUES ('$pregunta', '$resposta_correcta', '$imatge')";
$result = mysqli_query($conn, $query);

echo json_encode(['success' => $result]);
?>
