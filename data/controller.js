var app = angular.module("vadowApp", ["ui.router"]);

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