<?php

    $conn = mysqli_connect("localhost", "root", "", "prueba");

    if(!$conn){
        echo "Error: No se pudo conectar a MySQL";
    }

?>