var api = "http://localhost:9090/api/tableRestaurant";
var tableTables;
var emptyTable;

function init(){
    console.log('inside init');

    $(".date").datepicker({
        firstDay: 1,
        minDate: new Date(),
        dateFormat: 'yy-mm-dd'
    });

    $('.time').timepicker({
        timeFormat: 'HH:mm',
        interval: 30,
        show2400: true,
        minTime: '10:00',
        maxTime: '22:00',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        zindex: 9999999
    });

//    $("#isEmptyTable").click( function () {
//        emptyTable = document.getElementById('isEmptyTable');
//        emptyTable.value = emptyTable.checked;
//    });

    $("#newTableButton").click(function () {
        console.log("Inside click of newTableButton");
        $("#id").val('');
        $("#tableNumber").val('');
        $("#tableSize").val('');
        /*$("#tableReserveStartDate").val('');
        $("#tableReserveStartTime").val('');
        $("#tableReserveEndTime").val('');*/
        $('#tableModal').modal('show');
    });

    $("#editTableButton").click( function () {
        console.log("Inside click of editTableButton");
        if (tableTables.row($('.selected')).data() == undefined) {
            alert("Select table first");
        } else {
            var table = tableTables.row($('.selected')).data();
            $("#id").val(table.id);
            $("#tableNumber").val(table.tableNumber);
            $("#tableSize").val(table.tableSize);
//            $("#isEmptyTable").attr('checked', table.emptyTable);
            /*$("#tableReserveStartDate").val(table.tableReserveStartDate);
            $("#tableReserveStartTime").val(table.tableReserveStartTime);
            $("#tableReserveEndTime").val(table.tableReserveEndTime);*/
            $('#tableModal').modal('show');
        }
    });

    $("#deleteTableButton").click( function () {
        console.log("Inside click of deleteTableButton");
        if (tableTables.row($('.selected')).data() == undefined) {
            alert("Select table first");
        } else {
            deleteTable();
        }
    });

    // Add submit event to form for new and edit
    $("#tableForm").on('submit', function() {
        console.log("Submitting");
        createTable();

    });

    initTableTables();
    getTablesData();
}

function initTableTables() {
    console.log('inside initTableTables' );
    // Create columns (with titles) for datatable: id, name, address, age
    columns = [
        { "title":  "Table ID",
            "data": "id",
             "visible": false},
        { "title":  "Table No",
            "data": "tableNumber" },
        { "title":  "Table Size",
            "data": "tableSize" }
//        { "title":  "Is Empty",
//            "data": "emptyTable",
//            render: function(data, type, row){
//                        if(data === true) {
//                            return '<span>Yes</span>';
//                        } else {
//                            return '<span>No</span>';
//                        }
//                    }
//        }
/*
        { "title": "Reserve Date",
                    "data": "tableReserveStartDate"},
        { "title": "Start Time",
            "data": "tableReserveStartTime"},
        { "title": "End Time",
            "data": "tableReserveEndTime"}
*/
    ];


    // Define new table with above columns
    tableTables = $("#tableTables").DataTable( {
        "order": [[ 0, "asc" ]],
        "columns": columns
    });

    $("#tableTables tbody").on( 'click', 'tr', function () {
        console.log("Clicking on row");
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        } else {
            tableTables.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });
}

function getTablesData(){
    console.log('inside getTablesData' );
    $.ajax({
        url: api,
        type: "get",
        dataType: "json",
        success: function(tables){
            if (tables) {
                tableTables.clear();
                tableTables.rows.add(tables);
                tableTables.columns.adjust().draw();
            }
        },
        fail: function (error) {
            console.log('Error: ' + error);
        }
    });
}

function createTable(){
    console.log('inside createTable' );
    //alert("inside");
    var tableData = {
        id: $("#id").val(),
        tableNumber: $("#tableNumber").val(),
        tableSize: $("#tableSize").val()
//        emptyTable: $("#isEmptyTable").val()
/*        tableReserveStartDate: $("#tableReserveStartDate").val(),
        tableReserveStartTime: $("#tableReserveStartTime").val(),
        tableReserveEndTime: $("#tableReserveEndTime").val()*/
    }

    var tableJson = JSON.stringify(tableData);
    $.ajax({
        url: api,
        type: "post",
        data: tableJson,
        contentType:"application/json; charset=utf-8",
        dataType: "json",
        success: function(table, textStatus, jqXHR) {
            console.log(table);
            //alert("inside succes");
            // Clear fields in page
            $("#id").val('');
            $("#tableNumber").val('');
            $("#tableSize").val('');
//            $("#isEmptyTable").val('');
/*            $("#tableReserveStartDate").val(),
            $("#tableReserveStartTime").val('');
            $("#tableReserveEndTime").val('');*/
            $('#tableModal').modal('hide');
            getTablesData();
        },
        error: function(xhr,status,error){
            responseText = jQuery.parseJSON(xhr.responseText);
            alert(responseText.message);
            console.log('Text Status:' + status);
            console.log(' - message: ' + responseText.message);

            //toastr.info(responseText.message);
        },
        fail: function (error) {
            //alert("inside fail");
            console.log('Error: ' + error);
        }
    });
}

function deleteTable(){
    if (tableTables.row($('.selected')).data() == undefined) {
        alert("Select table first");
    }else{
        var table = tableTables.row($('.selected')).data();
        console.log(api + '/' + table.id);
        $.ajax({
            url: api + '/' + table.id,
            type: "delete",
            contentType: "application/json",
            dataType: "text",
            success: function(message){
              console.log(message);
              getTablesData();
            },
            fail: function (error) {
              console.log('Error: ' + error);
            }
        });
    }
}