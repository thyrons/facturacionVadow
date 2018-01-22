var app = angular.module("vadowApp", ["ui.router","localytics.directives"]);

app.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/');
	$stateProvider
        .state("login", {
	        url:"/",
	        controller: "loginController",
	        templateUrl: "data/login/app.html"
        })         
        .state("home", {			        		  	
	        url:"/home",
	        controller: "mainController",
	        templateUrl: "data/home/app.html"	
        }) 
        ////parametros/// 
        .state("tipoAmbiente", {			        		  	
	        url:"/tipoAmbiente",
	        controller: "tipoAmbienteController",
	        templateUrl: "data/parametros/tipoAmbiente/app.html"	
        })
        .state("cargos", {			        		  	
	        url:"/cargos",
	        controller: "cargosController",
	        templateUrl: "data/parametros/cargos/app.html"	
        })
        .state("tipoIdentificacion", {			        		  	
	        url:"/tipoIdentificacion",
	        controller: "tipoIdentificacionController",
	        templateUrl: "data/parametros/tipoIdentificacion/app.html"	
        })
        .state("formasPago", {			        		  	
	        url:"/formasPago",
	        controller: "formasPagoController",
	        templateUrl: "data/parametros/formasPago/app.html"	
        })
        .state("tipoComprobante", {			        		  	
	        url:"/tipoComprobante",
	        controller: "tipoComprobanteController",
	        templateUrl: "data/parametros/tipoComprobante/app.html"	
        })
        .state("tipoImpuesto", {			        		  	
	        url:"/tipoImpuesto",
	        controller: "tipoImpuestoController",
	        templateUrl: "data/parametros/tipoImpuesto/app.html"	
        })
        .state("tarifaImpuesto", {			        		  	
	        url:"/tarifaImpuesto",
	        controller: "tarifaImpuestoController",
	        templateUrl: "data/parametros/tarifaImpuesto/app.html"	
        })
        .state("tipoRetencion", {			        		  	
	        url:"/tipoRetencion",
	        controller: "tipoRetencionController",
	        templateUrl: "data/parametros/tipoRetencion/app.html"	
        })
        .state("tarifaRetencion", {			        		  	
	        url:"/tarifaRetencion",
	        controller: "tarifaRetencionController",
	        templateUrl: "data/parametros/tarifaRetencion/app.html"	
        })
        .state("tipoEmision", {			        		  	
	        url:"/tipoEmision",
	        controller: "tipoEmisionController",
	        templateUrl: "data/parametros/tipoEmision/app.html"	
        })
        .state("usuarios", {			        		  	
	        url:"/usuarios",
	        controller: "usuariosController",
	        templateUrl: "data/parametros/usuarios/app.html"	
        })
        ////menus////
        .state("menu", {			        		  	
	        url:"/menu",
	        controller: "menuController",
	        templateUrl: "data/menu/menu/app.html"	
        })    
        .state("subMenu", {			        		  	
	        url:"/subMenu",
	        controller: "subMenuController",
	        templateUrl: "data/menu/subMenu/app.html"	
        })
        .state("accesos", {			        		  	
	        url:"/accesos",
	        controller: "accesosController",
	        templateUrl: "data/menu/accesos/app.html"	
        })         
})

app.service('AuthenticationService', ["$http", "$state", function($http, $state){	
	var self = this;
	self.checkToken = function(token){		
		var data = {token: token.data};
		$http({
            url: 'data/login/checkToken.php',
            method: "POST",
            data:data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {
            if (response.data === "unauthorized"){
				$state.go("login")
			} else {
				return response.data;
			}
        },function(response) {
        	$state.go("login") 
        });
	}
}]);
app.service('undefinedService',["$http",function(){
    var self = this;
    self.undefinedFunction = function(val){  
        if(val === undefined){
            return '';
        }
        else{
            return val;
        }
    }
}]);
app.service('cargarMenuService', ["$http", "$state", function($http, $state){	
	var self = this;
	self.cargaMenu = function(page,token){	
		if(token){
			$http({
	            url: 'data/menu/accesos/app.php',
	            method: "POST",
	            data: "page=" + page + "&token=" + token,
	            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	        })
	        .then(function(response) { 
	        	$("#menu").html(response.data[0]['menu']);
	        	if(response.data[0]['estado'] == 1){	        		
	        	}else{	        		
	        		$state.go("home") 
	        	} 				
	        },function(response) {
	          	  
	        });	
    	}else{
    		$state.go("login") 
    	}
	}
}]);
app.directive("fileinput", [function() {
    return {
        scope: {
            fileinput: "=",
            filepreview: "="
        },
        link: function(scope, element, attributes) {                
            element.bind("change", function(changeEvent) {                                      
                scope.fileinput = changeEvent.target.files[0];                                      
                var reader = new FileReader();                  
                reader.onload = function(loadEvent) {                       
                    scope.$apply(function() {                           
                        scope.filepreview = loadEvent.target.result;
                    });
                }                   
                if(scope.fileinput) {
                    reader.readAsDataURL(scope.fileinput);
                }
            });
        }
    }
}])
app.directive('chosen', function() {
    var linker = function(scope, element, attr) {
        scope.$watch(attr.ngModel, function() {             
            element.trigger('chosen:updated');
        }); 
        element.chosen();           
    };
    return {
        restrict: 'A',
        link: linker
    };
})
app.directive('compareTo', function() {
    return {
        require: "ngModel",
        scope:{
            otherModelValue : "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };
            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
})  