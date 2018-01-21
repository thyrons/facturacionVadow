<?php 
	include_once('../../../admin/class.php');
	$class = new constante();	
	$fecha = $class->fecha_hora();	
	$data = 0;

	if ($_POST['oper'] == "add") {
		$sql = "SELECT count(*)count FROM tarifa_retencion WHERE codigo = UPPER('".$_POST['codigo']."')";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$data = $row[0];
		}
		if ($data != 0) {
			$data = "2"; ///CODIGO REPETIDO
		} else {			
			$sql = "INSERT INTO tarifa_retencion (id_retencion,codigo,nombre,descripcion,estado,fecha_creacion)  VALUES ('".$_POST['nombreImpuesto']."','".$_POST['codigo']."','".$_POST['nombre']."','".$_POST['descripcion']."', '".$_POST['estado']."','".$fecha."' );";
			//echo $sql;
			if($class->consulta($sql)){
				$data = "1";	
			}else{
				$data = '4';//ERROR EN LA BASE
			}	
		}
	} else {
	    if ($_POST['oper'] == "edit") {
	    	$sql = "SELECT count(*)count FROM tarifa_retencion WHERE codigo = UPPER('".$_POST['codigo']."') AND id NOT IN ('".$_POST['id']."')";
	    	//echo $sql;
	    	$sql = $class->consulta($sql);		
			while ($row = $class->fetch_array($sql)) {
				$data = $row[0];
			}

			if ($data != 0) {
			 	$data = "2";  //CODIGO REPETIDO
			} else {							
				$sql = "UPDATE tarifa_retencion SET id_retencion='".$_POST['nombreImpuesto']."',codigo = '".$_POST['codigo']."',nombre = '".$_POST['nombre']."',descripcion = '".$_POST['descripcion']."', estado = '".$_POST['estado']."' WHERE id = '".$_POST['id']."'";
				if($class->consulta($sql)){
					$data = "1"; //DATOS AGREGADOS
				}else{
					$data = '4'; //ERROR EN LA BASE
				}	
			}
	    }
	}    
	echo $data;
?>