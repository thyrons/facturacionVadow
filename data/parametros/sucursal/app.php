<?php   
	include_once('../../../admin/class.php');
	include_once('../../../admin/funciones_generales.php');
	$class = new constante();
	//error_reporting(0);	
	$fecha = $class->fecha_hora();

	if ($_POST['tipo'] == "cargarEmpresas") {				
		$lista = array();
		$sql = "SELECT id,nombre_comercial,razon_social FROM empresa order by id asc";
		$sql = $class->consulta($sql);							
		while ($row = $class->fetch_array($sql)) {
			$lista[] = array('id' => $row[0], 'nombreComercial' => $row[1]);
		}
		print_r(json_encode($lista));
	}
	if ($_POST['tipo'] == "Guardar Datos") {		
		$fecha = $class->fecha_hora();
		$sql = "INSERT INTO sucursal (id_empresa, direccion, telefono, email, punto_emision, establecimiento, ciudad, es_matriz, en_lote, representante, estado, fecha_creacion, numero_verificador)VALUES ('".$_POST['empresa']."','".$_POST['direccion']."','".$_POST['telefono']."','".$_POST['correo']."','".$_POST['puntoEmision']."','".$_POST['establecimiento']."','".$_POST['ciudad']."','".$_POST['esMatriz']."','".$_POST['esLote']."','".$_POST['representante']."','1', '".$fecha."','0');";
		if($class->consulta($sql)){	
			$id = 0;
			$sql = "select currval('sucursal_id_seq')";
			$sql = $class->consulta($sql);			
			while ($row = $class->fetch_array($sql)) {
				$id = $row[0];
			}
			if($id > 0){
				$sql = "select id FROM tipo_ambiente";
				$sql = $class->consulta($sql);			
				while ($row = $class->fetch_array($sql)) {
					$sql_doc = "INSERT INTO nro_documento (id_sucursal, id_ambiente, nro_factura, nro_nota_debito, nro_nota_credito, nro_retencion, nro_guia, nro_factura_lote, nro_nota_debito_lote, nro_nota_credito_lote, nro_retencion_lote, nro_guia_lote, fecha_creacion, numero_verificador ) VALUES ('".$id."', '".$row[0]."','0','0','0','0','0','0','0','0','0','0','".$fecha."','0')";	
					$class->consulta($sql_doc);					
				}
				echo 1; //DATOS AGREGADOS
			}else{
				echo 4; ///ERROR EN LA BASE
			}			
		}else{
			echo 4;	//ERROR EN LA BASE
		}			
	}
	if ($_POST['tipo'] == "Modificar Datos") {	
		$sql = "select numero_verificador from sucursal where id = '".$_POST['id']."'";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$verificador = $row[0];
		}
		if($verificador == $_POST['verificador']){
			$sql = "UPDATE sucursal SET id_empresa = '".$_POST['empresa']."',direccion = '".$_POST['direccion']."',telefono = '".$_POST['telefono']."',email = '".$_POST['correo']."',punto_emision = '".$_POST['puntoEmision']."',establecimiento = '".$_POST['establecimiento']."',ciudad = '".$_POST['ciudad']."',es_matriz = '".$_POST['esMatriz']."',en_lote = '".$_POST['esLote']."',representante = '".$_POST['representante']."' WHERE id = '".$_POST['id']."'";		
			if($class->consulta($sql)){				
				echo 1; ///DATOS AGREGADOS
			}else{
				echo 4;	//ERROR EN LA BASE
			}			
		}else{
			echo 5; //ERROR NUMERO VERIFICADOR
		}		
	}
	if ($_POST['tipo'] == "Cargar Datos") {
		$data = array();
		$sql = "select id, id_empresa, direccion, telefono, email, punto_emision, establecimiento, ciudad, es_matriz::integer, en_lote::integer, representante, numero_verificador from sucursal where id = '".$_POST['id']."'";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$data[] = $row[0];
			$data[] = $row[1];
			$data[] = $row[2];
			$data[] = $row[3];
			$data[] = $row[4];
			$data[] = $row[5];
			$data[] = $row[6];
			$data[] = $row[7];
			$data[] = $row[8];
			$data[] = $row[9];
			$data[] = $row[10];
			$data[] = $row[11];
		}
		$verificador = numeroVerificador($data[11]);
		$sql = "update sucursal set numero_verificador = '".$verificador."'";
		if($class->consulta($sql)){
			$data[11] = $verificador;
			echo json_encode($data);
		}				
	}
	if($_POST['tipo'] == "Busqueda"){
		$data = array();			
		$temp = array();
		$sql = "select S.id, E.nombre_comercial, S.ciudad, S.direccion  from sucursal S inner join empresa E on S.id_empresa = E.id ";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$sucursal = array();
			$sucursal[] = $row[0];
			$sucursal[] = $row[1];
			$sucursal[] = $row[2];
			$sucursal[] = $row[3];
			$temp[] = $sucursal;
		}			
		$data = array("data"=> $temp);
		echo json_encode($data);
	}
	if ($_POST['tipo'] == "atras") {
		$data = 0;
		if($_POST['id'] == 0){
			$sql = "select id from sucursal order by id desc limit 1";	
			$sql = $class->consulta($sql);		
			while ($row = $class->fetch_array($sql)) {
				$data = $row[0];
			}
		}else{
			$sql = "select id from sucursal where id < '".$_POST['id']."' order by id desc limit 1";
			$sql = $class->consulta($sql);		
			while ($row = $class->fetch_array($sql)) {
				$data = $row[0];
			}
		}							
		echo $data;
	}
	if ($_POST['tipo'] == "principio") {
		$data = 0;								
		$sql = "select id from sucursal order by id asc limit 1";	
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$data = $row[0];
		}														
		echo $data;
	}
	if ($_POST['tipo'] == "adelante") {
			$data = 0;
			if($_POST['id'] == 0){
				$sql = "select id from sucursal order by id asc limit 1";	
				$sql = $class->consulta($sql);		
				while ($row = $class->fetch_array($sql)) {
					$data = $row[0];
				}
			}else{
				$sql = "select id from sucursal where id >'".$_POST['id']."' order by id asc limit 1";
				$sql = $class->consulta($sql);		
				while ($row = $class->fetch_array($sql)) {
					$data = $row[0];
				}
			}							
			echo $data;
		}
	if ($_POST['tipo'] == "final") {
		$data = 0;								
		$sql = "select id from sucursal order by id desc limit 1";	
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$data = $row[0];
		}														
		echo $data;
	}
?>