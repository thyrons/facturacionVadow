<?php 	
	include_once('../../../admin/class.php');
	$class = new constante();

	$resultado = "SELECT id, titulo FROM menu";		
	$sql = $class->consulta($resultado);		
	
	$response ='<select >';
	while ($row = $class->fetch_array($sql)) {
    	$response .= '<option value="'.$row[0].'">'.utf8_decode($row[1]).'</option>';
	}
	$response .= '</select>';
		
	echo $response;	
?>