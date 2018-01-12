<?php 
	include_once('../../../admin/class.php');
	$class = new constante();		
	$data = array();
	$id = '';
	$sql = "select id from usuarios where token = '".$_POST['token']."'";
	$sql = $class->consulta($sql);		
	if ($class->num_rows($sql) == 1){
		while ($row = $class->fetch_array($sql)) {
			$id = $row[0];
		}
	}else{
		$id = 0;
	}

	if($id == 1){	
		$estado = 0;
		$sql = "select * from cargo_rol CR 
			inner join submenu SB on CR.id_submenu = SB.id
			where CR.id_cargo = '".$id."'
			and SB.nombre_rol = '".$_POST['page']."'
			and CR.estado = true";		

		$sql = $class->consulta($sql);		
		if ($class->num_rows($sql) == 1){
			$estado = 1;
		}else{
			$estado = 0;
		}

		$sql = "select 
			M.id,
			M.nombre,
		    M.titulo,
		    M.icono ,
		    R.id_menu  
		from cargo_rol CR 
		inner join submenu R on CR.id_submenu = R.id
		inner join menu M on M.id = R.id_menu
		where CR.id_cargo = '".$id."' and CR.estado = '1'
		group by M.id, R.id_menu, M.nombre, M.titulo, M.icono";

		$sql = $class->consulta($sql);
		$menu = "";
		$menu = $menu .'<li class="active"><a href="#!/home" ng-click = "cambioMenu(home)"><i class="menu-icon fa fa-home"></i><span class="menu-text"> Inicio </span></a><b class="arrow"></b></li>';		
		while ($row = $class->fetch_array($sql)) {
			$sql_roles = "select M.id, M.nombre, M.titulo, M.icono, R.nombre_rol, R.titulo from cargo_rol CR inner join submenu R on CR.id_submenu = R.id inner join menu M on M.id = R.id_menu where CR.id_cargo = '".$id."' and CR.estado = '1' and R.id_menu = '".$row[4]."'";
			$sql_roles = $class->consulta($sql_roles);
			$temp = "'active:open': ";
			$submenu = "";
			$tt = "";				
			while ($row_roles = $class->fetch_array($sql_roles)) {	
				$temp = $temp . '$route.current.activetab == '."'$row_roles[4]'".''. ' || ';
				//$tt =  $route.current.activetab == 'usuarios'
				$submenu = $submenu .'<li ng-class="{active: $route.current.activetab == '."'$row_roles[4]'".' }" class="hover">';
				$submenu = $submenu .'<a href="#!/'.$row_roles[4].'" target="">';
				$submenu = $submenu .'<i class="menu-icon fa fa-caret-right"></i>';
				$submenu = $submenu . utf8_decode($row_roles[5]);
				$submenu = $submenu .'</a>';
				$submenu = $submenu .'<b class="arrow"></b>';
				$submenu = $submenu .'</li>';	
			}
			$temp = substr($temp, 0, -3);
			$menu = $menu . '<li ng-class="{'.$temp.'}" class="hover">';
			$menu = $menu .	'<a class="dropdown-toggle">';
			$menu = $menu .	'<i class="'.$row[3].'"></i>';
			$menu = $menu .	'<span class="menu-text"> '.utf8_decode($row[2]).' </span>';
			$menu = $menu .	'<b class="arrow fa fa-angle-down"></b>';			
			$menu = $menu .	'</a>';
			$menu = $menu .	'<b class="arrow"></b>';			
			$menu = $menu . '<ul class="submenu">';
			$menu = $menu . $submenu;
			$menu = $menu . '</ul>';
			$menu = $menu .	'</li>';
		}		
		$data[] = array('menu' => $menu, 'estado' => $estado);		
		print_r(json_encode($data));
	}

	
?>