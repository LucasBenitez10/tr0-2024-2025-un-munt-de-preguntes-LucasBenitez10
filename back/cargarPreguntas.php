<?php
require "conexion.php";

// Función para comprobar si una tabla existe
function tableExists($conn, $table) {
    $result = mysqli_query($conn, "SHOW TABLES LIKE '$table'");
    return mysqli_num_rows($result) > 0;
}

// Eliminar y crear tabla preguntas
if (tableExists($conn, 'preguntas')) {
    $sql_drop_preguntas = "DROP TABLE preguntas";
    mysqli_query($conn, $sql_drop_preguntas);
}

$sql_create_preguntas = "
CREATE TABLE preguntas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pregunta TEXT NOT NULL,
    resposta_correcta INT NOT NULL,
    imatge VARCHAR(255)
)";
if (mysqli_query($conn, $sql_create_preguntas)) {
    echo "Tabla 'preguntas' creada correctamente.<br>";
} else {
    echo "Error al crear la tabla 'preguntas': " . mysqli_error($conn) . "<br>";
}

// Eliminar y crear tabla respostes
if (tableExists($conn, 'respostes')) {
    $sql_drop_respostes = "DROP TABLE respostes";
    mysqli_query($conn, $sql_drop_respostes);
}

$sql_create_respostes = "
CREATE TABLE respostes (
    id INT NOT NULL,
    pregunta_id INT NOT NULL,
    etiqueta VARCHAR(255) NOT NULL,
    FOREIGN KEY (pregunta_id) REFERENCES preguntas(id)
)";
if (mysqli_query($conn, $sql_create_respostes)) {
    echo "Tabla 'respostes' creada correctamente.<br>";
} else {
    echo "Error al crear la tabla 'respostes': " . mysqli_error($conn) . "<br>";
}

// Cargar el archivo JSON
$json = file_get_contents('../../preguntas.json');
$preguntas = json_decode($json, true);

if ($preguntas) {
    foreach ($preguntas['preguntes'] as $row) {
        $pregunta = mysqli_real_escape_string($conn, $row['pregunta']);
        $correcta = (int)$row['resposta_correcta'];
        $imagen = mysqli_real_escape_string($conn, $row['imatge']);

        // Insertar en la tabla preguntas
        $sql_insert_pregunta = "
            INSERT INTO preguntas (pregunta, resposta_correcta, imatge)
            VALUES ('$pregunta', $correcta, '$imagen')
        ";
        if (mysqli_query($conn, $sql_insert_pregunta)) {
            $pregunta_id = mysqli_insert_id($conn);
            echo "Pregunta insertada: $pregunta<br>";

            // Insertar respuestas
            foreach ($row['respostes'] as $respuesta) {
                $respuesta_id = (int)$respuesta['id'];
                $etiqueta = mysqli_real_escape_string($conn, $respuesta['etiqueta']);

                $sql_insert_resposta = "
                    INSERT INTO respostes (id, pregunta_id, etiqueta)
                    VALUES ($respuesta_id, $pregunta_id, '$etiqueta')
                ";
                if (mysqli_query($conn, $sql_insert_resposta)) {
                    echo "Respuesta insertada: $etiqueta<br>";
                } else {
                    echo "Error al insertar la respuesta: " . mysqli_error($conn) . "<br>";
                }
            }
        } else {
            echo "Error al insertar la pregunta: " . mysqli_error($conn) . "<br>";
        }
    }
} else {
    echo "Error al decodificar el archivo JSON.<br>";
}

// Cerrar conexión
mysqli_close($conn);
?>
