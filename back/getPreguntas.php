<?php
session_start();

require_once 'cargarPreguntas.php';  


if (isset($_SESSION['preguntas'])) {
    unset($_SESSION['preguntas']); 
}

header('Content-Type: application/json');

require "conexion.php";

$sql = "SELECT * FROM preguntas";
$result = mysqli_query($conn, $sql);

if(!$result) {
    echo json_encode(["error" => "Error en la consulta: " . mysqli_error($conn)]);
    exit; 
}

if(mysqli_num_rows($result) > 0) {
    $preguntas = [];

    while($row = mysqli_fetch_assoc($result)) {
        $pregunta_id = $row['id'];

        $sqlRespostes = "SELECT * FROM respostes WHERE pregunta_id = $pregunta_id";
        $resultRespostes = mysqli_query($conn, $sqlRespostes);

        $respuestas = [];

        if(!$resultRespostes) {
            echo json_encode(["error" => "Error en la consulta de respuestas: " . mysqli_error($conn)]);
            exit; 
        }

        while($rowRespostes = mysqli_fetch_assoc($resultRespostes)) {
            $respuestas[] = [
                'id' => $rowRespostes['id'],
                'resposta' => $rowRespostes['etiqueta']
            ];
        }

        $preguntas[] = [
            'id' => $row['id'],
            'pregunta' => $row['pregunta'],
            'respostes' => $respuestas,
            'correcta' => $row['resposta_correcta'],    
            'imatge' => $row['imatge']
        ];
    }

    $cantidadPreguntas = min(10, count($preguntas));

    $preguntas_aleatorias = array_rand($preguntas, $cantidadPreguntas); 
    $preguntas_seleccionadas = [];

    foreach ($preguntas_aleatorias as $index) {
        $preguntas_seleccionadas[] = $preguntas[$index];
    }

    $_SESSION['preguntas'] = $preguntas_seleccionadas;

    echo json_encode(["preguntes" => $preguntas_seleccionadas]);
} else {
    http_response_code(404);
    echo json_encode(["error" => "No se encontraron preguntas en la base de datos"]);
}

mysqli_close($conn);
?>
