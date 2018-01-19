app.controller("usuariosController", function ($scope, $state, $http, AuthenticationService,cargarMenuService){
	var token;            
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
                 console.log(response.data)
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
    $scope.recipientsList = [];     
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

    $scope.fecthRecipients();

    jQuery(function($) {    
        $("#loading2").css("display","none");
        $("#tabUsuarios").click(function(event) {
            event.preventDefault();  
        });
        var grid_selector = "#table";
        var pager_selector = "#pager";
        $('#txt_9, #txt_4').attr('autocomplete','off');
        $('#txt_9').ace_spinner({value:1,min:1,max:100,step:1, on_sides: true, icon_up:'ace-icon fa fa-plus bigger-110', icon_down:'ace-icon fa fa-minus bigger-110', btn_up_class:'btn-success' , btn_down_class:'btn-danger'});
        //cambiar el tamaño para ajustarse al tamaño de la página
        $(window).on('resize.jqGrid', function () {
            $(grid_selector).jqGrid('setGridWidth', $("#tabUsuarios").width() - 10);
        });
        $("#tabUsuarios").on('shown.bs.tab', function(e) {
            $('.chosen-select').each(function() {
                var $this = $(this);
                $this.next().css({'width': $this.parent().width()});
            });
            if($(e.target).text() == 'Depreciación'){
                generarDepreciacion();
            }
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
       
    }); 
});