<?php  
	include_once('../../admin/class.php');
	$class = new constante();	
	$data = json_decode(file_get_contents("php://input"));	
	$token = $data->token;

	$sql = "select * from usuarios where token = '".$token."'";	
	$sql = $class->consulta($sql);
	if ($class->num_rows($sql) == 1){		
		echo "authorized";
	} else {
		echo "unauthorized";
	}

?>