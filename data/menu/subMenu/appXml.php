<?php
    include_once('../../../admin/class.php');
    $class = new constante();     
    date_default_timezone_set('America/Guayaquil');
    setlocale (LC_TIME,"spanish");

    $page = $_GET['page'];
    $limit = $_GET['rows'];
    $sidx = $_GET['sidx'];
    $sord = $_GET['sord'];
    $search = $_GET['_search'];
    if (!$sidx)
        $sidx = 1;
    
    $count = 0;
    $resultado = $class->consulta("SELECT  COUNT(*) AS count from submenu R inner join menu M on R.id_menu = M.id");         
    while ($row = $class->fetch_array($resultado)) {
        $count = $count + $row[0];    
    }    
    if ($count > 0 && $limit > 0) {
        $total_pages = ceil($count / $limit);
    } else {
        $total_pages = 0;
    }
    if ($page > $total_pages)
        $page = $total_pages;
    $start = $limit * $page - $limit;
    if ($start < 0)
        $start = 0;
    
    if ($search == 'false') {
        $SQL = "select R.id, R.id_menu, R.nombre_rol, R.titulo tituloRol, R.estado, M.titulo from submenu R inner join menu M on R.id_menu = M.id ORDER BY $sidx $sord limit $limit offset $start";
    } else {
        $campo = $_GET['searchField'];
      
        if ($_GET['searchOper'] == 'eq') {
            $SQL = "select R.id, R.id_menu, R.nombre_rol, R.titulo tituloRol, R.estado, M.titulo from submenu R inner join menu M on R.id_menu = M.id WHERE $campo = '".$_GET['searchString']."' ORDER BY $sidx $sord limit $limit offset $start";
        }         
        if ($_GET['searchOper'] == 'cn') {
            $SQL = "select R.id, R.id_menu, R.nombre_rol, R.titulo tituloRol, R.estado, M.titulo from submenu R inner join menu M on R.id_menu = M.id WHERE $campo like '%$_GET[searchString]%' ORDER BY $sidx $sord limit $limit offset $start";
        }
    }  
   
    $resultado = $class->consulta($SQL); 
    $s ='';
    header("Content-Type: text/html;charset=utf-8");   
    $s = "<?xml version='1.0' encoding='utf-8'?>";
    $s .= "<rows>";
    $s .= "<page>" . $page . "</page>";
    $s .= "<total>" . $total_pages . "</total>";
    $s .= "<records>" . $count . "</records>";
    while ($row = $class->fetch_array($resultado)) {
        $s .= "<row id='" . $row[0] . "'>";
        $s .= "<cell>" . $row[0] . "</cell>";     
        $s .= "<cell>" . utf8_decode($row[5]) . "</cell>";                 
        $s .= "<cell>" . utf8_decode($row[2]) . "</cell>";  
        $s .= "<cell>" . utf8_decode($row[3]) . "</cell>";  
        $s .= "<cell>" . $row[4] . "</cell>";  
        $s .= "<cell>" . $row[1] . "</cell>";
        $s .= "</row>";
    }
    $s .= "</rows>";
    echo $s;
?>