app.controller("usuariosController", function ($scope, $state, $http, AuthenticationService,cargarMenuService, undefinedService,cargarProvinciasService,cargarCiudadesService,cargarCargosService,cargarIdentificacionService){
	var token;
    var formdata = new FormData();            
	if (localStorage['token']){
    	token = JSON.parse(localStorage['token']);
	} else {
		token = "No Autorizado";
	}
	AuthenticationService.checkToken(token);
    cargarMenuService.cargaMenu($state.current.name, token.data);
    $scope.recipientsListProvincia = cargarProvinciasService.cargaProvincias();
    $scope.recipientsListCargos = cargarCargosService.cargaCargos();
    $scope.recipientsListIdentificacion = cargarIdentificacionService.cargaIdentificacion();
    $scope.fecthRecipientsCiudad = function(id){        
        $scope.recipientsListCiudad = [];       
        if(id == undefined){
            var temp = cargarCiudadesService.cargaCiudades($scope.recipientsProvincia);
            $scope.recipientsListCiudad = temp; 
        }else{
            var temp = cargarCiudadesService.cargaCiudades(id);
            $scope.recipientsListCiudad = temp;              
        }
    }    
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
                //console.log(response.data)
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
                    //console.log(response.data)
                },function(response) {
                    $("#loading2").css("display","none");
                    console.error(error);            
                });               
            }  
        }       
    }
    $("#file_1").ace_file_input('reset_input');
    $scope.filepreview =  'dist/images/default.jpg';
    $scope.submitForm = function() {      
        formdata.append('id', undefinedService.undefinedFunction($scope.Usuarios.txt_1));
        formdata.append('tipoIdentificacion',undefinedService.undefinedFunction($scope.recipientsIdentificacion));
        formdata.append('identificacion', undefinedService.undefinedFunction($scope.Usuarios.txt_2));
        formdata.append('nombres_completos', undefinedService.undefinedFunction($scope.Usuarios.txt_3));
        formdata.append('apellidos_completos', undefinedService.undefinedFunction($scope.Usuarios.txt_11));
        formdata.append('fijo', undefinedService.undefinedFunction($scope.Usuarios.txt_4));
        formdata.append('movil', undefinedService.undefinedFunction($scope.Usuarios.txt_5));
        formdata.append('direccion', undefinedService.undefinedFunction($scope.Usuarios.txt_6));
        formdata.append('ciudad', undefinedService.undefinedFunction($scope.recipientsCiudad));
        formdata.append('correo', undefinedService.undefinedFunction($scope.Usuarios.txt_7));
        formdata.append('genero', $scope.Usuarios.selectGenero);
        formdata.append('cargo', undefinedService.undefinedFunction($scope.recipientsCargos));
        formdata.append('usuario', undefinedService.undefinedFunction($scope.Usuarios.txt_8));
        formdata.append('clave', undefinedService.undefinedFunction($scope.Usuarios.txt_9));
        formdata.append('confirmarClave', undefinedService.undefinedFunction($scope.Usuarios.txt_10));
        formdata.append('verificador', undefinedService.undefinedFunction($scope.Usuarios.txt_verificador));
        formdata.append('estado', undefinedService.undefinedFunction($scope.Usuarios.selectEstado));
        formdata.append('tipo', $scope.buttonText);
        $("#file_1").ace_file_input('reset_input');
        $scope.Usuarios.name = {};
        if ($scope.formUsuarios.$valid) {               
            $http({
                url: 'data/parametros/usuarios/app.php',
                method: "POST",
                data: formdata,
                headers: {
                    'Content-Type': undefined
                }                   
            })
            .then(function(response) {
                formdata = new FormData();
                if(response.data == 1) {
                    $scope.Usuarios = {};
                    $scope.formUsuarios.$setPristine();
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
                } else {
                    if(response.data == 2) {
                        bootbox.dialog({
                            message: "Error.. El nombre de usuario ya existe ingrese uno nuevo", 
                            buttons: {
                                "warning" : {
                                    "label" : "Aceptar",
                                    "className" : "btn-sm btn-warning"
                                }
                            }
                        }); 
                        $scope.Usuarios.txt_9 = "";
                        $scope.formUsuarios.$setPristine();
                    } else { 
                        if(response.data == 3) {
                            bootbox.dialog({
                                message: "Error! Esta identificación ya existe", 
                                buttons: {
                                    "warning" : {
                                        "label" : "Aceptar",
                                        "className" : "btn-sm btn-warning"
                                    }
                                }
                            }); 
                            $scope.Usuarios.txt_2 = "";
                            $scope.formUsuarios.$setPristine();
                        }else{ 
                            if(response.data == 5) {                           
                                bootbox.dialog({
                                    message: "Error! Otro Usuario esta modificando este Registro. Recarge la Página y vuela a Intentarlo", 
                                    buttons: {
                                        "danger" : {
                                            "label" : "Aceptar",
                                            "className" : "btn-sm btn-danger"
                                        }
                                    }
                                }); 
                            }else{
                                bootbox.dialog({
                                    message: "Error! Al momento de generar los datos.. Comuniquese con su administrador", 
                                    buttons: {
                                        "danger" : {
                                            "label" : "Aceptar",
                                            "className" : "btn-sm btn-danger"
                                        }
                                    }
                                });   
                            }                           
                        }
                    }
                }
                $scope.filepreview =  'dist/images/default.jpg';
            }, 
            function(response) { 
                
            });
        } else {
            formdata = new FormData();  
        }
    };     
    $scope.atras = function(){
        var id = 0;
        if($scope.formUsuarios.txt_1.$viewValue){
            id = $scope.formUsuarios.txt_1.$viewValue;
        }else{
            id = 0;
        }
        $http({
            url: 'data/parametros/usuarios/app.php',
            method: "POST",
            data: "tipo=" + "atras"+"&id="+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {              
            if(response['statusText'] == 'OK'){
                if(response['data'] > 0){                   
                    getData(response['data']);
                }
            }else{
                bootbox.dialog({
                    message: "Error al Cargar los datos. Vuelva a Interntarlo", 
                    buttons: {
                        "success" : {
                            "label" : "Aceptar",
                            "className" : "btn-sm btn-danger"
                        }
                    }
                });
            }
        }); 
    }
    $scope.principio = function(){            
        $http({
            url: 'data/parametros/usuarios/app.php',
            method: "POST",
            data: "tipo=" + "principio",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {              
            if(response['statusText'] == 'OK'){
                if(response['data'] > 0){                   
                    getData(response['data']);
                }
            }else{
                bootbox.dialog({
                    message: "Error al Cargar los datos. Vuelva a Interntarlo", 
                    buttons: {
                        "success" : {
                            "label" : "Aceptar",
                            "className" : "btn-sm btn-danger"
                        }
                    }
                });
            }
        }); 
    }
    $scope.adelante = function(){
        var id = 0;
        if($scope.formUsuarios.txt_1.$viewValue){
            id = $scope.formUsuarios.txt_1.$viewValue;
        }else{
            id = 0;
        }
        $http({
            url: 'data/parametros/usuarios/app.php',
            method: "POST",
            data: "tipo=" + "adelante"+"&id="+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {              
            if(response['statusText'] == 'OK'){
                if(response['data'] > 0){                   
                    getData(response['data']);
                }
            }else{
                bootbox.dialog({
                    message: "Error al Cargar los datos. Vuelva a Interntarlo", 
                    buttons: {
                        "success" : {
                            "label" : "Aceptar",
                            "className" : "btn-sm btn-danger"
                        }
                    }
                });
            }
        }); 
    }
    $scope.final = function(){          
        $http({
            url: 'data/parametros/usuarios/app.php',
            method: "POST",
            data: "tipo=" + "final",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {              
            if(response['statusText'] == 'OK'){
                if(response['data'] > 0){                   
                    getData(response['data']);
                }
            }else{
                bootbox.dialog({
                    message: "Error al Cargar los datos. Vuelva a Interntarlo", 
                    buttons: {
                        "success" : {
                            "label" : "Aceptar",
                            "className" : "btn-sm btn-danger"
                        }
                    }
                });
            }
        }); 
    }    
    function getData(id){
        $("#loading2").css("display","block");              
        $http({
            url: 'data/parametros/usuarios/app.php',
            method: "POST",
            data: "tipo=" + "Cargar Datos"+"&id="+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {  
            $("#loading2").css("display","none");   
            if(response['statusText'] == 'OK'){                
                $scope.Usuarios = {
                    txt_1 : response['data'][0],                    
                    txt_3 : response['data'][1],
                    txt_11 : response['data'][2],
                    txt_8 : response['data'][3],                    
                    txt_7 : response['data'][5],                    
                    txt_2 : response['data'][7],
                    txt_4 : response['data'][8],  
                    txt_5 : response['data'][9],
                    txt_6 : response['data'][10],
                    txt_verificador : response['data'][18], 
                }
                id_provincia = response['data'][17];
                id_ciudad = response['data'][16];
                $("#selectProvincia").val(id_provincia);
                $("#selectProvincia").trigger("chosen:updated");                                 
                $scope.formUsuarios.selectCiudad.$setViewValue(id_ciudad); 
                $scope.fecthRecipientsCiudad(id_provincia);
                $scope.formUsuarios.selectProvincia.$setViewValue(id_provincia); 
                $("#selectCiudad").val($scope.selectCiudad);
                $("#selectCiudad").trigger("chosen:updated");                                     
                $("#selectTipoIdentificacion").val(response['data'][6]);
                $("#selectTipoIdentificacion").trigger("chosen:updated");    
                $scope.formUsuarios.selectTipoIdentificacion.$setViewValue(response['data'][6]); 
                $("#selectGenero").val(response['data'][11]);
                $("#selectGenero").trigger("chosen:updated");
                $scope.formUsuarios.selectGenero.$setViewValue(response['data'][11]); 
                $("#selectCargo").val(response['data'][12]);
                $("#selectCargo").trigger("chosen:updated"); 
                $scope.formUsuarios.selectCargo.$setViewValue(response['data'][12]); 
                $("#selectEstado").val(response['data'][19]);
                $("#selectEstado").trigger("chosen:updated");    
                $scope.formUsuarios.selectEstado.$setViewValue(response['data'][19]); 
                $scope.buttonText = "Modificar Datos";                   
                $scope.filepreview =  'data/parametros/usuarios/'+response['data'][13];
                $('#modal-table').modal('hide');
            }else{
                bootbox.dialog({
                    message: "Error al Cargar los datos. Vuelva a Interntarlo", 
                    buttons: {
                        "success" : {
                            "label" : "Aceptar",
                            "className" : "btn-sm btn-danger"
                        }
                    }
                });
            }           
        }) 
    }
    jQuery(function($) {    
        $("#loading2").css("display","none");
        $("#tabUsuario").click(function(event) {
            event.preventDefault();  
        });
        var grid_selector = "#table";
        var pager_selector = "#pager";
        $('#txt_9, #txt_4').attr('autocomplete','off');
        $('#txt_9').ace_spinner({value:1,min:1,max:100,step:1, on_sides: true, icon_up:'ace-icon fa fa-plus bigger-110', icon_down:'ace-icon fa fa-minus bigger-110', btn_up_class:'btn-success' , btn_down_class:'btn-danger'});
        //cambiar el tamaño para ajustarse al tamaño de la página
        $(window).on('resize.jqGrid', function () {
            $(grid_selector).jqGrid('setGridWidth', $("#tabUsuario").width() - 10);
        });
        $("#tabUsuario").on('shown.bs.tab', function(e) {
            $('.chosen-select').each(function() {
                var $this = $(this);
                $this.next().css({'width': $this.parent().width()});
            });            
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
        var myTable = 
            $('#usuarios-table')
            //.wrap("<div class='dataTables_borderWrap' />")   //if you are applying horizontal scrolling (sScrollX)
            .DataTable( {
                bAutoWidth: false,
                "aoColumns": [
                  {"id":null},                  
                  {"identificacion":null,"sClass": "center"}, 
                  {"nombres_completos":null}, 
                  {"apellidos_completos":null}, 
                ],  
                "aaSorting": [],
                'language': {
                    "sProcessing":     "Procesando...",
                    "sLengthMenu":     "Mostrar _MENU_ registros",
                    "sZeroRecords":    "No se encontraron resultados",
                    "sEmptyTable":     "Ningún dato disponible en esta tabla",
                    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros ",
                    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
                    "sInfoPostFix":    "",
                    "sSearch":         "Buscar:",
                    "sUrl":            "",
                    "sInfoThousands":  ",",
                    "sLoadingRecords": "Cargando...",
                    "oPaginate": {
                        "sFirst":    "Primero",
                        "sLast":     "Último",
                        "sNext":     "Siguiente",
                        "sPrevious": "Anterior"
                    },
                    "oAria": {
                        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                    },
                    select: {
                        rows: ""
                    }
                },
                "columnDefs": [{
                        "targets": [ 0 ],
                        "visible": false,
                        "searchable": false,
                    },
                ],
                "ajax": {
                    "url": "data/parametros/usuarios/app.php",
                    "type": "POST",
                    "data": {
                        "tipo": "Busqueda"
                    }
                },
                select: true                    
            } );    
            $.fn.dataTable.Buttons.defaults.dom.container.className = 'dt-buttons btn-overlap btn-group btn-overlap';            
            new $.fn.dataTable.Buttons( myTable, {
                buttons: [
                  {
                    "extend": "colvis",
                    "text": "<i class='fa fa-search bigger-110 blue'></i> <span class='hidden'>Show/hide columns</span>",
                    "className": "btn btn-white btn-primary btn-bold",
                    columns: ':not(:first):not(:last)'
                  },
                  {
                    "extend": "copy",
                    "text": "<i class='fa fa-copy bigger-110 pink'></i> <span class='hidden'>Copy to clipboard</span>",
                    "className": "btn btn-white btn-primary btn-bold"
                  },
                  {
                    "extend": "csv",
                    "text": "<i class='fa fa-database bigger-110 orange'></i> <span class='hidden'>Export to CSV</span>",
                    "className": "btn btn-white btn-primary btn-bold"
                  },
                  {
                    "extend": "excel",
                    "text": "<i class='fa fa-file-excel-o bigger-110 green'></i> <span class='hidden'>Export to Excel</span>",
                    "className": "btn btn-white btn-primary btn-bold"
                  },
                  {
                    "extend": "pdf",
                    "text": "<i class='fa fa-file-pdf-o bigger-110 red'></i> <span class='hidden'>Export to PDF</span>",
                    "className": "btn btn-white btn-primary btn-bold"
                  },
                  {
                    "extend": "print",
                    "text": "<i class='fa fa-print bigger-110 grey'></i> <span class='hidden'>Print</span>",
                    "className": "btn btn-white btn-primary btn-bold",
                    autoPrint: false,
                    message: 'This print was produced using the Print button for DataTables'
                  }       
                ]
            } );
            myTable.buttons().container().appendTo( $('.tableTools-container') );            
            //style the message box
            var defaultCopyAction = myTable.button(1).action();
            myTable.button(1).action(function (e, dt, button, config) {
                defaultCopyAction(e, dt, button, config);
                $('.dt-button-info').addClass('gritter-item-wrapper gritter-info gritter-center white');
            });                        
            var defaultColvisAction = myTable.button(0).action();
            myTable.button(0).action(function (e, dt, button, config) {                
                defaultColvisAction(e, dt, button, config); 
                if($('.dt-button-collection > .dropdown-menu').length == 0) {
                    $('.dt-button-collection')
                    .wrapInner('<ul class="dropdown-menu dropdown-light dropdown-caret dropdown-caret" />')
                    .find('a').attr('href', '#').wrap("<li />")
                }
                $('.dt-button-collection').appendTo('.tableTools-container .dt-buttons')
            }); 
            setTimeout(function() {
                $($('.tableTools-container')).find('a.dt-button').each(function() {
                    var div = $(this).find(' > div').first();
                    if(div.length == 1) div.tooltip({container: 'body', title: div.parent().text()});
                    else $(this).tooltip({container: 'body', title: $(this).text()});
                });
            }, 500); 
            myTable.on( 'select', function ( e, dt, type, index ) {
                if ( type === 'row' ) {
                    $( myTable.row( index ).node() ).find('input:checkbox').prop('checked', true);
                }
            } );
            myTable.on( 'deselect', function ( e, dt, type, index ) {
                if ( type === 'row' ) {
                    $( myTable.row( index ).node() ).find('input:checkbox').prop('checked', false);
                }
            } );
            $('th input[type=checkbox], td input[type=checkbox]').prop('checked', false);
            $('#usuarios-table > thead > tr > th input[type=checkbox], #usuarios-table_wrapper input[type=checkbox]').eq(0).on('click', function(){
                var th_checked = this.checked;//checkbox inside "TH" table header                
                $('#usuarios-table').find('tbody > tr').each(function(){
                    var row = this;
                    if(th_checked) myTable.row(row).select();
                    else  myTable.row(row).deselect();
                });
            });            
            //select/deselect a row when the checkbox is checked/unchecked
            $('#usuarios-table').on('click', 'td input[type=checkbox]' , function(){
                var row = $(this).closest('tr').get(0);
                if(this.checked) myTable.row(row).deselect();
                else myTable.row(row).select();
            });
            $(document).on('click', '#usuarios-table .dropdown-toggle', function(e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
            });

        $('#usuarios-table tbody').on('dblclick', 'tr', function (e) {               
            var data = myTable.row( this ).data();
            getData(data[0]);
            
        } );          
    }); 
});