<?php   
$servername = "localhost:3306"; 
$database = "a23lucbensoj_quizz";
$username = "a23lucbensoj_lucas";
$password = "Lucas25_daw";

 //datos unicamente para ejectur en xampp local
<<<<<<< HEAD
//$servername = "localhost"; 
//$database = "preguntas";
//$username = "root";
//$password = "";
=======
 $servername = "localhost"; 
$database = "preguntas";
 $username = "root";
$password = "";
>>>>>>> e3374d9662d6508f6b85d262ee400f8871cdd6c9

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>
