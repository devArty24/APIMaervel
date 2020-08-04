<?php

include("./conexion/db.php");

    $control = $_REQUEST["type"];

switch($control){
    case "showSucursales":
        $query = "SELECT * FROM sucursales WHERE disponible = 1";
        $result = mysqli_query($conn, $query);

        $array = array();
        if($result){
            if(mysqli_num_rows($result) >0){
                while($fila = mysqli_fetch_array($result) ){
                    $elementNew = array($fila["idSucursal"],$fila["nombreSucursal"],$fila["direccionSucursal"],$fila["createDate"]);
                    array_push($array, $elementNew);
                }
            }

            mysqli_free_result($result);

            mysqli_close($conn);
        }

        echo json_encode($array);
    break;

    case "saveSucursal":
        $nombre = $_REQUEST["name"];
        $direccion = $_REQUEST["direccion"];
        $activa = $_REQUEST["activa"];
        $comics = $_REQUEST["dispoHere"];

        $sql = "INSERT INTO sucursales(nombreSucursal, direccionSucursal, disponible,createDate)VALUES('$nombre','$direccion',$activa,NOW())";
        if (mysqli_query($conn, $sql)) {
            $band = 1;
            $idScursal = mysqli_insert_id($conn);
        }else{            
            $band = 0;
        }
        if($band == 1){
            $n = sizeof($comics);
            for($i=0;$i<$n;$i++){
                $idComic = $comics[$i];
                $sql2 = "INSERT INTO inventario(idComic,idSucursal)VALUES($idComic,$idScursal)";
                mysqli_query($conn, $sql2);
            }
            echo "save";
        }else{
            echo "Error: " . $sql . "<br>" . mysqli_error($conn);
        }

        mysqli_close($conn);
    break;

    case "getSucursales":
        $idComic = $_REQUEST["idComic"];
        $query = "SELECT s.nombreSucursal FROM inventario i, sucursales s WHERE s.idSucursal = i.idSucursal AND idComic = $idComic";
        $result = mysqli_query($conn, $query);

        $array = array();
        if($result){
            if(mysqli_num_rows($result) >0){
                while($fila = mysqli_fetch_array($result) ){
                    $elementNew = array($fila["nombreSucursal"]);
                    array_push($array, $elementNew);
                }
            }

            mysqli_free_result($result);

            mysqli_close($conn);
        }
        echo json_encode($array);
    break;

    case "updateSucursal":
        $nombre = $_REQUEST["sucursal"];
        $direccion = $_REQUEST["direccion"];
        $idSucursal = $_REQUEST["inin"];
        $sql = "UPDATE sucursales SET nombreSucursal='$nombre', direccionSucursal='$direccion' WHERE idSucursal = $idSucursal";
        mysqli_query($conn, $sql);
        echo "update";
    break;
    case "deleteSucursal":
        $idSucursal = $_REQUEST["idS"];
        $sql = "UPDATE sucursales SET disponible = 0 WHERE idSucursal = $idSucursal";
        mysqli_query($conn, $sql);
        echo "deleted";
    break;
}

?>