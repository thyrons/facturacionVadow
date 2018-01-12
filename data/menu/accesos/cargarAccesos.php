<?php 
	include_once('../../../admin/class.php');
	$class = new constante();		
	$data = array();
	$fecha = $class->fecha_hora();

	if($_POST['funcion'] == 1){
		$sql = "select * from menu where estado = '1'";
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$menu = array();
			$menu_sub_sub = array();
			$menu[] = $row[0];
			$menu[] = $row[1];
			$menu[] = utf8_decode($row[2]);
			$menu[] = $row[3];
			$menu[] = $row[4];		
			$sql_sub = "select * from submenu where estado = '1' and id_menu = '".$row[0]."'";
			//echo $sql_sub;
			$sql_sub = $class->consulta($sql_sub);		
			while ($row_sub = $class->fetch_array($sql_sub)) {
				$menu_sub = array();
				$menu_sub[] = $row_sub[0];
				$menu_sub[] = $row_sub[1];
				$menu_sub[] = utf8_decode($row_sub[2]);
				$menu_sub[] = $row_sub[3];
				$menu_sub[] = $row_sub[4];	
				$menu_sub_sub[] = $menu_sub;		
			}
			$menu[] = array('accesos' => $menu_sub_sub);
			$data[] = $menu;		
		}
		print_r(json_encode($data)); 	
	}
	if($_POST['funcion'] == 2){
		$sql = "select  id , nombre_cargo from  cargos";
		$sql = $class->consulta($sql);		
		print'<option value=""></option>';
		while ($row = $class->fetch_array($sql)) {
			print '<option value="'.$row[0].'" >'.utf8_encode($row[1]).'</option>';
		}
	}
	if($_POST['funcion'] == 3){
		$sql  = "select R.id from submenu R";				
		$sql = $class->consulta($sql);		
		while ($row = $class->fetch_array($sql)) {
			$sql_1 = "select CR.id from cargo_rol CR where CR.id_cargo = '".$_POST['id']."' and CR.id_submenu = '".$row[0]."'";				
			$sql_1 = $class->consulta($sql_1);									
			if($class->num_rows($sql_1) == 0){				
				$sql_2 = "insert into cargo_rol (id_submenu,id_cargo,estado,fecha_creacion) values ('".$row[0]."','".$_POST['id']."','0','".$fecha."')";
				//echo $sql_2;
				$class->consulta($sql_2);	
			}			
		}
		$sql = "select R.id from cargo_rol CR inner join submenu R on R.id = CR.id_submenu where CR.id_cargo = '".$_POST['id']."' and CR.estado = '1'";		
		$sql = $class->consulta($sql);	
		$data = array();	
		while ($row = $class->fetch_array($sql)) {
			$data[] = $row[0];
		}
		print_r(json_encode($data)); 		
	}
	if($_POST['funcion'] == 4){		
		$data = array();
		$data = $_POST['datos'];
		$sql = "update cargo_rol set estado = '0' where id_cargo = '".$_POST['id']."'";
		if($class->consulta($sql)){
			for ($i = 0; $i < count($data) ; $i++) { 
				$sql = "update cargo_rol set estado = '1' where id_cargo = '".$_POST['id']."' and id_submenu = '".$data[$i]."'";
				if($class->consulta($sql)){
					$resp = 1;
				}else{
					$resp = 0;
				}		
			}
		}
		echo $resp;
	}
?>