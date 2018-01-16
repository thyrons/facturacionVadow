app.controller("accesosController", function ($scope, $state, $http, AuthenticationService,cargarMenuService){
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
    jQuery(function($) {
        $("#loading2").css("display","none");       
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
                })
            });
        }       
        // recargar formulario
        function redireccionar() {
            setTimeout(function() {
                location.reload(true);
            }, 1000);
        }
        // fin      
        var dataToTree = loadData();//see below     
        var sampleData = dataTree(dataToTree);
    
        $('#tree1').ace_tree({
            dataSource: sampleData['dataSource1'],
            multiSelect: true,
            cacheItems: true,
            'open-icon' : 'ace-icon tree-minus',
            'close-icon' : 'ace-icon tree-plus',
            'itemSelect' : true,
            'folderSelect': false,
            'selected-icon' : 'ace-icon fa fa-check',
            'unselected-icon' : 'ace-icon fa fa-times',
            loadingHTML : '<div class="tree-loading"><i class="ace-icon fa fa-refresh fa-spin blue"></i></div>'
        }); 
        $('#tree1').tree('discloseAll');                    
        var dataAccesos = [];
        cargarUsuarios();
        $("#btn_consultar").on('click',function(){
            if($("#select_usuarios").val() == ""){
                bootbox.dialog({
                    message: "Error! Seleccione un Cargo antes de continuar", 
                    buttons: {
                        "success" : {
                            "label" : "Aceptar",
                            "className" : "btn-sm btn-primary"
                        }
                    }
                });
            }else{
                rolUsuario($("#select_usuarios").val());    
            }
            
        });
        $("#btn_guardar").on('click',function(){
            guardarUsuario();
        });
        function cargarUsuarios(){
            $.ajax({
                type: "POST",
                url: 'data/menu/accesos/cargarAccesos.php',              
                data: {
                    funcion:'2',                        
                },
                //dataType: 'json', 
                success: function(data) {                                                                   
                    $('#select_usuarios').html(data);
                    $("#select_usuarios").trigger("chosen:updated");            
                }                           
            });     
        }   
        function loadData(){
            var tree_data  = {};    
            $.ajax({
                type: "POST",
                url: 'data/menu/accesos/cargarAccesos.php',
                async : false,
                data: {
                    funcion:'1',                        
                },
                dataType: 'json',   
                success: function(data) {                                                                   
                    for (var i = 0; i < data.length; i++) {
                        var tree_temp = Array();
                        temp = {
                            text : data[i][2],
                            type : 'folder',                            
                        }
                        var name = data[i][1];
                        tree_data[name] = temp;
                        tree_data[name]['additionalParameters'] = {} ;
                        tree_data[name]['additionalParameters']['children'] = {};
                        for (var j = 0; j < data[i][5]['accesos'].length; j++) {                            
                            tempSub = {
                                text : data[i][5]['accesos'][j][2],
                                type : 'item',
                                dataAttributes: {
                                    id: data[i][5]['accesos'][j][0]
                                }                               
                            }                           
                            var nameTemp = data[i][5]['accesos'][j][1];                         
                            tree_data[name]['additionalParameters']['children'][nameTemp] = tempSub;
                        }                       
                    }                   
                }                           
            });           
            return tree_data;         
        }
        function dataTree (dataToTree){         
            var dataSource1 = function(options, callback){              
                var $data = null
                if(!("text" in options) && !("type" in options)){                   
                    $data = dataToTree;//the root tree                  
                    callback({ data: $data });
                    return;
                }
                else if("type" in options && options.type == "folder") {                    
                    if("additionalParameters" in options && "children" in options.additionalParameters)
                        $data = options.additionalParameters.children || {};
                    else $data = {}//no data
                }
                
                //setTimeout(function(){callback({ data: $data });} , parseInt(Math.random() * 500) + 200);
                if($data != null)//this setTimeout is only for mimicking some random delay
                    //console.log($data)
                    setTimeout(function(){callback({ data: $data });} , parseInt(Math.random() * 500) + 200);
                    
                //we have used static data here
                //but you can retrieve your data dynamically from a server using ajax call
                //checkout examples/treeview.html and examples/treeview.js for more info
            }

            return {'dataSource1': dataSource1 }
        }
        function rolUsuario(id){            
            $("#loading2").css("display","block");
            $.ajax({
                type: "POST",
                url: 'data/menu/accesos/cargarAccesos.php',              
                data: {
                    funcion:'3',
                    id:id
                },
                dataType: 'json',   
                success: function(data) {   
                    console.log(data)
                    $("#loading2").css("display","none");
                    for(var i = 0; i < data.length; i++){                                               
                        $('#tree1').tree('selectItem',$("#"+data[i]));  
                    }

                },
                error: function (xhr, status, errorThrown) {
                    $("#loading2").css("display","none");
                    alert("Hubo un problema!");
                    console.log("Error: " + errorThrown);
                    console.log("Status: " + status);
                    console.dir(xhr);
                }                           
            });         
        }

        function guardarUsuario(){
            if($("#select_usuarios").val() == ""){
                bootbox.dialog({
                    message: "Error! Seleccione un Cargo antes de continuar", 
                    buttons: {
                        "success" : {
                            "label" : "Aceptar",
                            "className" : "btn-sm btn-primary"
                        }
                    }
                });
            }else{
                $("#loading2").css("display","block");                  
                var items = $('#tree1').tree('selectedItems');
                var item = [];          
                for(var i = 0; i < items.length; i++){
                    item.push(items[i]['dataAttributes']['id']);
                }           
                $.ajax({
                    type: "POST",
                    url: 'data/menu/accesos/cargarAccesos.php',              
                    data: {
                        funcion:'4',
                        id:$("#select_usuarios").val(),
                        datos: item
                    },
                    //dataType: 'json', 
                    success: function(data) {   
                        $("#loading2").css("display","none");
                        if(data == 1){
                            $.gritter.add({                         
                                title: 'Mensaje de Salida',                         
                                text: 'Datos Modificados Correctamente',
                                image: 'dist/images/confirm.png',
                                class_name: 'gritter-light'
                            });                     
                            $("#select_usuarios").val("");
                            $("#select_usuarios").trigger("chosen:updated");
                            var data = $('#tree1').tree('selectedItems');
                            for(var i = 0; i< data.length; i++){
                                var temp = data[i]['dataAttributes']['id']              
                                $('#tree1').tree('selectItem',$("#"+temp))
                            }
                            cargarMenuService.cargaMenu($state.current.name, token.data);
                        }else{

                        }
                    },
                    error: function (xhr, status, errorThrown) {
                        $("#loading2").css("display","none");
                        alert("Hubo un problema!");
                        console.log("Error: " + errorThrown);
                        console.log("Status: " + status);
                        console.dir(xhr);
                    }                           
                });
            }
        }

        $("#select_usuarios").on("change",function(){
            var data = $('#tree1').tree('selectedItems');
            for(var i = 0; i< data.length; i++){
                var temp = data[i]['dataAttributes']['id']              
                $('#tree1').tree('selectItem',$("#"+temp))
            }
        })
    });
});