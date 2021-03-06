app.controller("nroDocumentoController", function ($scope, $state, $http, AuthenticationService,cargarMenuService, undefinedService){	
	var token;
    var formdata = new FormData();            
	if (localStorage['token']){
    	token = JSON.parse(localStorage['token']);
	} else {
		token = "No Autorizado";
	}
	AuthenticationService.checkToken(token);
    cargarMenuService.cargaMenu($state.current.name, token.data);        
    $scope.buttonText = "Modificar Datos";   
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
    $scope.ventanaBusqueda = function(){
        $('#modal-table').modal('show');        
    }   
    $scope.submitForm = function(){         
        if ($scope.formNroDocumento.$valid) {
            var data = $.param({
                nro_factura: undefinedService.undefinedFunction($scope.nroDocumento.txt_2),
                nro_nota_debito: undefinedService.undefinedFunction($scope.nroDocumento.txt_4),
                nro_nota_credito: undefinedService.undefinedFunction($scope.nroDocumento.txt_6),
                nro_retencion: undefinedService.undefinedFunction($scope.nroDocumento.txt_8),
                nro_guia: undefinedService.undefinedFunction($scope.nroDocumento.txt_10),
                nro_factura_lote: undefinedService.undefinedFunction($scope.nroDocumento.txt_3),
                nro_nota_debito_lote: undefinedService.undefinedFunction($scope.nroDocumento.txt_5),
                nro_nota_credito_lote: undefinedService.undefinedFunction($scope.nroDocumento.txt_7),
                nro_retencion_lote: undefinedService.undefinedFunction($scope.nroDocumento.txt_9),
                nro_guia_lote: undefinedService.undefinedFunction($scope.nroDocumento.txt_11),
                id : undefinedService.undefinedFunction($scope.nroDocumento.txt_id),
                verificador : undefinedService.undefinedFunction($scope.nroDocumento.txt_verificador),
                tipo : $scope.buttonText,
            }); 
            
            $http({
                url: 'data/parametros/nroDocumento/app.php',
                method: "POST",
                data: data,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }                   
            })
            .then(function(response) {                                  
                if(response.data == 1){
                    $scope.nroDocumento = {};
                    $scope.formNroDocumento.$setPristine();
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
            }, 
            function(response) {});
        }else{
            
        }
    };
    $scope.atras = function(){
        var id = 0;
        if($scope.formNroDocumento.txt_id.$viewValue){
            id = $scope.formNroDocumento.txt_id.$viewValue;
        }else{
            id = 0;
        }
        $http({
            url: 'data/parametros/nroDocumento/app.php',
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
            url: 'data/parametros/nroDocumento/app.php',
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
        if($scope.formNroDocumento.txt_id.$viewValue){
            id = $scope.formNroDocumento.txt_id.$viewValue;
        }else{
            id = 0;
        }
        $http({
            url: 'data/parametros/nroDocumento/app.php',
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
            url: 'data/parametros/nroDocumento/app.php',
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
            url: 'data/parametros/nroDocumento/app.php',
            method: "POST",
            data: "tipo=" + "Cargar Datos"+"&id="+id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then(function(response) {  
            $("#loading2").css("display","none");   
            if(response['statusText'] == 'OK'){                
                $scope.nroDocumento = {
                    txt_id : response['data'][0],                    
                    txt_1 : (response['data'][1] + ' - ' + response['data'][2] + ' - ' + response['data'][3] + ' - ' + response['data'][4]),
                    txt_12 : response['data'][5],
                    txt_2 : response['data'][6], 
                    txt_4 : response['data'][7], 
                    txt_6 : response['data'][8], 
                    txt_8 : response['data'][9], 
                    txt_10 : response['data'][10],                     
                    txt_3 : response['data'][11], 
                    txt_5 : response['data'][12], 
                    txt_7 : response['data'][13], 
                    txt_9 : response['data'][14], 
                    txt_11 : response['data'][15], 
                    txt_verificador : response['data'][16], 
                }                               
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
        var myTable = 
            $('#documento-table')
            //.wrap("<div class='dataTables_borderWrap' />")   //if you are applying horizontal scrolling (sScrollX)
            .DataTable( {
                bAutoWidth: false,
                "aoColumns": [
                  {"id":null},                  
                  {"punto_emision":null}, 
                  {"establecimiento":null}, 
                  {"nombre_comnerciañ":null}, 
                  {"ciudad":null}, 
                  {"nombre":null}, 
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
                    "url": "data/parametros/nroDocumento/app.php",
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
            $('#documento-table > thead > tr > th input[type=checkbox], #documento-table_wrapper input[type=checkbox]').eq(0).on('click', function(){
                var th_checked = this.checked;//checkbox inside "TH" table header                
                $('#documento-table').find('tbody > tr').each(function(){
                    var row = this;
                    if(th_checked) myTable.row(row).select();
                    else  myTable.row(row).deselect();
                });
            });            
            //select/deselect a row when the checkbox is checked/unchecked
            $('#documento-table').on('click', 'td input[type=checkbox]' , function(){
                var row = $(this).closest('tr').get(0);
                if(this.checked) myTable.row(row).deselect();
                else myTable.row(row).select();
            });
            $(document).on('click', '#documento-table .dropdown-toggle', function(e) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                e.preventDefault();
            });

        $('#documento-table tbody').on('dblclick', 'tr', function (e) {               
            var data = myTable.row( this ).data();
            getData(data[0]);
            
        } );                 
    }); 
});	