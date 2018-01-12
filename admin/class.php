<?php

  include_once("conex.php");
  include("constante.php");

  class constante {
    private $login;
    private $contrasena;
    private $cedula;
    private $tipo;
    private $status;

    public function consulta($q) {
      $BaseDato = new BaseDeDato(SERVIDOR,PUERTO,BD,USUARIO,CLAVE);//declarar el objeto de la clase base de dato
      $result = $BaseDato->Consultas($q);
      return $result;
    }

    public function fetch_array($consulta) {
      return pg_fetch_array($consulta);
    }

    public function num_rows($consulta) {
      return pg_num_rows($consulta);
    }

    public function getTotalConsultas() {
      return $this->total_consultas; 
    }

    public function sqlcon($q) {
      $BaseDato = new BaseDeDato(SERVIDOR,PUERTO,BD,USUARIO,CLAVE);//declarar el objeto de la clase base de dato
      $result = $BaseDato->Consultas($q);
      if(pg_affected_rows($result) >= 0)
      return 1;
        else
      return 0;
    }
    public function fecha() {
      date_default_timezone_set('America/Guayaquil');
      $fecha = date("d-m-Y");
      return $fecha;
    }    
    public function hora() {
      date_default_timezone_set('America/Guayaquil');
      $hora = date("H:i:s");
      return $hora;
    }   
    public function fecha_hora() {
      date_default_timezone_set('America/Guayaquil');
      $fecha = date("Y-m-d H:i:s");
      return $fecha;
    }
    // fin 
    
  }
?>