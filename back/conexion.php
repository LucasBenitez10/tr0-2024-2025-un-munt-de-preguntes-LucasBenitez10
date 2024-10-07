<?php
//$servername = "localhost:3306"; 
//$database = "a23lucbensoj_quizz";
//$username = "a23lucbensoj_lucas";
//$password = "Lucas25_daw";


$servername = "localhost"; 
$database = "preguntas";
$username = "root";
$password = "";

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>
