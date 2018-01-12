<?php 
    function img_64($destino,$img_64,$extension,$nombre){
        define('UPLOAD_DIR', $destino.'/');    
        $img_64 = str_replace('data:image/png;base64,', '', $img_64);        
        $img_64 = str_replace(' ', '+', $img_64);
        $data_img = base64_decode($img_64);
        $file = UPLOAD_DIR . $nombre . '.'.$extension;
        if($success = file_put_contents($file, $data_img)){
            return "true";
        } else {
            return "false";
        }
    }

    function maxCaracter($texto, $cant){        
        $texto = substr($texto, 0,$cant);       
        return $texto;
    }
     function numeroVerificador ($exclusion){
        do {
            $n = rand(1,100);
        }while(in_array($n, array($exclusion)));
        return $n;
    }   
    function idz(){
      date_default_timezone_set('America/Guayaquil');
      $fecha = date("YmdHis");
      return($fecha.uniqid()); 
    }   
    function client_ip() {
      $ipaddress = '';
      if ($_SERVER['HTTP_CLIENT_IP'])
          $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
      else if($_SERVER['HTTP_X_FORWARDED_FOR'])
          $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
      else if($_SERVER['HTTP_X_FORWARDED'])
          $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
      else if($_SERVER['HTTP_FORWARDED_FOR'])
          $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
      else if($_SERVER['HTTP_FORWARDED'])
          $ipaddress = $_SERVER['HTTP_FORWARDED'];
      else if($_SERVER['REMOTE_ADDR'])
          $ipaddress = $_SERVER['REMOTE_ADDR'];
      else
          $ipaddress = 'UNKNOWN';
      return $ipaddress;
    } 
?>