<?php 
	if(!isset($_SESSION)) {
        session_start();        
    }    

	include_once('../../../admin/class.php');
	$class = new constante();	
	$fecha = $class->fecha_hora();	
	$data = 0;

	if ($_POST['oper'] == "add") {
		$sql = "SELECT count(*)count FROM formas_pago WHERE codigo = UPPER('".$_POST['codigo']."')";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$data = $row[0];
		}
		if ($data != 0) {
			$data = "2"; ///CODIGO REPETIDO
		} else {
			$sql = "SELECT count(*)count FROM formas_pago WHERE nombre = UPPER('".$_POST['nombre']."')";
			$sql = $class->consulta($sql);		
			while ($row = $class->fetch_array($sql)) {
				$data = $row[0];
			}
			if ($data != 0) {
				$data = "3"; //NOMBRE REPETIDO
			} else {
				$sql = "INSERT INTO formas_pago (codigo,nombre,estado,moneda,tiempo,fecha_creacion)  VALUES ('".$_POST['codigo']."', '".$_POST['nombre']."', '".$_POST['estado']."', '".$_POST['moneda']."', '".$_POST['tiempo']."', '".$fecha."');";

				//echo $sql;
				if($class->consulta($sql)){
					$data = "1";	
				}else{
					$data = '4';//ERROR EN LA BASE
				}				
			}
		}
	} else {
	    if ($_POST['oper'] == "edit") {
	    	$sql = "SELECT count(*)count FROM formas_pago WHERE codigo = UPPER('".$_POST['codigo']."') AND id NOT IN ('".$_POST['id']."')";
	    	//echo $sql;
	    	$sql = $class->consulta($sql);		
			while ($row = $class->fetch_array($sql)) {
				$data = $row[0];
			}

			if ($data != 0) {
			 	$data = "2";  //CODIGO REPETIDO
			} else {
				$sql = "SELECT count(*)count FROM formas_pago WHERE nombre = UPPER('".$_POST['nombre']."') AND id NOT IN ('".$_POST['id']."')";
				//echo $sql;
		    	$sql = $class->consulta($sql);		
				while ($row = $class->fetch_array($sql)) {
					$data = $row[0];
				}

				if ($data != 0) {
				 	$data = "3"; //NOMBRE REPETIDO
				} else {
					$sql = "UPDATE formas_pago SET codigo = '".$_POST['codigo']."',nombre = '".$_POST['nombre']."', estado = '".$_POST['estado']."',moneda = '".$_POST['moneda']."',tiempo = '".$_POST['tiempo']."' WHERE id = '".$_POST['id']."'";
					if($class->consulta($sql)){
						$data = "1"; //DATOS AGREGADOS
					}else{
						$data = '4'; //ERROR EN LA BASE
					}		    		
		    	}
			}
	    }
	}    
	echo $data;
?>