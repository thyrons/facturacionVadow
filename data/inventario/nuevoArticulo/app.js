app.controller("nuevoArticuloController", function ($scope, $state, $http, AuthenticationService,cargarMenuService,cargarEmpresaSucursalService, undefinedService){
	var token;
	if (localStorage['token']){
    	token = JSON.parse(localStorage['token']);
	} else {
		token = "No Autorizado";
	}
	AuthenticationService.checkToken(token);
    cargarMenuService.cargaMenu($state.current.name, token.data);    
    $scope.recipientsList = cargarEmpresaSucursalService.cargaEmpresaSucursal();
    $scope.recipientsListTipoProducto = cargarEmpresaSucursalService.cargaTipoProducto();
    $scope.recipientsListIva = cargarEmpresaSucursalService.cargaIva();
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
    $scope.buttonText = "Guardar Datos"; 
    $scope.submitForm = function(){         
        if ($scope.formNuevoArticulo.$valid) {
            var data = $.param({
                sucursal: undefinedService.undefinedFunction($scope.recipients),
                tipo_producto: undefinedService.undefinedFunction($scope.recipientsTipoProducto),
                iva: undefinedService.undefinedFunction($scope.recipientsIva),
                codigo : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_1),
                barras : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_2),
                nombre : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_3),
                descripcion : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_4),
                descuento : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_5),
                ganancia : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_6),
                marca : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_7),
                modelo : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_8),
                atributo_1 : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_9),
                descipcion_1 : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_10),
                atributo_2 : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_11),
                descipcion_2 : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_12),
                atributo_3 : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_13),
                descipcion_3 : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_14),
                id : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_id),                
                verificador : undefinedService.undefinedFunction($scope.nuevoArticulo.txt_verificador),
                tipo: $scope.buttonText
            });             
            $http({
                url: 'data/inventario/nuevoArticulo/app.php',
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }                   
            })
            .then(function(response) {                                  
                if(response.data == 1){
                    $scope.Sucursal = {};
                    $scope.formNuevoArticulo.$setPristine();
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
                }
                else{
                    if(response.data == 2){
                        bootbox.dialog({
                            message: "Error! Al intentar guardar los Datos. Este código ya existe para esta sucursal", 
                            buttons: {
                                "danger" : {
                                    "label" : "Aceptar",
                                    "className" : "btn-sm btn-danger"
                                }
                            }
                        });  
                    }else{
                        bootbox.dialog({
                            message: "Error! Al intentar guardar los Datos. Comuniquese con el Administrador", 
                            buttons: {
                                "danger" : {
                                    "label" : "Aceptar",
                                    "className" : "btn-sm btn-danger"
                                }
                            }
                        });  
                    }             
                }
            }, 
            function(response) {});
        }else{
            
        }
    };
    jQuery(function($) {        
        $("#loading2").css("display","none");       
        $( "#tabNuevoArticulo" ).click(function( event ) {
            event.preventDefault();  
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