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
    $sql = "SELECT  COUNT(*) AS count FROM tipo_comprobante";
   
    $sql = $class->consulta($sql);      
    while ($row = $class->fetch_array($sql)) {
        $count = $row[0];    
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
        $SQL = "SELECT * FROM tipo_comprobante ORDER BY $sidx $sord limit $limit offset $start";
    } else {
        $campo = $_GET['searchField'];
      
        if ($_GET['searchOper'] == 'eq') {
            $SQL = "SELECT * FROM tipo_comprobante WHERE $campo = '".$_GET['searchString']."' ORDER BY $sidx $sord limit $limit offset $start";
        }         
        if ($_GET['searchOper'] == 'cn') {
            $SQL = "SELECT * FROM tipo_comprobante WHERE $campo like '%$_GET[searchString]%' ORDER BY $sidx $sord limit $limit offset $start";
        }
    }  

    $resultado = $class->consulta($SQL); 
    $s = '';
    header("Content-Type: text/html;charset=utf-8");   
    $s = "<?xml version='1.0' encoding='utf-8'?>";
    $s .= "<rows>";
        $s .= "<page>" . $page . "</page>";
        $s .= "<total>" . $total_pages . "</total>";
        $s .= "<records>" . $count . "</records>";
        while ($row = $class->fetch_array($resultado)) {
            $s .= "<row id='" . $row[0] . "'>";            
            $s .= "<cell>" . $row[0] . "</cell>";     
            $s .= "<cell>" . $row[1] . "</cell>";     
            $s .= "<cell>" . $row[2] . "</cell>";     
            $s .= "<cell>" . $row[3] . "</cell>";  
            $s .= "</row>";
        }
    $s .= "</rows>";
    echo $s;    
?>