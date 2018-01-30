<?php     

	include_once('../../../admin/datos_sri.php');
	include_once('../../../admin/class.php');
	include_once('../../../admin/funciones_generales.php');
	$class = new constante();
	error_reporting(0);	
	$fecha = $class->fecha_hora();

	if($_POST['tipo'] == "Guardar Datos") {		
		$sql = "SELECT id FROM empresa where ruc = '".$_POST['ruc']."'";
		$sql = $class->consulta($sql);
		if($class->num_rows($sql) > 0) {		
			echo 3; // VALOR REPETIDO
		} else {									
			$sql = "INSERT INTO empresa (razon_social, nombre_comercial, direccion, ruc, email, autorizacion, obligacion, contribuyente, token, clave, logo, estado, verificador, fecha_creacion,actividad_economica) VALUES ('".$_POST['razonSocial']."','".$_POST['nombreComercial']."','".$_POST['direccion']."','".$_POST['ruc']."','".$_POST['email']."','".$_POST['autorizacion']."','".$_POST['obligacion']."','".$_POST['contribuyente']."','','".$_POST['token']."','','1','0','".$fecha."','".$_POST['actividad']."');";			
			if($class->consulta($sql)) {	
				$id = '';
				$sql_id = "select id from empresa where ruc = '".$_POST['ruc']."'";
				$sql_id = $class->consulta($sql_id);
				while ($row_id = $class->fetch_array($sql_id)) {		
					$id = $row_id[0];
				}
				$dirToken = '';
				$dirLogo = '';
				if(isset($_FILES['file_1'])) {
					$temporal = $_FILES['file_1']['tmp_name'];
		            $extension = explode(".",  $_FILES['file_1']['name']); 
		            $extension = end($extension);                    			            
		            $nombre = $id.".".$extension;
		            $destino = './tokens/'.$nombre;			            
		            $root = getcwd();	
		            if(move_uploaded_file($temporal, $root.$destino)){
		            	$dirToken = $destino;
		            }           
				}
				if(isset($_FILES['file_2'])) {
					$temporal = $_FILES['file_2']['tmp_name'];
		            $extension = explode(".",  $_FILES['file_2']['name']); 
		            $extension = end($extension);                    			            
		            $nombre = $id.".".$extension;
		            $destino = './logos/'.$nombre;			            
		            $root = getcwd();	
		            if(move_uploaded_file($temporal, $root.$destino)) {
		            	$dirLogo = $destino;
		            }      	
				}	
				$sql = "update empresa set token = '".$dirToken."', logo = '".$dirLogo."' where id = '".$id."'";;
				if($class->consulta($sql)) {	
					echo 1; // DATOS AGREGADOS
				}else{
					echo 4;	// ERROR EN LA BASE	
				}					
			} else {
				echo 4;	// ERROR EN LA BASE
			}						
		}										
	} else {		
		if ($_POST['tipo'] == "btnCargarDatos") {	
			$empresa = array();	
			$sql = "SELECT id, razon_social, nombre_comercial, direccion, ruc, email, autorizacion, obligacion, contribuyente, token, clave, logo, verificador, actividad_economica FROM empresa ";
			$sql = $class->consulta($sql);
			while ($row = $class->fetch_array($sql)) {		
				$empresa[] = array('id' => $row[0],'razonSocial' => $row[1],'nombreComercial' => $row[2],'direccion' => $row[3],'ruc' => $row[4],'email' => $row[5],'autorizacion' => $row[6],'obligacion' => $row[7],'contribuyente' => $row[8],'token' => $row[9],'clave' => $row[10],'logo' => $row[11],'numeroVerificador' => $row[12],'actividad_economica' => $row[13]);
			}
			if(count($empresa) > 0) {
				$nuevoNumeroVerificador = numeroVerificador($empresa[0]['numeroVerificador']);			
				$sql = "update empresa set verificador = '".$nuevoNumeroVerificador."' where id = '".$empresa[0]['id']."'";	
				$class->consulta($sql);
				$empresa[0]['numeroVerificador'] = $nuevoNumeroVerificador;
			}
			echo json_encode($empresa);	
		} else {
			if ($_POST['tipo'] == "Modificar Datos") {	
				$numeroVerificador = '';
				$sql = "select verificador from empresa where id = '".$_POST['id']."'";
				$sql = $class->consulta($sql);
				while ($row = $class->fetch_array($sql)) {		
					$numeroVerificador = $row[0];
				}
				if($numeroVerificador == $_POST['verificador']) {
					$dirToken = '';
					$dirLogo = '';
					if(isset($_FILES['file_1'])){
						$temporal = $_FILES['file_1']['tmp_name'];
			            $extension = explode(".",  $_FILES['file_1']['name']); 
			            $extension = end($extension);                    			            
			            $nombre = $_POST['id'].".".$extension;
			            $destino = './tokens/'.$nombre;			            
			            $root = getcwd();	
			            if(move_uploaded_file($temporal, $root.$destino)){
			            	$dirToken = $destino;
			            }           
					}					
					if(isset($_FILES['file_2'])) {										
						$temporal = $_FILES['file_2']['tmp_name'];						
			            $extension = explode(".",  $_FILES['file_2']['name']); 
			            $extension = end($extension);                    			            
			            $nombre = $_POST['id'].".".$extension;
			            $destino = './logos/'.$nombre;			            
			            $root = getcwd();	
			            if(move_uploaded_file($temporal, $root.$destino)) {
			            	$dirLogo = $destino;
			            }      	
					}
					if($dirLogo == '' && $dirToken == '') {
						$sql = "UPDATE empresa set  razon_social = '".$_POST['razonSocial']."', nombre_comercial = '".$_POST['nombreComercial']."', direccion = '".$_POST['direccion']."', ruc = '".$_POST['ruc']."', email = '".$_POST['email']."', autorizacion = '".$_POST['autorizacion']."', obligacion = '".$_POST['obligacion']."', contribuyente = '".$_POST['contribuyente']."', clave = '".$_POST['token']."', actividad_economica = '".$_POST['actividad']."' WHERE id = '".$_POST['id']."'";						
					} else {
						if($dirLogo == '') {
							$sql = "UPDATE empresa set  razon_social = '".$_POST['razonSocial']."', nombre_comercial = '".$_POST['nombreComercial']."', direccion = '".$_POST['direccion']."', ruc = '".$_POST['ruc']."', email = '".$_POST['email']."', autorizacion = '".$_POST['autorizacion']."', obligacion = '".$_POST['obligacion']."', contribuyente = '".$_POST['contribuyente']."', token = '".$dirToken."', clave = '".$_POST['token']."', actividad_economica = '".$_POST['actividad']."' WHERE id = '".$_POST['id']."'";
						} else {
							if($dirToken == '') {
								$sql = "UPDATE empresa set  razon_social = '".$_POST['razonSocial']."', nombre_comercial = '".$_POST['nombreComercial']."', direccion = '".$_POST['direccion']."', ruc = '".$_POST['ruc']."', email = '".$_POST['email']."', autorizacion = '".$_POST['autorizacion']."', obligacion = '".$_POST['obligacion']."', contribuyente = '".$_POST['contribuyente']."', clave = '".$_POST['token']."', logo = '".$dirLogo."' WHERE id = '".$_POST['id']."', actividad_economica = '".$_POST['actividad']."'";
							} else {
								$sql = "UPDATE empresa set  razon_social = '".$_POST['razonSocial']."', nombre_comercial = '".$_POST['nombreComercial']."', direccion = '".$_POST['direccion']."', ruc = '".$_POST['ruc']."', email = '".$_POST['email']."', autorizacion = '".$_POST['autorizacion']."', obligacion = '".$_POST['obligacion']."', contribuyente = '".$_POST['contribuyente']."', token = '".$dirToken."', clave = '".$_POST['token']."', logo = '".$dirLogo."', actividad_economica = '".$_POST['actividad']."' WHERE id = '".$_POST['id']."'";
							}
						}
					}

					if($class->consulta($sql)) {				
						echo 1; // DATOS AGREGADOS
					} else {
						echo 4;	// ERROR EN LA BASE
					}	
				} else {
					echo 5; //error de numero verificador
				}		
			}
		}
	}


?>