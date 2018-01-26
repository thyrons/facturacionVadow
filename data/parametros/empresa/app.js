app.controller("empresaController", function ($scope, $state, $http, AuthenticationService,cargarMenuService, undefinedService){	
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
    $("#file_1, #file_2").ace_file_input('reset_input');
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
    $scope.ventanaBusqueda = function(){
        $('#modal-table').modal('show');        
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
        $("#loading2").css("display","block");
        $http({
            url: 'data/parametros/usuarios/app.php',
            method: "POST",
            data: "tipo=" + "consultarRuc" + "&txt_ruc=" + $scope.empresa.txt_3,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            dataType: 'json',
        })
        .then(function (response) {
            //console.log(response.data)
            $("#loading2").css("display","none");
            if(response.data.datosEmpresa.valid  === 'true'){
                $scope.empresa.txt_2 = response.data.datosEmpresa.razon_social;
                if(response.data.datosEmpresa.nombre_comercial == "no disponible"){
                	$scope.empresa.txt_1 = response.data.datosEmpresa.razon_social;	
                }else{
                	$scope.empresa.txt_1 = response.data.datosEmpresa.nombre_comercial;
                }
                $("#select_obligacion").val(response.data.datosEmpresa.obligado_llevar_contabilidad);
                $("#select_obligacion").trigger("chosen:updated");                  
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
    }

    jQuery(function($) {    
        $("#loading2").css("display","none");
        $("#tabEmpresa").click(function(event) {
            event.preventDefault();  
        });        
        $("#tabEmpresa").on('shown.bs.tab', function(e) {
            $('.chosen-select').each(function() {
                var $this = $(this);
                $this.next().css({'width': $this.parent().width()});
            });            
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
	/*$scope.$route = $route;
	$("#file_1, #file_2").ace_file_input('reset_input');
	$scope.buttonText = "Guardar Datos";	
	var formdata = new FormData();

	jQuery(function($) {	
		$( "#tabEmpresa" ).click(function(event) {
			event.preventDefault();  
		});	
		$("#tabEmpresa").on('shown.bs.tab', function(e) {
			$('.chosen-select').each(function() {
				var $this = $(this);
				$this.next().css({'width': $this.parent().width()});
			})	
		});		
		$('[data-toggle="tooltip"]').tooltip(); 			
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

			$('#file_1 , #file_2').ace_file_input({
				no_file:'Selecione un archivo ...',
				btn_choose:'Selecionar',
				btn_change:'Cambiar',
				droppable:false,
				onchange:null,
				thumbnail:false
			});
		}
	});

	// consultar ruc
	$scope.cargadatos = function(estado) {
		if (estado) {
			$.blockUI({ css: { 
	            border: 'none', 
	            padding: '15px', 
	            backgroundColor: '#000', 
	            '-webkit-border-radius': '10px', 
	            '-moz-border-radius': '10px', 
	            opacity: .5, 
	            color: '#fff' 
	        	},
	            message: '<h3>Consultando, Por favor espere un momento    ' + '<i class="fa fa-spinner fa-spin"></i>' + '</h3>'
	    	});
			$http({
		        url: 'data/parametros/empresa/app.php',
		        method: "POST",
		        data: "consulta_ruc=" + "consulta_ruc" + "&txt_ruc=" + $scope.empresa.txt_3,
		        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		        dataType: 'json',
		    })
		    .then(function (response) {
		    	$.unblockUI();
		    	if(response.data.datosEmpresa.valid == 'true') {
		    		$scope.empresa.txt_1 = response.data.datosEmpresa.nombre_comercial;
			    	$scope.empresa.txt_2 = response.data.datosEmpresa.razon_social;	   						
		    	} else {
		    		if(response.data.datosEmpresa.valid == 'false') {
		    			$.gritter.add({
							title: 'Lo sentimos", "Usted no dispone de un RUC registrado en el SRI, o el número ingresado es Incorrecto."',
							class_name: 'gritter-error gritter-center',
							time: 1000,
						});	
		    		}	
		    	}
		    });
		}
	}
	// fin

	// datos formdata
	$scope.getFiles = function($files, $val) {	    		
    	angular.forEach($files, function(value, key, name) {           		            	
        	formdata.append($val, value);
    	});
	};
	// fin
	
	$scope.submitForm = function() { 			
		formdata.append('nombreComercial',undefinedFunction($scope.empresa.txt_1));
		formdata.append('razonSocial',undefinedFunction($scope.empresa.txt_2));
		formdata.append('ruc',undefinedFunction($scope.empresa.txt_3));
		formdata.append('direccion',undefinedFunction($scope.empresa.txt_4));
		formdata.append('email',undefinedFunction($scope.empresa.txt_5));
		formdata.append('obligacion',$("#select_obligacion").val());
		formdata.append('contribuyente',undefinedFunction($scope.empresa.txt_6));
		formdata.append('autorizacion',undefinedFunction($scope.empresa.txt_7));
		formdata.append('token',undefinedFunction($scope.empresa.txt_8));
		formdata.append('id',undefinedFunction($scope.empresa.txt_id));
		formdata.append('verificador',undefinedFunction($scope.empresa.txt_verificador));
		formdata.append('tipo',$scope.buttonText);
		$("#file_1, #file_2").ace_file_input('reset_input');
		$scope.empresa.name = {};
		
		if ($scope.formEmpresa.$valid) {					
			$http({
		        url: 'data/parametros/empresa/app.php',
		        method: "POST",
		        data: formdata,
		        headers: {
                    'Content-Type': undefined
                }			        
		    })
		    .then(function(response) {
		    	formdata = new FormData();

		    	if(response.data == 1) {
		    		$scope.empresa = {};
		    		$scope.formEmpresa.$setPristine();
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
					loadData();
		    	} else {
		    		if(response.data == 5) {
		    			bootbox.dialog({
							message: "Error! El registro esta siendo modificado por otro usuario. Recarge los datos antes de continuar", 
							buttons: {
								"danger" : {
									"label" : "Aceptar",
									"className" : "btn-sm btn-danger"
								}
							}
						});
		    		} else {
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
		    function(response) { 
		  
		    });
		} else {
			formdata = new FormData();
		}
	};

	$scope.soloNumeros = function($event) {
        if(isNaN(String.fromCharCode($event.keyCode))) {
            $event.preventDefault();
        }
	};

	function loadData() {
    	$http({
	        url: 'data/parametros/empresa/app.php',
	        method: "POST",
	        data: "tipo=" + "btnCargarDatos",
	        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    })
	    .then(function(response) {
	    	if(response.data.length > 0) {
		    	$scope.empresa = {		    		
	    			txt_1 : response.data[0]['nombreComercial'],
		    		txt_2 : response.data[0]['razonSocial'],
		    		txt_3 : response.data[0]['ruc'],
		    		txt_4 : response.data[0]['direccion'],
		    		txt_5 : response.data[0]['email'],
					txt_6 : response.data[0]['contribuyente'],
					txt_7 : response.data[0]['autorizacion'],
					txt_8 : response.data[0]['clave'],
					txt_id : response.data[0]['id'],
					txt_verificador : response.data[0]['numeroVerificador'],		   						
		    	}
		    	$scope.filepreview =  'data/parametros/empresa/'+response.data[0]['logo'];
		    	$("#select_obligacion").val(response.data[0]['obligacion']);
		    	$("#select_obligacion").trigger("chosen:updated");
		    	$scope.buttonText = "Modificar Datos";
	    	} else {
	    		$scope.buttonText = "Guardar Datos";
	    		$scope.filepreview =  'data/parametros/empresa/logos/defaul.png';
	    	}
	    }, 
	    function(response) { 
	        
	    });
	}

	// campos undefinidos
	function undefinedFunction(val) {
		if(val == 'undefined') {
			return val = '';
		} else {
			return val;
		}
	}
	// fin
	loadData();*/
	
});	
