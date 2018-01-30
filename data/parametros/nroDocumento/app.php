<?php   
	include_once('../../../admin/class.php');
	include_once('../../../admin/funciones_generales.php');
	$class = new constante();
	error_reporting(0);	
	$fecha = $class->fecha_hora();

	if ($_POST['tipo'] == "Modificar Datos") {	
		$sql = "select numero_verificador from nro_documento where id = '".$_POST['id']."'";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$verificador = $row[0];
		}
		if($verificador == $_POST['verificador']){
			$sql = "UPDATE nro_documento SET nro_factura = '".$_POST['nro_factura']."',nro_nota_debito = '".$_POST['nro_nota_debito']."',nro_nota_credito = '".$_POST['nro_nota_credito']."',nro_retencion = '".$_POST['nro_retencion']."',nro_guia = '".$_POST['nro_guia']."',nro_factura_lote = '".$_POST['nro_factura_lote']."',nro_nota_debito_lote = '".$_POST['nro_nota_debito_lote']."',nro_nota_credito_lote = '".$_POST['nro_nota_credito_lote']."',nro_retencion_lote = '".$_POST['nro_retencion_lote']."',nro_guia_lote = '".$_POST['nro_guia_lote']."' WHERE id = '".$_POST['id']."'";		
			//echo $sql;
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
		$sql = "select ND.id, S.punto_emision, S.establecimiento ,E.nombre_comercial, S.ciudad, TA.nombre, ND.nro_factura, ND.nro_nota_debito, ND.nro_nota_credito, ND.nro_retencion, ND.nro_guia, ND.nro_factura_lote, ND.nro_nota_debito_lote, ND.nro_nota_credito_lote, ND.nro_retencion_lote, ND.nro_guia_lote, ND.numero_verificador from nro_documento ND inner join tipo_ambiente TA on ND.id_ambiente = TA.id inner join sucursal S on ND.id_sucursal = S.id inner join empresa E on E.id = S.id_empresa where Nd.id = '".$_POST['id']."'";
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
			$data[] = $row[12];
			$data[] = $row[13];
			$data[] = $row[14];
			$data[] = $row[15];
			$data[] = $row[16];
		}
		$verificador = numeroVerificador($data[16]);
		$sql = "update nro_documento set numero_verificador = '".$verificador."'";
		if($class->consulta($sql)){
			$data[16] = $verificador;
			echo json_encode($data);
		}				
	}
	if($_POST['tipo'] == "Busqueda"){
		$data = array();			
		$temp = array();
		$sql = "select ND.id, S.punto_emision, S.establecimiento ,E.nombre_comercial, S.ciudad, TA.nombre from nro_documento ND inner join tipo_ambiente TA on ND.id_ambiente = TA.id inner join sucursal S on ND.id_sucursal = S.id inner join empresa E on E.id = S.id_empresa ";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$documento = array();
			$documento[] = $row[0];
			$documento[] = $row[1];
			$documento[] = $row[2];
			$documento[] = $row[3];
			$documento[] = $row[4];
			$documento[] = $row[5];
			$temp[] = $documento;
		}			
		$data = array("data"=> $temp);
		echo json_encode($data);
	}
	if ($_POST['tipo'] == "atras") {
		$data = 0;
		if($_POST['id'] == 0){
			$sql = "select id from nro_documento order by id desc limit 1";	
			$sql = $class->consulta($sql);		
			while ($row = $class->fetch_array($sql)) {
				$data = $row[0];
			}
		}else{
			$sql = "select id from nro_documento where id < '".$_POST['id']."' order by id desc limit 1";
			$sql = $class->consulta($sql);		
			while ($row = $class->fetch_array($sql)) {
				$data = $row[0];
			}
		}							
		echo $data;
	}
	if ($_POST['tipo'] == "principio") {
		$data = 0;								
		$sql = "select id from nro_documento order by id asc limit 1";	
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$data = $row[0];
		}														
		echo $data;
	}
	if ($_POST['tipo'] == "adelante") {
			$data = 0;
			if($_POST['id'] == 0){
				$sql = "select id from nro_documento order by id asc limit 1";	
				$sql = $class->consulta($sql);		
				while ($row = $class->fetch_array($sql)) {
					$data = $row[0];
				}
			}else{
				$sql = "select id from nro_documento where id >'".$_POST['id']."' order by id asc limit 1";
				$sql = $class->consulta($sql);		
				while ($row = $class->fetch_array($sql)) {
					$data = $row[0];
				}
			}							
			echo $data;
		}
	if ($_POST['tipo'] == "final") {
		$data = 0;								
		$sql = "select id from nro_documento order by id desc limit 1";	
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$data = $row[0];
		}														
		echo $data;
	}
?>