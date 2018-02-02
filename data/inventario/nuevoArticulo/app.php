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
	if ($_POST['tipo'] == "Guardar Datos") {
		$sql = "select id from prodcutos where codigo = '".$_POST['codigo']."' and id_sucursal = '".$_POST['sucursal']."'";
		$sql = $class->consulta($sql);			
		if($class->num_rows($sql) > 0) {		
			echo 2; // PRODUCTO REPETIDO
		}else{
			$sql = "INSERT INTO prodcutos (id_sucursal, codigo, codigo_barras, nombre_producto, descripcion, id_tipo_producto, descuento, ganancia, id_iva, marca, modelo, atributo_1, descripcion_1, atributo_2, descripcion_2, atributo_3, descripcion_3, estado, fecha_creacion) values ('".$_POST['sucursal']."', '".$_POST['codigo']."', '".$_POST['barras']."', '".$_POST['nombre']."' '".$_POST['descripcion']."', '".$_POST['tipo_producto']."', '".$_POST['descuento']."', '".$_POST['ganancia']."','".$_POST['iva']."','".$_POST['marca']."','".$_POST['modelo']."','".$_POST['atributo_1']."','".$_POST['descripcion_1']."','".$_POST['atributo_2']."','".$_POST['descripcion_2']."','".$_POST['atributo_3']."','".$_POST['descripcion_3']."','1','".$fecha."')";
			if($class->consulta($sql)) {
				echo 1; ///DATOS GUARDADOS
			}else{
				echo 4; ///ERROR EN LA BASE
			}
		}
	}
?>