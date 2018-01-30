<?php 
	include_once('../../../admin/class.php');
	$class = new constante();	
	$fecha = $class->fecha_hora();	
	
	if ($_POST['tipo'] == "cargarEmpresaSucursal") {		
		$sql = "select S.id,E.nombre_comercial, S.ciudad from empresa E inner join sucursal S on E.id = S.id_empresa";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$lista[] = array('id' => $row[0], 'nombre' => ($row[1] . ' - ' . $row[2]));
		}
		print_r(json_encode($lista));
	}
	if ($_POST['tipo'] == "cargarTipoProducto") {		
		$sql = "select id,codigo,nombre from tipo_producto where estado::integer = '1'";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$lista[] = array('id' => $row[0], 'nombre' => ($row[1] . ' - ' . $row[2]));
		}
		print_r(json_encode($lista));
	}
	if ($_POST['tipo'] == "cargarIva") {		
		$sql = "select TR.id,TR.descripcion, TR.nombre from tipo_impuesto TI inner join tarifa_impuesto TR on TI.id = TR.id_impuesto where TR.estado = '1'";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$lista[] = array('id' => $row[0], 'nombre' => ($row[2] . ' - ' . $row[1]));
		}
		print_r(json_encode($lista));
	}


?>