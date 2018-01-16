app.controller("loginController", function($scope, $http, $state){    
    localStorage.clear();
    var result = {
        test: undefined
    }
	$scope.userInfo = {
        usuario: undefined,
        password: undefined
    }
    $("#loading2").css("display","none");         
    $scope.submitForm = function(){
        $("#loading2").css("display","block"); 
        if ($scope.form_login.$valid) {            
            var data = {
                usuario: $scope.userInfo.usuario,
                password: $scope.userInfo.password,
            };                 
            $http({
                url: 'data/login/login.php',
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }                   
            })
            .then(function(response) {                
                if(response.data == 'ERROR'){
                    $("#loading2").css("display","none"); 
                    $.gritter.add({
                        title: '<span>Información Mensaje</span>',
                        text: ' <span class=""></span>'
                                    +' <span class="text-danger">Su usuario o contraseña son incorrectos</span>'
                                +'<span class="fa fa-ban fa-stack-2x text-danger"></span>',
                        image: 'dist/images/avatars/avatar6.png', 
                        sticky: false,
                        time: 3000,                                             
                    }); 
                    $state.go("login");

                }else{
                    localStorage.setItem("token", JSON.stringify(response));
                    $.gritter.add({
                        title: 'Información Mensaje',
                        text: ' <span class=""></span>'
                                    +' Bienvenido: <span class="text-success">'+ data.usuario
                                +'</span><br><span class="fa fa-paw"></span> Dame unos segundos para acceder a la aplicación <span class="text-succes fa fa-spinner fa-spin"></span>'
                                ,
                        image: 'dist/images/avatars/avatar6.png', 
                        sticky: false,
                        time: 1000,                                             
                    });
                    setTimeout(function(){
                        $("#loading2").css("display","none"); 
                        $state.go("home", result);  
                    },1000);
                    
                }
            }, 
            function(response) { // optional
                 $("#loading2").css("display","none"); 
                $state.go("login");
            });
        }else{
            
        }
    };
});