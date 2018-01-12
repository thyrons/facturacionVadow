<?php  
	include_once('../../admin/class.php');
	$class = new constante();	

	$data = json_decode(file_get_contents("php://input"));
	$token = $data->token;
	$sql = "UPDATE usuarios set token = 'Session Cerrada' where token = '".$token."'";
	$sql = $clas->consulta($sql);  	
?>