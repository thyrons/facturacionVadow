<?php 
	include_once('../../../admin/class.php');
	$class = new constante();

	$resultado = "SELECT * FROM tipo_retencion";		
	$sql = $class->consulta($resultado);		
	
	$response ='<select >';
	while ($row = $class->fetch_array($sql)) {
    	$response .= '<option value="'.$row[0].'">'.$row[2].'</option>';
	}
	$response .= '</select>';	
	echo $response;	
?>