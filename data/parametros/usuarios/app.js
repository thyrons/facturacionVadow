app.controller("usuariosController", function ($scope, $state, $http, AuthenticationService,cargarMenuService, undefinedService){
	var token;
    var formdata = new FormData();            
	if (localStorage['token']){
    	token = JSON.parse(localStorage['token']);
	} else {
		token = "No Autorizado";
	}
	AuthenticationService.checkToken(token);
    cargarMenuService.cargaMenu($state.current.name, token.data);
    $scope.buttonText = "Guardar Datos";    
   	$scope.logout = function(){
		var data = {
			token: token.data
		}
		$http({
            url: 'data/login/logout.php',
            method: "POST",
            data:data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {                      
            localStorage.clear();
			$state.go("login"); 
        },function(response) {
        	console.error(error);            
        });
	}
    $scope.cambioMenu = function (page){
       $state.go(page);
    }
    $scope.mySplit = function(nb) {        
        temp = token.data;
        var array = temp.split('|');        
        return array[nb];
    }
    $scope.cargadatos = function(estado) {        
        if($("#selectTipoIdentificacion").val() == '1'){//RUC
            $("#loading2").css("display","block");
            $http({
                url: 'data/parametros/usuarios/app.php',
                method: "POST",
                data: "tipo=" + "consultarRuc" + "&txt_ruc=" + $scope.Usuarios.txt_2,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                dataType: 'json',
            })
            .then(function (response) {
                //console.log(response.data)
                $("#loading2").css("display","none");
                if(response.data.datosEmpresa.valid  === 'true'){
                    $scope.Usuarios.txt_3 = response.data.datosEmpresa.razon_social;
                }else{
                    bootbox.dialog({
                        message: "Lo sentimos Usted no dispone de un RUC registrado en el SRI, o el número ingresado es Incorrecto.", 
                        buttons: {
                            "success" : {
                                "label" : "Aceptar",
                                "className" : "btn-sm btn-danger"
                            }
                        }
                    });
                }               
            },function(response) {
                $("#loading2").css("display","none");
                console.error(error);            
            });     
        }else{
            if($("#selectTipoIdentificacion").val() == '2'){//CEDULA
                $("#loading2").css("display","block");
                $http({
                    url: 'data/parametros/usuarios/app.php',
                    method: "POST",
                    data: "tipo=" + "consultarCedula" + "&txt_cedula=" + $scope.Usuarios.txt_2,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    dataType: 'json',
                })
                .then(function (response) {
                    $("#loading2").css("display","none");   
                    $scope.Usuarios.txt_3 = response.data.datosPersona.name;
                    console.log(response.data)
                },function(response) {
                    $("#loading2").css("display","none");
                    console.error(error);            
                });               
            }  
        }       
    }
    $("#file_1").ace_file_input('reset_input');
     $scope.filepreview =  'dist/images/default.jpg';
    $scope.recipientsList = [];         
    $scope.recipientsListProvincia = [];     
    $scope.recipientsListCiudad = []; 
    $scope.recipientsListCargos = []; 
    $scope.fecthRecipients = function() {
        $http({
            url: 'data/parametros/usuarios/app.php',
            method: "POST",
            data: "tipo=" + "cargarTipoIdentificacion",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {                      
            for(var i = 0; i < response.data.length; i++ ){
                temp = {
                    title : response.data[i].nombre,
                    id : response.data[i].id,                       
                }                                           
                $scope.recipientsList.push(temp);
            }                   
        });        
    }
    $scope.fecthRecipientsProvincia = function() {
        $http({
            url: 'data/parametros/usuarios/app.php',
            method: "POST",
            data: "tipo=" + "cargarProvincias",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {                      
            for(var i = 0; i < response.data.length; i++ ){
                temp = {
                    title : response.data[i].nombre,
                    id : response.data[i].id,                       
                }                                           
                $scope.recipientsListProvincia.push(temp);
            }                   
        });        
    }
    $scope.fecthRecipientsCiudad = function() {   
        var provincia = '';
        if($scope.recipientsProvincia){
            provincia = $scope.recipientsProvincia;
        }else{
            provincia = $("#selectProvincia").val();
        }
        $http({
            url: 'data/parametros/usuarios/app.php',
            method: "POST",
            data: "tipo=" + "cargarCiudades&id="+provincia,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {  
            $scope.recipientsListCiudad = [];                    
            if(response.data.length > 0){
                for(var i = 0; i < response.data.length; i++ ){
                    temp = {
                        title : response.data[i].nombre,
                        id : response.data[i].id,                       
                    }                                           
                    $scope.recipientsListCiudad.push(temp);
                }                   
            }else{
                $scope.recipientsListCiudad = [];
            }
        });        
    }
    $scope.fecthRecipientsCargos = function() {
        $http({
            url: 'data/parametros/usuarios/app.php',
            method: "POST",
            data: "tipo=" + "cargarCargos",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {                      
            for(var i = 0; i < response.data.length; i++ ){
                temp = {
                    title : response.data[i].nombre,
                    id : response.data[i].id,                       
                }                                           
                $scope.recipientsListCargos.push(temp);
            }                   
        });        
    }
    $scope.fecthRecipients();
    $scope.fecthRecipientsCargos();
    $scope.fecthRecipientsProvincia();
    $scope.submitForm = function() {      
        formdata.append('id', undefinedService.undefinedFunction($scope.Usuarios.txt_1));
        formdata.append('tipoIdentificacion',undefinedService.undefinedFunction($scope.recipients));
        formdata.append('identificacion', undefinedService.undefinedFunction($scope.Usuarios.txt_2));
        formdata.append('nombres_completos', undefinedService.undefinedFunction($scope.Usuarios.txt_3));
        formdata.append('apellidos_completos', undefinedService.undefinedFunction($scope.Usuarios.txt_11));
        formdata.append('fijo', undefinedService.undefinedFunction($scope.Usuarios.txt_4));
        formdata.append('movil', undefinedService.undefinedFunction($scope.Usuarios.txt_5));
        formdata.append('direccion', undefinedService.undefinedFunction($scope.Usuarios.txt_6));
        formdata.append('ciudad', undefinedService.undefinedFunction($scope.recipientsCiudad));
        formdata.append('correo', undefinedService.undefinedFunction($scope.Usuarios.txt_7));
        formdata.append('genero', undefinedService.undefinedFunction($scope.Usuarios.selectGenero));
        formdata.append('cargo', undefinedService.undefinedFunction($scope.recipientsCargos));
        formdata.append('usuario', undefinedService.undefinedFunction($scope.Usuarios.txt_8));
        formdata.append('clave', undefinedService.undefinedFunction($scope.Usuarios.txt_9));
        formdata.append('confirmarClave', undefinedService.undefinedFunction($scope.Usuarios.txt_10));
        formdata.append('verificador', undefinedService.undefinedFunction($scope.Usuarios.txt_verificador));
        formdata.append('estado', undefinedService.undefinedFunction($scope.Usuarios.selectEstado));
        formdata.append('tipo', $scope.buttonText);
        $("#file_1").ace_file_input('reset_input');
        $scope.Usuarios.name = {};
        if ($scope.formUsuarios.$valid) {               
            $http({
                url: 'data/parametros/usuarios/app.php',
                method: "POST",
                data: formdata,
                headers: {
                    'Content-Type': undefined
                }                   
            })
            .then(function(response) {
                formdata = new FormData();
                if(response.data == 1) {
                    $scope.Usuarios = {};
                    $scope.formUsuarios.$setPristine();
                    $scope.buttonText = "Guardar Datos";
                    bootbox.dialog({
                        message: "Datos Agregados Correctamente", 
                        buttons: {
                            "success" : {
                                "label" : "Aceptar",
                                "className" : "btn-sm btn-primary"
                            }
                        }
                    });                                     
                } else {
                    if(response.data == 2) {
                        bootbox.dialog({
                            message: "Error.. El nombre de usuario ya existe ingrese uno nuevo", 
                            buttons: {
                                "warning" : {
                                    "label" : "Aceptar",
                                    "className" : "btn-sm btn-warning"
                                }
                            }
                        }); 
                        $scope.Usuarios.txt_9 = "";
                        $scope.formUsuarios.$setPristine();
                    } else { 
                        if(response.data == 2) {
                            bootbox.dialog({
                                message: "Error.. El nombre de usuario ya existe ingrese uno nuevo", 
                                buttons: {
                                    "warning" : {
                                        "label" : "Aceptar",
                                        "className" : "btn-sm btn-warning"
                                    }
                                }
                            }); 
                            $scope.Usuarios.txt_9 = "";
                            $scope.formUsuarios.$setPristine();
                        }else{                            
                            bootbox.dialog({
                                message: "Error! Esta identificación ya existe", 
                                buttons: {
                                    "danger" : {
                                        "label" : "Aceptar",
                                        "className" : "btn-sm btn-danger"
                                    }
                                }
                            }); 
                             $scope.Usuarios.txt_2 = "";
                            $scope.formUsuarios.$setPristine();
                        }
                    }
                }
                $scope.filepreview =  'dist/images/default.jpg';
            }, 
            function(response) { 
                
            });
        } else {
            formdata = new FormData();  
        }
    };     
    $scope.atras = function(){
        var id = 0;
        if($scope.formUsuarios.txt_1.$viewValue){
            id = $scope.formUsuarios.txt_1.$viewValue;
        }else{
            id = 0;
        }
        $http({
            url: 'data/parametros/usuarios/app.php',
            method: "POST",
            data: "tipo=" + "atras"+"&id="+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {              
            if(response['statusText'] == 'OK'){
                if(response['data'] > 0){                   
                    getData(response['data']);
                }
            }else{
                bootbox.dialog({
                    message: "Error al Cargar los datos. Vuelva a Interntarlo", 
                    buttons: {
                        "success" : {
                            "label" : "Aceptar",
                            "className" : "btn-sm btn-danger"
                        }
                    }
                });
            }
        }); 
    }
    function getData(id){       
        $("#loading2").css("display","block");              
        $http({
            url: 'data/parametros/usuarios/app.php',
            method: "POST",
            data: "tipo=" + "Cargar Datos"+"&id="+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {  
            $("#loading2").css("display","none");   
            if(response['statusText'] == 'OK'){                
                $scope.Usuarios = {
                    txt_1 : response['data'][0],                    
                    txt_3 : response['data'][1],
                    txt_11 : response['data'][2],
                    txt_8 : response['data'][3],                    
                    txt_7 : response['data'][5],                    
                    txt_2 : response['data'][7],
                    txt_4 : response['data'][8],  
                    txt_5 : response['data'][9],
                    txt_6 : response['data'][10],
                    txt_verificador : response['data'][18], 
                }
                id_provincia = response['data'][17];
                id_ciudad = response['data'][16];                
                $("#selectProvincia").val(id_provincia);
                $("#selectProvincia").trigger("chosen:updated"); 
                $scope.fecthRecipientsCiudad();              
                $("#selectCiudad").val(id_ciudad);
                $("#selectCiudad").trigger("chosen:updated");


                $scope.filepreview =  response['data'][13],
                $("#selectTipoIdentificacion").val(response['data'][6]);
                $("#selectTipoIdentificacion").trigger("chosen:updated");    
                $("#selectGenero").val(response['data'][11]);
                $("#selectGenero").trigger("chosen:updated");
                $("#selectCargo").val(response['data'][12]);
                $("#selectCargo").trigger("chosen:updated");                   
            }else{
                bootbox.dialog({
                    message: "Error al Cargar los datos. Vuelva a Interntarlo", 
                    buttons: {
                        "success" : {
                            "label" : "Aceptar",
                            "className" : "btn-sm btn-danger"
                        }
                    }
                });
            }
        }); 
    }
    jQuery(function($) {    
        $("#loading2").css("display","none");
        $("#tabUsuario").click(function(event) {
            event.preventDefault();  
        });
        var grid_selector = "#table";
        var pager_selector = "#pager";
        $('#txt_9, #txt_4').attr('autocomplete','off');
        $('#txt_9').ace_spinner({value:1,min:1,max:100,step:1, on_sides: true, icon_up:'ace-icon fa fa-plus bigger-110', icon_down:'ace-icon fa fa-minus bigger-110', btn_up_class:'btn-success' , btn_down_class:'btn-danger'});
        //cambiar el tamaño para ajustarse al tamaño de la página
        $(window).on('resize.jqGrid', function () {
            $(grid_selector).jqGrid('setGridWidth', $("#tabUsuario").width() - 10);
        });
        $("#tabUsuario").on('shown.bs.tab', function(e) {
            $('.chosen-select').each(function() {
                var $this = $(this);
                $this.next().css({'width': $this.parent().width()});
            });            
        });     
        
        //cambiar el tamaño de la barra lateral collapse/expand
        var parent_column = $(grid_selector).closest('[class*="col-"]');
        $(document).on('settings.ace.jqGrid' , function(ev, event_name, collapsed) {
            if( event_name === 'sidebar_collapsed' || event_name === 'main_container_fixed' ) {
                //para dar tiempo a los cambios de DOM y luego volver a dibujar!!!
                setTimeout(function() {
                    $(grid_selector).jqGrid('setGridWidth', parent_column.width());
                }, 0);
            }
        });             
        if(!ace.vars['touch']) {            
            $('.chosen-select').chosen({allow_single_deselect:true}); 
            //resize the chosen on window resize        
            $(window)
            .off('resize.chosen')
            .on('resize.chosen', function() {
                $('.chosen-select').each(function() {
                     var $this = $(this);
                     $this.next().css({'width': $this.parent().width()});
                })
            }).trigger('resize.chosen');
            //resize chosen on sidebar collapse/expand
            $(document).on('settings.ace.chosen', function(e, event_name, event_val) {                  
                if(event_name != 'sidebar_collapsed') return;
                $('.chosen-select').each(function() {
                     var $this = $(this);
                     $this.next().css({'width': $this.parent().width()});
                });
            });             
        }
        $('#file_1').ace_file_input({
            no_file:'Selecione un archivo ...',                     
            btn_choose:'Selecionar',
            btn_change:'Cambiar',
            droppable:false,
            maxSize: 10000000, //~100 KB
            allowExt:  ['jpg', 'jpeg', 'png', 'gif', 'tif', 'tiff', 'bmp'],
            allowMime: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/tif', 'image/tiff', 'image/bmp'],
            thumbnail:false,
        }) 
        $(".remove").on('click',function() {
            $scope.filepreview =  'dist/images/default.jpg';
            $scope.$apply();
        });  
        $scope.getFiles = function($files, $val) {              
            angular.forEach($files, function(value, key, name) {                                
                formdata.append($val, value);
            });
        };       
    }); 
});