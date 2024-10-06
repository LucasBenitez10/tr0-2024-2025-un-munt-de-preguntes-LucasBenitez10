<?php
// getPreguntas.php
include 'conexion.php';

$query = "SELECT * FROM preguntas";
$result = mysqli_query($conn, $query);

$preguntas = [];

while ($row = mysqli_fetch_assoc($result)) {
    $preguntas[] = $row;
}

echo json_encode($preguntas);
?>
