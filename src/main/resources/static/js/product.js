var api = "http://localhost:9090/api/product" ;
var productTable;
var measurementUnit;
var productType = "";
var user;

function init(){
    initProductTable();
    getRole();

    console.log('inside init' );
    $("#measurementUnit").click( function () {
    var ele = document.getElementsByName('unit');
        for(i = 0; i < ele.length; i++) {
            if(ele[i].checked){
            measurementUnit = ele[i].value;
            }
        }
   });

   $("#productType").click( function () {
   var ele = document.getElementsByName('type');
       for(i = 0; i < ele.length; i++) {
           if(ele[i].checked){
           productType = ele[i].value;
           }
       }
  });

function getRole(){
    console.log('Inside getRole');
    $.get({
        url: "/api/getrole" ,
        dataType: "text",
        success: function(role){
            getProduct(role);
            //alert(role);
            user=role;
            console.log(role);

        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('Error: ' + textStatus);
        }
    });
}

    $("#create-product").click( function () {
        $("#id").val('');
        $("#productName").val('');
        $("#stockAmount").val('');
        $("#minumumLimit").val('');
        $("#supplier").val('');
        $("#brand").val('');
        $("#price").val('');
        $("#unitPrice").val('');
        $("#piece").attr('checked',false);
        $("#gram").attr('checked',false);
        $("#litre").attr('checked',false);
        $("#food").attr('checked',false);
        $("#drink").attr('checked',false);
        //$("#other").attr('checked',false);
        $('#productModal').modal('show');
    });
    $("#edit-product").click( function () {
        if (productTable.row($('.selected')).data() == undefined) {
            alert("You have to choose a product!");
        }else{
            var product = productTable.row($('.selected')).data();
            if(product.measurementUnit=="piece"){
                $("#piece").attr('checked','checked');
                measurementUnit="piece";
            }else if(product.measurementUnit=="gram"){
                $("#gram").attr('checked','checked');
                measurementUnit="gram";
            }else if(product.measurementUnit=="litre"){
                 $("#litre").attr('checked','checked');
                 measurementUnit="litre";
            }

            if(product.productType=="Food"){
                $("#food").attr('checked','checked');
                productType="food";
            }else if(product.productType=="Drink"){
                $("#drink").attr('checked','checked');
                productType="Drink";
            }/*else if(product.productType=="Other"){
                 $("#other").attr('checked','checked');
                 productType="other";
            }*/

            $("#id").val(product.id),
            $("#productName").val(product.productName),
            $("#stockAmount").val(product.stockAmount),
            $("#minumumLimit").val(product.minumumLimit),
            $("#supplier").val(product.supplier),
            $("#brand").val(product.brand),
            $("#price").val(product.price),
            $("#unitPrice").val(product.unitPrice),
            $('#productModal').modal('show');
        }
    });
    $("#delete-product").click( function () {
        if (productTable.row($('.selected')).data() == undefined) {
            alert("You have to choose a product!");
        }else{
            $('#productDeleteModal').modal('show');
        }
    });
    $("#deleteProductConfirmButton").click( function () {
        console.log("Inside click of deleteproductButton");
        deleteProduct();
        $('#personnelDeleteModal').modal('hide');
        });
    $("#productForm").submit( function(event) {
        console.log("required control");
        event.preventDefault();
        console.log("required control");
        if(user=="Chef" && productType=="Food"){
            console.log("user==Chef && productType==Food");
            createProduct();
        }/*else{
            toastr.info("You can save only food products!");
        }*/
        if(user=="Headwaiter" && productType=="Drink"){
            console.log("user==Headwaiter && productType==Drink");
            createProduct();
        }/*else{
            toastr.info("You can save only drink products!");
        }*/
        if(user=="Admin"){
            createProduct();
        }
    });


    //getProduct();
}

function initProductTable() {
    console.log('inside initUserTable' );
    columns = [
        { "title":  "Product ID",
            "data": "id" ,
            "visible": false },
        { "title":  "Product Name",
            "data": "productName" },
        { "title":  "Product Type",
            "data": "productType" },
        { "title":  "Brand",
            "data": "brand" },
        { "title":  "Price",
            "data": "price" },
        { "title":  "Unit Price",
            "data": "unitPrice" },
        { "title":  "Stock Amount",
            "data": "stockAmount" },
        { "title":  "Minumum Limit",
            "data": "minumumLimit"},
        { "title":  "Measurement Unit",
            "data": "measurementUnit"},
            { "title": "Supplier",
                "data": "supplier",
                        render: function(data,type,row){
                              var supplier = row.supplier;
                              if(row.stockAmount<row.minumumLimit){
                               return "<span style='color:red'>!!!     <a style='color:red' href="+supplier+" target=\"_blank\">"+supplier+"</a></span>";
                              } else {
                                return supplier;
                              }
                        }
                },
    ];

    // Define new table with above columns
    productTable = $("#productTable").DataTable( {
        //"order": [[ 0, "asc" ]],
        "ordering": false,
        "columns": columns
    });
     $("#productTable tbody").on( 'click', 'tr', function () {
            console.log("Clicking on row");
            if ( $(this).hasClass('selected') ) {
              $(this).removeClass('selected');
             }
            else {
                productTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        });
    }

function getProduct(role){
    var url="";
    if(role== "Admin"){
        url= api;
    }/*else{
    var url="http://localhost:9090/api/product/productType/"+productType;
    }*/
    console.log('inside getProduct' );
    if(role=="Chef"){
        url = api + "/productType/Food";
    }
    if(role=="Headwaiter"){
        url = api + "/productType/Drink";
    }
    console.log(role+"insede getproduct");
    console.log(url+"insede getproduct");
/*
    if(user=="Admin"){
        createProduct();
    }
*/

    $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        success: function(products){
            if (products) {
                productTable.clear();
                productTable.rows.add(products);
                productTable.columns.adjust().draw();
            }
        },
        fail: function (error) {
            console.log('Error: ' + error);
        }
    });
}
function deleteProduct(){
    if (productTable.row($('.selected')).data() == undefined) {
        alert("You have to select a product!");
    }else{
        var product = productTable.row($('.selected')).data();
        $.ajax({
            url: api + '/' + product.id,
            type: "delete",
            contentType: "application/json",
            dataType: "text",  // get back from frontend
            success: function(message){
                console.log(message);
                getRole();
                //getProduct();
            },
            fail: function (error) {
              console.log('Error: ' + error);
            },
        });
    }
}
function createProduct(){
    console.log('inside createProduct' );
    var productData = {
        id: $("#id").val(),
        productName: $("#productName").val(),
        stockAmount: $("#stockAmount").val(),
        minumumLimit: $("#minumumLimit").val(),
        brand: $("#brand").val(),
        price: $("#price").val(),
        unitPrice: $("#unitPrice").val(),
        measurementUnit: measurementUnit,
        productType: productType,
        supplier: $("#supplier").val()
    }
    console.log("ajavtan once");
    var productJson = JSON.stringify(productData);
    $.ajax({
        url: api,
        type: "post",
        data: productJson,    // json for request body
        dataType: "json", //get back from fronted
        contentType: "application/json; charset=utf-8", // What we send to frontend
        success: function(product, textStatus, jqXHR){
            console.log(product);
            $('#productModal').modal('hide');
            getRole();
            //getProduct();
            },
            done: function(xhr,status,error){
                console.log('Text Status:' + status);
            },
            error: function(xhr,status,error){
                console.log('Text Status:' + status);
                console.log("error "+xhr.error);
            },
            fail: function (error) {
                console.log('Text Status:' + status);
            },
    });

}

