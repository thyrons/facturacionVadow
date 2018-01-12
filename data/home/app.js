app.controller("mainController", function ($scope, $state, $http, AuthenticationService,cargarMenuService){
	var token;
	if (localStorage['token']){
    	token = JSON.parse(localStorage['token']);
	} else {
		token = "No Autorizado";
	}
	AuthenticationService.checkToken(token);
    cargarMenuService.cargaMenu($state.current.name, token.data);
   	$scope.logout = function(){
		var data = {
			token: token
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
        	console.error(response);            
        });
	}
    $scope.cambioMenu = function (page){        
       $state.go(page);
    }   
});