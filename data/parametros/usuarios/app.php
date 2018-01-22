<?php 
	include_once('../../../admin/class.php');
	include_once('../../../admin/funciones_generales.php');
	include_once('../../../admin/datos_sri.php');
	include_once('../../../admin/datos_cedula.php');
	$class = new constante();
	$fecha = $class->fecha_hora();

	if ($_POST['tipo'] == "Guardar Datos") {		
		$pass = md5($_POST['clave']);								
		$resp = "SELECT id FROM usuarios WHERE usuario = '".$_POST['usuario']."'";		
		$resp = $class->consulta($resp);			
		if($class->num_rows($resp) > 0) {		
			echo 2; // USUARIO REPETIDO
		}else{
			$resp = "SELECT id FROM usuarios WHERE identificacion = '".$_POST['identificacion']."' and  id_tipo_identificacion = '".$_POST['tipoIdentificacion']."'";
			$resp = $class->consulta($resp);
			if($class->num_rows($resp) > 0) {		
				echo 3; // IDENTIFICACION REPETIDO	
			}else{
				$dirFoto = '';
				if(isset($_FILES['file_1'])) {
					$temporal = $_FILES['file_1']['tmp_name'];
		            $extension = explode(".",  $_FILES['file_1']['name']); 
		            $extension = end($extension);                    			            
		            $nombre = $id.".".$extension;
		            $destino = './fotos/'.$nombre;			            
		            $root = getcwd();	
		            if(move_uploaded_file($temporal, $root.$destino)) {
		            	$dirFoto = $destino;
		            }      	
				}
				$resp = "INSERT INTO usuarios (nombres_completos,apellidos_completos,usuario,pass,email,token,id_tipo_identificacion, identificacion,telf_fijo,telf_movil,direccion,genero,id_cargo,foto,tipo,estado,fecha_creacion,id_ciudad,verificador) VALUES ('".$_POST['nombres_completos']."','".$_POST['apellidos_completos']."','".$_POST['usuario']."','".$pass."','".$_POST['correo']."','','".$_POST['tipoIdentificacion']."','".$_POST['identificacion']."','".$_POST['fijo']."','".$_POST['movil']."','".$_POST['direccion']."','".$_POST['genero']."','".$_POST['cargo']."','".$dirFoto."','0','".$_POST['estado']."','".$fecha."','".$_POST['ciudad']."','".$_POST['verificador']."');";
				echo $resp;
				if($class->consulta($resp)) {
					echo 1;	// DATOS GUARDADOS
				} else {
					echo 4;	// ERROR EN LA BASE
				}	
			}		
		}								
	}
	if ($_POST['tipo'] == "Modificar Datos") {			
		$resp = "SELECT id FROM usuarios WHERE usuario = '".$_POST['usuario']."' AND NOT id = '".$_POST['id']."'";
		$resp = $class->consulta($resp);	
		if($class->num_rows($resp) > 0) {		
			echo 3; // USUARIO REPETIDO		
		} else {

			if(isset($_FILES['file_1'])) {
				$temporal = $_FILES['file_1']['tmp_name'];
	            $extension = explode(".",  $_FILES['file_1']['name']); 
	            $extension = end($extension);                    			            
	            $nombre = $_POST['id'].".".$extension;
	            $destino = './fotos/'.$nombre;			            
	            $root = getcwd();	
	            if(move_uploaded_file($temporal, $root.$destino)) {
	            	$dirFoto = $destino;
	            }      	
			}
			$resp = "UPDATE usuarios SET id_tipo_identificacion = '".$_POST['tipoIdentificacion']."', identificacion = '".$_POST['identificacion']."', nombres_completos = '".$_POST['nombres']."', apellidos_completos = '".$_POST['apellidos']."', telf_fijo = '".$_POST['fijo']."', telf_movil = '".$_POST['movil']."',direccion = '".$_POST['direccion']."', correo = '".$_POST['correo']."', genero = '".$_POST['genero']."', id_cargo = '".$_POST['cargo']."', usuario = '".$_POST['usuario']."', estado = '".$_POST['estado']."'  WHERE id = '".$_POST['id']."'";				
			if($class->consulta($resp)) {
				echo 1;	//Usuario Guardado			
			} else {
				echo 4;	//Error en la base
			}		
		}							
	}
	if ($_POST['tipo'] == "atras") {
		$data = 0;
		if($_POST['id'] == 0){
			$sql = "select id from usuarios order by id desc limit 1";	
			$sql = $class->consulta($sql);		
			while ($row = $class->fetch_array($sql)) {
				$data = $row[0];
			}
		}else{
			$sql = "select id from usuarios where id < '".$_POST['id']."' order by id desc limit 1";
			$sql = $class->consulta($sql);		
			while ($row = $class->fetch_array($sql)) {
				$data = $row[0];
			}
		}							
		echo $data;
	}
	if ($_POST['tipo'] == "cargarTipoIdentificacion") {				
		$lista = array();
		$sql = "SELECT id,codigo, nombre FROM tipo_identificacion order by id asc";
		$sql = $class->consulta($sql);							
		while ($row = $class->fetch_array($sql)) {
			$lista[] = array('id' => $row[0], 'nombre' => ($row[1] .' - '.$row[2]));
		}
		print_r(json_encode($lista));
	}
	if ($_POST['tipo'] == "cargarProvincias") {		
		$sql = "SELECT id, nombre_provincia FROM provincia order by id asc";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$lista[] = array('id' => $row[0], 'nombre' => $row[1]);
		}
		print_r(json_encode($lista));
	}
	if ($_POST['tipo'] == "cargarCiudades") {
		$lista = array();
		if($_POST['id'] != 'undefined'){
			$sql = "SELECT id, nombre_ciudad FROM ciudad WHERE id_provincia = '$_POST[id]' order by id asc";
			$sql = $class->consulta($sql);		
			while ($row = $class->fetch_array($sql)) {
				$lista[] = array('id' => $row[0], 'nombre' => $row[1]);
			}
		}		
		print_r(json_encode($lista));
	}
	if ($_POST['tipo'] == "cargarCargos") {		
		$sql = "SELECT id, nombre_cargo FROM cargos order by id asc";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$lista[] = array('id' => $row[0], 'nombre' => $row[1]);
		}
		print_r(json_encode($lista));
	}
	if ($_POST['tipo'] == 'consultarRuc') {
		$ruc = $_POST['txt_ruc'];
		$servicio = new ServicioSRI();///creamos nuevo objeto de servicios SRI
		$datosEmpresa = $servicio->consultar_ruc($ruc); ////accedemos a la funcion datosSRI
		$establecimientos = $servicio->establecimientoSRI($ruc);

		print_r(json_encode(['datosEmpresa'=>$datosEmpresa,'establecimientos'=>$establecimientos]));		
	}
	if ($_POST['tipo'] == 'consultarCedula') {
		$cedula = $_POST['txt_cedula'];
		$servicio = new DatosCedula();///creamos nuevo objeto de antecedentes
		$datosCedula = $servicio->consultar_cedula($cedula); ////accedemos a la funcion datosSRI
		print_r(json_encode(['datosPersona'=>$datosCedula]));		
	}
	if ($_POST['tipo'] == "Cargar Datos") {
		$data = array();
		$sql = "select U.id, U.nombres_completos, U.apellidos_completos, U.usuario, U.pass, U.email, U.id_tipo_identificacion, U.identificacion, U.telf_fijo, U.telf_movil, U.direccion, U.genero, U.id_cargo, U.foto, U.tipo, U.estado,U.id_ciudad,C.id_provincia,U.verificador from usuarios U inner join ciudad C on U.id_ciudad = C.id where U.id = '1'";
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
			$data[] = $row[17];				
			$data[] = $row[18];		
		}
		$verificador = numeroVerificador($data[18]);
		$sql = "update usuarios set verificador = '".$verificador."'";
		if($class->consulta($sql)){
			$data[18] = $verificador;
			echo json_encode($data);
		}				
	}
?>