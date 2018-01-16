<?php  
	include_once('../../admin/class.php');
	$class = new constante();	

	$data = json_decode(file_get_contents("php://input"));
    $password = sha1($data->password);
    $username = $data->usuario;
	$sql = $class->consulta("SELECT email FROM usuarios where usuario = '".$username."' and pass = '".$password."'");
	$token = 0;


	if ($class->num_rows($sql) == 1){		
		$token = $username . " | " . uniqid() . uniqid() . uniqid();
		$sql = "UPDATE usuarios SET token = '".$token."' WHERE usuario = '".$username."' AND pass = '".$password."'";
		if($class->consulta($sql)){
			echo $token;
		}else{
			echo "ERROR";
		}
	}	
	else {
		echo "ERROR";
	}		
?>