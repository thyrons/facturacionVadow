app.controller("loginController", function($scope, $http, $state){    
    localStorage.clear();
    var result = {
        test: undefined
    }
	$scope.userInfo = {
        usuario: undefined,
        password: undefined
    }
    $scope.loginUser = function () {
        var data = {
            usuario: $scope.userInfo.usuario,
            password: $scope.userInfo.password
        }       
        $http({
            url: 'data/login/login.php',
            method: "POST",
            data:data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {                      
            //console.log(response);
            localStorage.setItem("token", JSON.stringify(response));
            $state.go("home", result);       
        },function(response) {
            
        }); 
    }
});