app.controller("nuevoArticuloController", function ($scope, $state, $http, AuthenticationService,cargarMenuService,cargarEmpresaSucursalService){
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