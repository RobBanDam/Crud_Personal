let tabla; 

function init(){
    $("#producto_form").on("submit", function(e){
        guardaryeditar(e);
    })
}

$(document).ready(function(){
    $('#catid').select2({
        dropdownParent: $("#modalmantenimiento")
    });

    // Realiza la llamada AJAX para obtener las categorías
    $.post("../../controller/categoria.php?op=combo", function(data){
        $("#catid").html(data);
        });

    tabla=$('#producto_data').dataTable({
        "aProcessing": true,
        "aServerSide": true,
        dom: 'Bfrtip',

        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdf'
        ],

        "ajax": {
            url: '../../controller/producto.php?op=listar',
            type: "get",
            dataType: "json",
            error: function(e){
                console.log(e.responseText);
            }
        },

        "bDestroy": true,
        "responsive": true,
        "bInfo": true,
        "iDisplayLength": 10,
        "order": [[0, "asc"]],
        "language": {
            "sProcessing":      "Procesando...",
            "sLengthMenu":      "Mostrar _MENU_ registros",
            "sZeroRecords":     "No se encontraron resultados",
            "sEmptyTable":      "Ningún dato disponible en esta tabla",
            "sInfo":            "Mostrando un total de _TOTAL_ registros",
            "sInfoEmpty":       "Mostrando un total de 0 registros",
            "sInfoFiltered":    "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix":     "",
            "sSearch":          "Buscar:",
            "sUrl":             "",
            "sInfoThousands":   ",",
            "sLoadingRecords":  "Cargando...",
            "oPaginate": {
                "sFirst":       "Primero",
                "sLast":        "Último",
                "sNext":        "Siguiente",
                "sPrevious":    "Anterior"
            },
            "oAria": {
                "sSortAscending":   ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending":   ": Activar para ordenar la columna de manera descendente"
            }
        }
    }).DataTable();
});

function guardaryeditar(e){
    e.preventDefault();
    let formData = new FormData($("#producto_form")[0]);

    $.ajax({
        url: "../../controller/producto.php?op=guardaryeditar",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function(datos){
            $('#producto_form')[0].reset();
            $("#modalmantenimiento").modal('hide');
            $('#producto_data').DataTable().ajax.reload();

            swal.fire(
                "Registrado",
                "Se ha realizado con éxito",
                "success"
            )
        }
    });
}

function editar(prodid){
    $('#mdltitulo').html('Editar registro');
    $.post("../../controller/producto.php?op=mostrar", {prodid:prodid}, function(data){
        data = JSON.parse(data);
        $('#prodid').val(data.prodid);
        $('#catid').val(data.catid).trigger('change');
        $('#prodnom').val(data.prodnom);
        $('#proddesc').val(data.proddesc);
        $('#prodcant').val(data.prodcant);
    });

    $('#modalmantenimiento').modal('show');
}

function eliminar(prodid){
    swal.fire({
        title: "CRUD",
        text: "¿Está seguro de eliminar el registro?",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            
            $.post("../../controller/producto.php?op=eliminar", {prodid:prodid}, function(data){ 

            });

            $('#producto_data').DataTable().ajax.reload();
            
            swal.fire(
                "Eliminado",
                "El registro se elimino correctamente",
                "success"
            )
        }
    })
}

$(document).on("click", "#btnnuevo", function(){
    $('#prodid').val('');
    $('#catid').val('').trigger('change');
    $('#prodnom').val('');
    $('#proddesc').val('');
    $('#prodcant').val('');
    $('#mdltitulo').html('Nuevo Registro');
    $('#modalmantenimiento').modal('show');
});

init();