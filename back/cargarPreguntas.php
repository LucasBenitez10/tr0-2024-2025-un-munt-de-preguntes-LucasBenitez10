<?php
require "conexion.php";

// Función para comprobar si una tabla existe
function tableExists($conn, $table) {
    $result = mysqli_query($conn, "SHOW TABLES LIKE '$table'");
    return mysqli_num_rows($result) > 0;
}

// Iniciar una transacción
mysqli_begin_transaction($conn);

try {
    // Eliminar tabla respostes si existe
    if (tableExists($conn, 'respostes')) {
        $sql_drop_respostes = "DROP TABLE respostes";
        if (mysqli_query($conn, $sql_drop_respostes)) {
            //echo "Tabla 'respostes' eliminada correctamente.<br>";
        } else {
            throw new Exception("Error al eliminar la tabla 'respostes': " . mysqli_error($conn));
        }
    }

    // Eliminar tabla preguntas si existe
    if (tableExists($conn, 'preguntas')) {
        $sql_drop_preguntas = "DROP TABLE preguntas";
        if (mysqli_query($conn, $sql_drop_preguntas)) {
            //echo "Tabla 'preguntas' eliminada correctamente.<br>";
        } else {
            throw new Exception("Error al eliminar la tabla 'preguntas': " . mysqli_error($conn));
        }
    }

    // Crear tabla preguntas
    $sql_create_preguntas = "
    CREATE TABLE preguntas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pregunta TEXT NOT NULL,
        resposta_correcta INT,
        imatge VARCHAR(255)
    ) ENGINE=InnoDB";
    if (mysqli_query($conn, $sql_create_preguntas)) {
        //echo "Tabla 'preguntas' creada correctamente.<br>";
    } else {
        throw new Exception("Error al crear la tabla 'preguntas': " . mysqli_error($conn));
    }

    // Crear tabla respostes
    $sql_create_respostes = "
    CREATE TABLE respostes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pregunta_id INT NOT NULL,
        etiqueta VARCHAR(255) NOT NULL,
        FOREIGN KEY (pregunta_id) REFERENCES preguntas(id) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB";
    if (mysqli_query($conn, $sql_create_respostes)) {
        //echo "Tabla 'respostes' creada correctamente.<br>";
    } else {
        throw new Exception("Error al crear la tabla 'respostes': " . mysqli_error($conn));
    }

    // Cargar el archivo JSON
    $json_path = '/preguntas.json';
    if (!file_exists($json_path)) {
        throw new Exception("El archivo JSON no existe en la ruta especificada: $json_path");
    }

    $json = file_get_contents($json_path);
    $preguntas = json_decode($json, true);

    if ($preguntas === null) {
        throw new Exception("Error al decodificar el archivo JSON: " . json_last_error_msg());
    }

    if (isset($preguntas['preguntes']) && is_array($preguntas['preguntes'])) {
        foreach ($preguntas['preguntes'] as $row) {

            if (!isset($row['pregunta'], $row['resposta_correcta'], $row['imatge'], $row['respostes'])) {
                throw new Exception("Estructura de pregunta incompleta en el JSON.");
            }

            $pregunta = mysqli_real_escape_string($conn, $row['pregunta']);
            $imagen = mysqli_real_escape_string($conn, $row['imatge']);

            $sql_insert_pregunta = "
                INSERT INTO preguntas (pregunta, imatge, resposta_correcta)
                VALUES ('$pregunta', '$imagen', NULL)
            ";
            if (mysqli_query($conn, $sql_insert_pregunta)) {
                $pregunta_id = mysqli_insert_id($conn);
                //echo "Pregunta insertada: $pregunta<br>";
            } else {
                throw new Exception("Error al insertar la pregunta: " . mysqli_error($conn));
            }

            $respostes_map = []; 

            foreach ($row['respostes'] as $respuesta) {
                
                if (!isset($respuesta['id'], $respuesta['etiqueta'])) {
                    throw new Exception("Estructura de respuesta incompleta en el JSON.");
                }

                $etiqueta = mysqli_real_escape_string($conn, $respuesta['etiqueta']);

                $sql_insert_resposta = "
                    INSERT INTO respostes (pregunta_id, etiqueta)
                    VALUES ($pregunta_id, '$etiqueta')
                ";
                if (mysqli_query($conn, $sql_insert_resposta)) {
                    $resposta_id_insertado = mysqli_insert_id($conn);
                    $respostes_map[$respuesta['id']] = $resposta_id_insertado;
                    //echo "Respuesta insertada: $etiqueta<br>";
                } else {
                    throw new Exception("Error al insertar la respuesta: " . mysqli_error($conn));
                }
            }

            $resposta_correcta_json_id = (int)$row['resposta_correcta'];
            if (!isset($respostes_map[$resposta_correcta_json_id])) {
                throw new Exception("La respuesta correcta con ID $resposta_correcta_json_id no existe para la pregunta '$pregunta'.");
            }
            $resposta_correcta_db_id = $respostes_map[$resposta_correcta_json_id];

            $sql_update_pregunta = "
                UPDATE preguntas
                SET resposta_correcta = $resposta_correcta_db_id
                WHERE id = $pregunta_id
            ";
            if (mysqli_query($conn, $sql_update_pregunta)) {
                //echo "Pregunta actualizada con la respuesta correcta.<br>";
            } else {
                throw new Exception("Error al actualizar la respuesta correcta: " . mysqli_error($conn));
            }
        }

        mysqli_commit($conn);
        //echo "Todas las preguntas y respuestas se han insertado correctamente.";
    } else {
        throw new Exception("El formato del JSON es incorrecto o no contiene 'preguntes'.");
    }
} catch (Exception $e) {
    mysqli_rollback($conn);
    echo "Se produjo un error: " . $e->getMessage();
}

// Cerrar conexión
mysqli_close($conn);
?>
