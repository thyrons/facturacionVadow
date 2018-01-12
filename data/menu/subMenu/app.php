<?php 
	if(!isset($_SESSION)) {
        session_start();        
    }  
	
	include_once('../../../admin/class.php');
	$class = new constante();
	$fecha = $class->fecha_hora();

	$data = 0;

	if ($_POST['oper'] == "add") {
		$sql = "SELECT count(*)count FROM submenu WHERE nombre_rol = '".utf8_encode($_POST['nombreRol'])."'";
		$sql = $class->consulta($sql);

		while ($row = $class->fetch_array($sql)) {
			$data = $row[0];
		}

		if ($data != 0) {
			$data = "3";
		} else {
			$sql = "SELECT count(*)count FROM submenu WHERE titulo = '".utf8_encode($_POST['titulo'])."'";
			$sql = $class->consulta($sql);
					
			while ($row = $class->fetch_array($sql)) {
				$data = $row[0];
			}

			if ($data != 0) {
				$data = "2";
			} else {
				$sql = "INSERT INTO submenu (nombre_rol,titulo,estado,id_menu,fecha_creacion) VALUES ('".utf8_encode($_POST['nombreRol'])."','".utf8_encode($_POST['titulo'])."','".$_POST['estado']."','".$_POST['nombre_menu']."','".$fecha."');";				
	
				if($class->consulta($sql)) {
					$data = "1";	
				} else {
					$data = "4";
				}
			}	
		}
	} else {
	    if ($_POST['oper'] == "edit") {
	    	$sql = "SELECT count(*)count FROM submenu WHERE nombre_rol = '".utf8_encode($_POST['nombreRol'])."' AND id NOT IN ('".$_POST['id']."')";
			$sql = $class->consulta($sql);			
	    	
			while ($row = $class->fetch_array($sql)) {
				$data = $row[0];
			}

			if ($data != 0) {
			 	$data = "2";
			} else {
				$sql = "SELECT count(*)count FROM submenu WHERE titulo = '".utf8_encode($_POST['titulo'])."' AND id NOT IN ('".$_POST['id']."')";	
				$sql = $class->consulta($sql);			
		    	
				while ($row = $class->fetch_array($sql)) {
					$data = $row[0];
				}

				if ($data != 0) {
				 	$data = "3";
				} else {
					$sql = "UPDATE submenu SET nombre_rol = '".utf8_encode($_POST['nombreRol'])."',titulo = '".utf8_encode($_POST['titulo'])."',estado = '".$_POST['estado']."',id_menu = '".$_POST['nombre_menu']."' WHERE id = '".$_POST['id']."'";	
					
					if($class->consulta($sql)) {
						$data = "1";	
					} else {
						$data = "4";
					}
				}
			}
	    }
	}

	echo $data;
?>