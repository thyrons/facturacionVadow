<?php 
	include_once('../../../admin/class.php');
	$class = new constante();
	$fecha = $class->fecha_hora();

	$data = 0;

	if ($_POST['oper'] == "add") {
		$sql = "SELECT count(*)count FROM cargos WHERE nombre_cargo = UPPER('".$_POST['nombre_cargo']."')";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$data = $row[0];
		}
		if ($data != 0) {
			$data = "2";///REPETIDO
		} else {
			$sql = "INSERT INTO cargos (nombre_cargo,principal,observaciones,estado,fecha_creacion) VALUES ('".$_POST['nombre_cargo']."','".$_POST['principal']."','".$_POST['observaciones']."','".$_POST['estado']."','".$fecha."');";
			
			if($class->consulta($sql)){
				$data = "1";////DATOS GUARDADOS	
			}else{
				$data = "4";//ERROR EN LA BASE
			}
			
		}
	} else {
	    if ($_POST['oper'] == "edit") {
	    	$sql = "SELECT count(*)count FROM cargos WHERE nombre_cargo = UPPER('".$_POST['nombre_cargo']."') AND id NOT IN ('".$_POST['id']."')";	
			$sql = $class->consulta($sql);			
	    	
			while ($row = $class->fetch_array($sql)) {
				$data = $row[0];
			}

			if ($data != 0) {
			 	$data = "2";///REPETIDO
			} else {		
				$sql = "UPDATE cargos SET nombre_cargo = '".$_POST['nombre_cargo']."',principal = '".$_POST['principal']."',observaciones = '".$_POST['observaciones']."', estado = '".$_POST['estado']."' WHERE id = '".$_POST['id']."'";	
				if($class->consulta($sql)){
					$data = "1";///DATOS GUARDADOS
				}else{
					$data = "4";//ERROR EN LA BASE
				}
			}
	    }
	}    
	echo $data;
?>