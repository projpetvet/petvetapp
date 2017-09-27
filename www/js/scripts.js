document.addEventListener('init', function(event) {
    
    $(".open-refine-search").click(function(){
        $("#refine-search").show();
        if(sp.isset('refine_search'))
        {
            $("#search_product").val(sp.get('refine_search'));
        }
        RenderProductCategories();
    });
    
    $("#refine-search-btn").unbind().click(function(){
        sp.set('refine_search',$("#search_product").val());
        sp.set('refine_category',$("#product-category").val());
        $("#refine-search").hide();
        LoadProducts();
    });

    $(".submit-signup").click(function(){
        SignUp();
    });
    
    $(".update-profile").click(function(){
        UpdateProfile();
    });
    
    $(".signin").unbind().click(function(){
        var username = $('#username').val();
        var password = $('#password').val();
        if(username.trim() == '')
        {
            ons.notification.alert('Invalid username.');
        }
        else if(password.trim() == '')
        {
            ons.notification.alert('Invalid password.');
        }
        else
        {
            Signin(username,password);
        }
    });
    
    $("#product-detail-page").on("click",".add-to-cart",function(){
       var id = $(this).attr('data-id');
       ons.notification.prompt({
            message: 'How many?',
            callback: function(quantity) {
                if(isNaN(parseInt(quantity)))
                {
                    ons.notification.confirm({
                        title : "Ooppss...",
                        message: 'Please enter a number only!',
                        buttonLabels : ["Cancel", "Enter Again"],
                        callback: function(answer) {
                          // Do something here.
                            if(answer == 1)
                            {
                                $("#product-detail-page .add-to-cart").trigger("click");
                            }
                        }
                    });
                }
                else if(quantity < 1)
                {
                    ons.notification.confirm({
                        title : "Ooppss...",
                        message: 'Invalid quantity!',
                        buttonLabels : ["Cancel", "Enter Again"],
                        callback: function(answer) {
                          // Do something here.
                            if(answer == 1)
                            {
                                $("#product-detail-page .add-to-cart").trigger("click");
                            }
                        }
                    });
                }
                else
                {
                    $.ajax({
                        url : config.url+'/IsStockSufficient',
                        method : "POST",
                        data : {
                            id :id,
                            quantity :quantity
                        },
                        dataType : "json",
                        beforeSend : function(){
                        },
                        success : function(data){
                            if(data.success)
                            {
                                if(data.sufficient)
                                {
                                    AddToCart(id,quantity);
                                }
                                else
                                {
                                    ons.notification.confirm({
                                        title : "Ooppss...",
                                        message: 'Insufficient stocks!',
                                        buttonLabels : ["Cancel", "Enter Again"],
                                        callback: function(answer) {
                                          // Do something here.
                                            if(answer == 1)
                                            {
                                                $("#product-detail-page .add-to-cart").trigger("click");
                                            }
                                        }
                                    });
                                }
                                
                                $(".product-stocks").html("Stocks: "+data.current_stock);
                            }
                            else
                            {
                                ons.notification.alert(data.message);
                            }
                        },
                        error : function(){
                            ons.notification.alert("Error connecting to server.");
                        }
                    });
                }
            }
        });
    });
    
    $("#product-detail-page").on("click",".remove-from-cart",function(){
        var index = $(this).attr('data-index');
        var id = $(this).attr('data-id');
        ons.notification.confirm({
            message: 'Are you sure you want to remove this product?',
            callback: function(answer) {
                if(answer == 1)
                {
                    RemoveFromCart(index,id);
                }
            }
        });
    });
    
    $(".submit-checkout").click(function(){
        SubmitCheckout();
    });
    
    $("#schedule-page").on("click", ".add-appointment", function(){
        myNavigator.pushPage('request-schedule', { animation : 'lift' });
    });
    
    $(".submit-appointment").unbind().click(function(){
       SubmitAppointment(); 
    });
    
    $("#schedule-page").on("click", ".app-item", function(){
        var app_id = $(this).attr("data-id");
        sp.set("current_app_id",app_id);
        myNavigator.pushPage('request-schedule-detail', { animation : 'lift' });
    });
    
    $("#my-pet-detail-page").on("click", ".app-item", function(){
        var app_id = $(this).attr("data-id");
        sp.set("current_app_id",app_id);
        myNavigator.pushPage('request-schedule-detail', { animation : 'lift' });
    });
    
    $("#add-pet-page").on("change", "#pet_specie", function(){
        var specie = $(this).val();
        if(specie == '')
        {
            $(".pet_breed_selection").html('');
        }
        else
        {
            RenderBreed(specie);
        }
    });
    
    $("#add-pet-page").on("click","#save-pet",function(){
        var name = $("#pet_name").val();
        var specie = $("#pet_specie").val();
        var breed = $("#pet_breed").val();
        var gender = $("#pet_gender").val();
        var color = $("#pet_color").val();
        var birthday = $("#pet_birthday").val();
        if(name.trim() == '')
        {
            ons.notification.alert("Please fill-out pet name.");
        }
        else if(specie.trim() == '')
        {
            ons.notification.alert("Please fill-out specie.");
        }
        else if(breed.trim() == '')
        {
            ons.notification.alert("Please fill-out breed.");
        }
        else if(gender.trim() == '')
        {
            ons.notification.alert("Please fill-out gender.");
        }
        else if(color.trim() == '')
        {
            ons.notification.alert("Please fill-out color.");
        }
        else if(birthday.trim() == '')
        {
            ons.notification.alert("Please fill-out birthday.");
        }
        else
        {
            var data = {
                name : name,
                specie : specie,
                breed : breed,
                gender : gender,
                color : color,
                birthday : birthday,
                customer : sp.get('user_id')
            };
            
            SavePet(data);
        }
    });
    
    $("#services-selection").on("click",".service-checkbox",function(){
        var id = $(this).val();
        $('.service-checkbox').each(function(){
            var val_id = $(this).val();
            if(id != val_id)
            {
                $(this).prop("checked",false);
            }
        });
    });
    
    $("#app_date").change(function(){
        var sched = $(this).val();
        RenderAppTime(sched);
    });
    
});

var SignUp = function()
{
    var lastname = $("#lastname").val();
    var firstname = $("#firstname").val();
    var address = $("#address").val();
    var mobile = $("#mobile").val();
    var email = $("#email").val();
    var username = $("#signup_username").val();
    var password = $("#signup_password").val();
    var cpassword = $("#confirmpassword").val();
    
    if(lastname.trim() == '')
    {
        ons.notification.alert("Please fill-out last name.");
    }
    else if(firstname.trim() == '')
    {
        ons.notification.alert("Please fill-out first name.");
    }
    else if(address.trim() == '')
    {
        ons.notification.alert("Please fill-out address.");
    }
    else if(mobile.trim() == '')
    {
        ons.notification.alert("Please fill-out mobile.");
    }
    else if((email.trim() != '') && !validateEmail(email))
    {
        ons.notification.alert("Please fill-out email correctly.");
    }
    else if(username.trim() == '')
    {
        ons.notification.alert("Please fill-out username.");
    }
    else if(password.trim() == '')
    {
        ons.notification.alert("Please fill-out password.");
    }
    else if(password.trim().length < 6)
    {
        ons.notification.alert("Please fill-out password with atleast 6 characters.");
    }
    else if(password != cpassword)
    {
        ons.notification.alert("Password and Confirm password do not match.");
    }
    else
    {
        var data = {
            lastname : lastname,
            firstname : firstname,
            address : address,
            mobile : mobile,
            email : email,
            username : username,
            password : password
        };
        
        Register(data);
    }
};

var UpdateProfile = function()
{
    var lastname = $("#lastname").val();
    var firstname = $("#firstname").val();
    var address = $("#address").val();
    var mobile = $("#mobile").val();
    var email = $("#email").val();
    var username = $("#edit_username").val();
    var password = $("#edit_password").val();
    var cpassword = $("#confirmpassword").val();
    
    if(lastname.trim() == '')
    {
        ons.notification.alert("Please fill-out last name.");
    }
    else if(firstname.trim() == '')
    {
        ons.notification.alert("Please fill-out first name.");
    }
    else if(address.trim() == '')
    {
        ons.notification.alert("Please fill-out address.");
    }
    else if(mobile.trim() == '')
    {
        ons.notification.alert("Please fill-out mobile.");
    }
    else if((email.trim() != '') && !validateEmail(email))
    {
        ons.notification.alert("Please fill-out email correctly.");
    }
    else if(username.trim() == '')
    {
        ons.notification.alert("Please fill-out username.");
    }
    else if(password != cpassword)
    {
        ons.notification.alert("Password and Confirm password do not match.");
    }
    else
    {
        var data = {
            lastname : lastname,
            firstname : firstname,
            address : address,
            mobile : mobile,
            email : email,
            username : username,
            password : password,
            id : sp.get('user_id')
        };
        
        SaveProfile(data);
    }
};

var validateEmail =  function(email) 
{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

var Register = function(data)
{
    $.ajax({
        url : config.url+'/Register',
        method : "POST",
        data : data,
        dataType : "json",
        beforeSend : function(){
            loader();
        },
        success : function(data){
            if(data.success)
            {
                ons.notification.alert({
                    title : "Success",
                    message : "Please wait for your account verification code that will be sent on your registered mobile number."
                });
                
                myNavigator.popPage({ animation : 'lift' });
            }
            else
            {
                ons.notification.alert(data.message);
            }
            dismissLoader();
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
            dismissLoader();
        }
    });
};

var SaveProfile = function(data)
{
    $.ajax({
        url : config.url+'/UpdateProfile',
        method : "POST",
        data : data,
        dataType : "json",
        beforeSend : function(){
            loader();
        },
        success : function(data){
            if(data.success)
            {
                window.location.href = "main.html";
            }
            else
            {
                ons.notification.alert(data.message);
            }
            dismissLoader();
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
            dismissLoader();
        }
    });
};

var loader = function()
{
    $('.loader').show();
};

var dismissLoader = function()
{
    $('.loader').hide();
};

var Signin = function(username,password)
{
    $.ajax({
        url : config.url+'/signin',
        method : "POST",
        data : {
            username : username,
            password : password
        },
        dataType : "json",
        beforeSend : function(){
            loader();
        },
        success : function(data){
            if(data.success)
            {
                if((data.info.enabled == 1) && (data.info.is_verified == 1))
                {
                    sp.set('user_id',data.id);
                    sp.set('handler','index');
                    window.location.href = "handler.html";
                }
                else if(data.info.is_verified == 0)
                {
                    ons.notification.prompt({
                        title : "Verify Account",
                        messageHTML: 'Please enter verification code:<br><a style="color:#3498db;" onclick="resendVerificationCode('+data.id+')">Resend Verification Code</a>',
                        callback: function(code) 
                        {
                            if((code == data.info.web_code) && (data.info.web_code_valid == 1)) 
                            {
                                $.ajax({
                                    url : config.url+'/VerifyAccount',
                                    method : "POST",
                                    data : {
                                        id : data.id
                                    },
                                    dataType : "json",
                                    beforeSend : function(){
                                        loader();
                                    },
                                    success : function(data){
                                        if(data.success)
                                        {
                                            sp.set('user_id',data.id);
                                            sp.set('handler','index');
                                            window.location.href = "handler.html";
                                        }
                                        dismissLoader();
                                    },
                                    error : function(){
                                        ons.notification.alert("Error connecting to server.");
                                        dismissLoader();
                                    }
                                });
                            }
                            else
                            {
                                ons.notification.confirm({
                                    title : "Ooppss...",
                                    message: 'Invalid verification code!',
                                    buttonLabels : ["Cancel", "Resend Code"],
                                    callback: function(answer) {
                                      // Do something here.
                                        if(answer == 1)
                                        {
                                            resendVerificationCode(data.id);
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
            else
            {
                ons.notification.alert(data.message);
            }
            dismissLoader();
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
            dismissLoader();
        }
    });
};

var SignInWebUser = function(web_code)
{
    $.ajax({
        url : config.url+'/signInWebUser',
        method : "POST",
        data : {
            web_code : web_code
        },
        dataType : "json",
        beforeSend : function(){
            loader();
        },
        success : function(data){
            if(data.success)
            {
                sp.set('user_id',data.id);
                sp.set('handler','index');
                window.location.href = "handler.html";
            }
            else
            {
                ons.notification.alert(data.message);
            }
            dismissLoader();
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
            dismissLoader();
        }
    });
};

var LoadCustomerData = function(id)
{
    $.ajax({
        url : config.url+'/GetCustomerById',
        method : "POST",
        data : {
            id : id
        },
        dataType : "json",
        beforeSend : function(){
            loader();
        },
        success : function(data){
            if(data.success)
            {
                sp.init("customer",{
                    info : data.info
                });
                $("#list-lastname").html(data.info.lastname);
                $("#list-firstname").html(data.info.firstname);
                $("#list-address").html(data.info.address);
                $("#list-mobile").html(data.info.mobile);
                $("#list-email").html(data.info.email);
                $("#list-username").html(data.info.username);
            }
            else
            {
                ons.notification.alert(data.message);
            }
            dismissLoader();
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
            dismissLoader();
        }
    });
};

var LoadProducts = function()
{
    if(sp.isset('refine_search'))
    {
        $("#current-search").show();
        $("#current-search").html("Search: <i>"+sp.get("refine_search")+"</i>")
        var search = sp.get("refine_search");
    }
    else
    {
        $("#current-search").hide();
        var search = '';
    }
    
    if(sp.isset('refine_category'))
    {
        var category = sp.get("refine_category");
    }
    else
    {
        var category = '';
    }
    
    $.ajax({
        url : config.url+'/GetProducts',
        method : "POST",
        data : {
            search : search,
            category : category
        },
        dataType : "json",
        beforeSend : function(){
            loader();
        },
        success : function(data){
            if(data.success)
            {
                console.log(data);
                sp.set("products_loaded","true");
                PRODUCT_LIST = data.list;
                $("#shopping-page .page__content .product-views").html("");
                var ctr = 0;
                $.each(data.list,function(key,value){
                    value.key = key;
                    if(value.image == '')
                    {
                        value.image = 'img/placeholder.png';
                    }
                    else
                    {
                        value.image = config.productUrl + value.image;
                    }
                    
                    var productView = mvc.LoadView('Products/ProductItem',value);
                    //console.log(productView);
                    $("#shopping-page .page__content .product-views").append(productView);
                    ctr++;
                });
                
                if(ctr == 0)
                {
                    $("#shopping-page .page__content .product-views").html("<p align='center'><i>No products found...</i></p>");
                }
            }
            else
            {
                ons.notification.alert(data.message);
            }
            dismissLoader();
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
            dismissLoader();
        }
    });
};

var LoadProductDetail = function(key)
{
    sp.set('current_product',key);
    myNavigator.pushPage('productdetail', { animation : 'lift' });
};

var RenderProductDetailPage = function()
{
    var key = sp.get('current_product');
    var data = PRODUCT_LIST[key];
    if(sp.isset('cart'))
    {
        var sessionData = sp.getData("cart");
        var prod_index = sessionData.list.map(function(field)
        {
            if((field !== null))
            {
                return field.id;
            }

        }).indexOf(data['id']);
        if(prod_index > -1)
        {
            data['index'] = prod_index;
            data['action'] = mvc.LoadView('Products/RemoveFromCart',data);
        }
        else
        {
            data['action'] = mvc.LoadView('Products/AddToCart',data);
        }
    }
    else
    {
        data['action'] = mvc.LoadView('Products/AddToCart',data);
    }
    
    $("#product-detail-page .page__content .pd-data").html(mvc.LoadView('Products/ProductDetails',data));
};

var AddToCart = function(id,quantity)
{
    if(!sp.isset("cart"))
    {
        sp.init("cart",{
           list : [],
           total : 0.0
        });
    }
    
    sp.pushToKey("cart","list",{
        id : id,
        quantity : quantity,
        comment : ""
    });
    
    var sessionData = sp.getData("cart");
    var prod_index = sessionData.list.map(function(field)
    {
        if((field !== null))
        {
            return field.id;
        }

    }).indexOf(id);
    
    $("#product-detail-page .add-to-cart").remove();
    
    var data = {
        id : id,
        index : prod_index
    };
    $("#product-detail-page .page__content .pd-data").append(mvc.LoadView('Products/RemoveFromCart',data));
    
    ons.notification.alert("Product successfully added to cart.");
};

var RemoveFromCart = function(index,id)
{
    sp.removeFieldKey("cart","list",index);
    $("#product-detail-page .remove-from-cart").remove();
    var data = {
        id : id
    };
    $("#product-detail-page .page__content .pd-data").append(mvc.LoadView('Products/AddToCart',data));
};

var RenderCartPage = function()
{
    if(sp.isset("cart"))
    {
        var sessionData = sp.getData("cart");
        var ids = '';
        var ctr = 0;
        var list_key = [];
        $.each(sessionData.list,function(key,value){
            if(ctr == 0)
            {
                ids += value.id;
            }
            else
            {
                ids += ","+value.id;
            }
            list_key[value.id] = key;
            ctr++;
        });
        
        $.ajax({
            url : config.url+'/GetProductsByIdList',
            method : "POST",
            data : {
                ids : ids
            },
            dataType : "json",
            beforeSend : function(){
                loader();
            },
            success : function(data){
                if(data.success)
                {
                    var total = 0;
                    $("#cart-page .page__content").html("");
                    $.each(data.list,function(key,value){
                        value.key = key;
                        var index = list_key[value.id];
                        value['quantity'] = sessionData.list[index]['quantity'];
                        total += value['quantity'] * value['price'];
                        value['subtotal'] = (value['quantity'] * value['price']).toFixed(2);
                        var cartView = mvc.LoadView('Cart/CartItem',value);
                        $("#cart-page .page__content").append(cartView);
                    });
                    
                    var data_total = {
                        total : total.toFixed(2)
                    };
                    
                    sp.setKey("cart","total",total.toFixed(2));
                    
                    var cartTotalView = mvc.LoadView('Cart/CartTotal',data_total);
                    $("#cart-page .page__content").append(cartTotalView);
                }
                else
                {
                    ons.notification.alert(data.message);
                }
                dismissLoader();
            },
            error : function(){
                ons.notification.alert("Error connecting to server.");
                dismissLoader();
            }
        });
    }
    else
    {
        $("#cart-page .page__content").html("<center><br>No items found..</center>");
    }
};

var RenderCheckoutPage = function()
{
    var customer = sp.getKey('customer','info');
    var total = sp.getKey('cart','total');
    $("#billing_name").val(customer.firstname+" "+customer.lastname);
    $("#billing_address").val(customer.address);
    $("#billing_mobile").val(customer.mobile);
    $("#billing_email").val(customer.email);
    $("#checkout-total").html("Php "+total);
};

var SubmitCheckout = function()
{
    var name = $("#billing_name").val();
    var address = $("#billing_address").val();
    var mobile = $("#billing_mobile").val();
    var email = $("#billing_email").val();
    var note = $("#billing_note").val();
    if(name.trim() == '')
    {
        ons.notification.alert("Please fill-out full name");
    }
    else if(address.trim() == '')
    {
        ons.notification.alert("Please fill-out address");
    }
    else if(mobile.trim() == '')
    {
        ons.notification.alert("Please fill-out mobile");
    }
    else if(email.trim() == '')
    {
        ons.notification.alert("Please fill-out email");
    }
    else if(!validateEmail(email))
    {
        ons.notification.alert("Please fill-out email correctly.");
    }
    else
    {
        var order = {
            customer_id : sp.get("user_id"),
            name : name,
            address : address,
            mobile : mobile,
            email : email,
            note : note,
            order_line : JSON.stringify(sp.getKey('cart','list'))
        };
        
        $.ajax({
            url : config.url+'/Checkout',
            method : "POST",
            data : order,
            dataType : "json",
            beforeSend : function(){
                loader();
            },
            success : function(data){
                if(data.success)
                {
                    $("#checkout-successful").show();
                    sp.unset('cart');
                }
                else
                {
                    ons.notification.alert(data.message);
                }
                dismissLoader();
            },
            error : function(){
                ons.notification.alert("Error connecting to server.");
                dismissLoader();
            }
        });
    }
};

var logout = function()
{
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "index.html";
};

var RenderOrderHistoryPage = function()
{
    $.ajax({
            url : config.url+'/GetOrderHistory',
            method : "POST",
            data : {
                customer_id : sp.get("user_id")
            },
            dataType : "json",
            beforeSend : function(){
                loader();
            },
            success : function(data){
                if(data.success)
                {
                    $("#cart-page .page__content").html("");
                    $.each(data.list,function(key,value){
                        if(value.status == 'Pending')
                        {
                            listView = mvc.LoadView('Order/OrderItemTappable',value);
                        }
                        else
                        {
                            listView = mvc.LoadView('Order/OrderItem',value);
                        }
                        $("#order-history-page .page__content #order-history-list").append(listView);
                    });
                }
                else
                {
                    ons.notification.alert(data.message);
                }
                dismissLoader();
            },
            error : function(){
                ons.notification.alert("Error connecting to server.");
                dismissLoader();
            }
        });
};

var RenderMyPetsPage = function()
{
    $.ajax({
            url : config.url+'/GetMyPets',
            method : "POST",
            data : {
                customer_id : sp.get("user_id")
            },
            dataType : "json",
            beforeSend : function(){
                loader();
            },
            success : function(data){
                if(data.success)
                {
                    if(data.list.length > 0)
                    {
                        MY_PET_LIST = data.list;
                        var ListView  = '';
                        $.each(data.list,function(key,value){
                            value.key = key;
                            ListView += mvc.LoadView('Pet/PetItem',value);
                        });
                        
                        $("#my-pets-list").html(ListView);
                    }
                    else
                    {
                        $("#my-pets-list").html("<p><center><i>No pets found...</i></center></p>");
                    }
                }
                else
                {
                    ons.notification.alert(data.message);
                }
                dismissLoader();
            },
            error : function(){
                ons.notification.alert("Error connecting to server.");
                dismissLoader();
            }
        });
};

var RenderSetAppointmentPage = function()
{
    $.ajax({
        url : config.url+'/GetDataForAppointment',
        method : "POST",
        data : {
            customer_id : sp.get("user_id")
        },
        dataType : "json",
        beforeSend : function(){
            loader();
        },
        success : function(data){
            if(data.success)
            {
                $("#app_date").val(data.current_date);
                //doctor
                if($("#doctor-selection").html().trim() == '')
                {
                    sp.set("doctor_list",JSON.stringify(data.doctor_list));
                    var doctorListView = '';
                    $.each(data.doctor_list,function(key,value){
                        value['key'] = key;
                        doctorListView += mvc.LoadView('Appointment/DoctorList',value);
                    });
                    var doctorIndexView = mvc.LoadView('Appointment/DoctorIndex',{list:doctorListView});
                    $("#request-schedule-page #doctor-selection").html(doctorIndexView);
                }
                
                //pets
                var petListView = '';
                $.each(data.pet_list,function(key,value){
                    petListView += mvc.LoadView('Appointment/PetList',value);
                });
                var petIndexView = mvc.LoadView('Appointment/PetIndex',{list:petListView});
                $("#request-schedule-page #pet-selection").html(petIndexView);
                //services
                var serviceListView = '';
                SERVICES_LIST = data.services_list;
                $.each(data.services_list,function(key,value){
                    value.key = key;
                    serviceListView += mvc.LoadView('Appointment/ServiceList',value);
                });
                var serviceIndexView = mvc.LoadView('Appointment/ServiceIndex',{list:serviceListView});
                $("#request-schedule-page #services-selection").html(serviceIndexView);
            }
            else
            {
                ons.notification.alert(data.message);
            }
            dismissLoader();
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
            dismissLoader();
        }
    });
};

var SubmitAppointment = function(){
    var app_date = $("#app_date").val();
    var app_time = $("#app_time").val();
    var conv_app_date = new Date(app_date);
    var day = conv_app_date.getDay();
    var selected_day = '';
    var selected_day_name = '';
    switch(day)
    {
        case 0:
            selected_day = 'sun';
            selected_day_name = "Sunday";
            break;
        case 1:
            selected_day = 'mon';
            selected_day_name = "Monday";
            break;
        case 2:
            selected_day = 'tue';
            selected_day_name = "Tuesday";
            break;
        case 3:
            selected_day = 'wed';
            selected_day_name = "Wednesday";
            break;
        case 4:
            selected_day = 'thur';
            selected_day_name = "Thursday";
            break;
        case 5:
            selected_day = 'fri';
            selected_day_name = "Friday";
            break;
        case 6:
            selected_day = 'sat';
            selected_day_name = "Saturday";
            break;
    }
    var doctorkey = $("#doctor").val();
    var doctorData = sp.getData("doctor_list");
    
    var pet = $("#pet").val();
    var selected_services = '';
    var ctr = 0;
    $("input:checkbox[name='services']").each(function(){
        if($(this).prop('checked'))
        {
            if(ctr == 0)
            {
                selected_services += $(this).val();
            }
            else
            {
                selected_services += ","+$(this).val();
            }
            ctr++;
        }
    });
    
    if(app_date.trim() == '')
    {
        ons.notification.alert("Please fill-out Appointment date.");
    }
    else if(app_time.trim() == '')
    {
        ons.notification.alert("Please fill-out Appointment Time.");
    }
    else if(doctorkey.trim() == '')
    {
        ons.notification.alert("Please select a doctor.");
    }
    else if(pet.trim() == '')
    {
        ons.notification.alert("Please select a pet.");
    }
    else if(doctorData[doctorkey][selected_day] == 0)
    {
        ons.notification.alert("Your chosen doctor is not available during "+selected_day_name);
    }
    else if(selected_services.trim() == '')
    {
        ons.notification.alert("Please select service.");
    }
    else
    {
        var data = {
            customer_id : sp.get("user_id"),
            pet_id : pet,
            doctor_id : doctorData[doctorkey]['id'],
            app_date : app_date,
            app_time : app_time,
            selected_services : selected_services,
            note : $("#app_note").val()
        };
        
        $.ajax({
            url : config.url+'/RequestAppointment',
            method : "POST",
            data : data,
            dataType : "json",
            beforeSend : function(){
                loader();
            },
            success : function(data){
                if(data.success)
                {
                    ons.notification.alert("Appointment Request Submitted.");
                    myNavigator.popPage({ animation : 'lift' });
                }
                else
                {
                    ons.notification.alert(data.message);
                    if(data.error_code == 'TIME_ERROR')
                    {
                        RenderAppTime(app_date);
                    }
                }
                dismissLoader();
            },
            error : function(){
                ons.notification.alert("Error connecting to server.");
                dismissLoader();
            }
        });
    }
};

var RenderAppointmentHistory = function(){
    $.ajax({
        url : config.url+'/GetAppointmentByCustomerId',
        method : "POST",
        data : {
            customer_id : sp.get("user_id")
        },
        dataType : "json",
        beforeSend : function(){
            loader();
        },
        success : function(data){
            if(data.success)
            {
                var ListView = '';
                $.each(data.app_list,function(key,value){
                    ListView += mvc.LoadView('Appointment/AppItem',value);
                });
                var IndexView = mvc.LoadView('Appointment/AppIndex',{list:ListView});
                $("#schedule-page .page__content").html(IndexView);
            }
            else
            {
                ons.notification.alert(data.message);
            }
            dismissLoader();
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
            dismissLoader();
        }
    });
};

var RenderAppointmentDetailPage = function()
{
    $.ajax({
        url : config.url+'/GetAppointmentDetailById',
        method : "POST",
        data : {
            id : sp.get("current_app_id")
        },
        dataType : "json",
        beforeSend : function(){
            loader();
        },
        success : function(data){
            if(data.success)
            {
                var ListView = '';
                $.each(data.services_list,function(key,value){
                    ListView += mvc.LoadView('Appointment/AppDetailServiceList',value);
                });
                data.app_detail.services_list = ListView;
                if(data.app_detail.status == 1)
                {
                    data.app_detail.cancel_button = mvc.LoadView('Appointment/CancelAppointment',data.app_detail);
                }
                else
                {
                    data.app_detail.cancel_button = '';
                }
                var IndexView = mvc.LoadView('Appointment/AppDetail',data.app_detail);
                $("#request-schedule-detail-page .request-schedule-detail").html(IndexView);
            }
            else
            {
                ons.notification.alert(data.message);
            }
            dismissLoader();
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
            dismissLoader();
        }
    });
};

var RenderEditProfileForm = function()
{
    var info = sp.getKey('customer','info');
    $("#lastname").val(info.lastname);
    $("#firstname").val(info.firstname);
    $("#address").val(info.address);
    $("#email").val(info.email);
    $("#mobile").val(info.mobile);
    $("#edit_username").val(info.username);
};

var cancelAppointment = function(id)
{
    ons.notification.confirm({
            message: 'Are you sure you want to cancel this appointment?',
            callback: function(answer) {
                if(answer == 1)
                {
                    $.ajax({
                        url : config.url+'/CancelAppointment',
                        method : "POST",
                        data : {
                            id : id
                        },
                        dataType : "json",
                        beforeSend : function(){
                            loader();
                        },
                        success : function(data){
                            if(data.success)
                            {
                                ons.notification.alert("Appointment successfully canceled.");
                                myNavigator.popPage({ animation : 'lift' });
                            }
                            else
                            {
                                ons.notification.alert(data.message);
                            }
                            dismissLoader();
                        },
                        error : function(){
                            ons.notification.alert("Error connecting to server.");
                            dismissLoader();
                        }
                    });
                }
            }
        });
};

var cancelOrder = function(id)
{
    ons.notification.confirm({
            message: 'Are you sure you want to cancel order #'+id+'?',
            callback: function(answer) {
                if(answer == 1)
                {
                    $.ajax({
                        url : config.url+'/CancelOrder',
                        method : "POST",
                        data : {
                            id : id
                        },
                        dataType : "json",
                        beforeSend : function(){
                            loader();
                        },
                        success : function(data){
                            if(data.success)
                            {
                                ons.notification.alert("Order successfully canceled.");
                                myNavigator.popPage({ animation : 'lift' });
                            }
                            else
                            {
                                ons.notification.alert(data.message);
                            }
                            dismissLoader();
                        },
                        error : function(){
                            ons.notification.alert("Error connecting to server.");
                            dismissLoader();
                        }
                    });
                }
            }
        });
};

var RenderSpecie = function()
{
    $.ajax({
        url : config.url+'/GetSpecies',
        method : "POST",
        data : null,
        dataType : "json",
        beforeSend : function(){
            loader();
        },
        success : function(data){
            if(data.success)
            {
                var ListView = '';
                $.each(data.list,function(key,value){
                    ListView += mvc.LoadView('Appointment/SpecieList',value);
                });
                $('.pet_specie_selection').html(mvc.LoadView('Appointment/SpecieIndex',{list : ListView}));
            }
            else
            {
                ons.notification.alert("Error connecting to server.");
            }
            dismissLoader();
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
            dismissLoader();
        }
    });
};

var RenderBreed = function(id)
{
    $.ajax({
        url : config.url+'/GetBreeds',
        method : "POST",
        data : {id : id},
        dataType : "json",
        beforeSend : function(){
            loader();
        },
        success : function(data){
            if(data.success)
            {
                var ListView = '';
                $.each(data.list,function(key,value){
                    ListView += mvc.LoadView('Appointment/BreedList',value);
                });
                $('.pet_breed_selection').html(mvc.LoadView('Appointment/BreedIndex',{list : ListView}));
            }
            else
            {
                ons.notification.alert("Error connecting to server.");
            }
            dismissLoader();
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
            dismissLoader();
        }
    });
};

var SavePet = function(data)
{
    $.ajax({
        url : config.url+'/SavePet',
        method : "POST",
        data : data,
        dataType : "json",
        beforeSend : function(){
            loader();
        },
        success : function(data){
            if(data.success)
            {
                myNavigator.popPage({ animation : 'lift' });
                ons.notification.alert("Pet successfully saved.");
            }
            else
            {
                ons.notification.alert("Error connecting to server.");
            }
            dismissLoader();
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
            dismissLoader();
        }
    });
};

var RenderAppTime = function(sched)
{
    $.ajax({
        url : config.url+'/GetTimeTable',
        method : "POST",
        data : {
            sched_date : sched
        },
        dataType : "json",
        beforeSend : function(){
        },
        success : function(data){
            if(data.success)
            {
                var ListView = '';
                $.each(data.sched,function(key,value){
                    ListView += mvc.LoadView('Appointment/AppTimeList',value);
                });
                
                $("#app-time-holder").html(mvc.LoadView('Appointment/AppTimeIndex',{list : ListView}));
            }
            else
            {
                ons.notification.alert(data.message);
                $("#app_date").val('');
            }
            dismissLoader();
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
            dismissLoader();
        }
    });
};

var SetPetSession = function(key)
{
    sp.set('current_pet_key',key);
    myNavigator.pushPage('my-pet-detail', { animation : 'lift' });
};

var RenderPetDetails = function(key)
{
    var data = MY_PET_LIST[sp.get('current_pet_key')];
    if(data.gender == 1)
    {
        data.gender = 'Male';
    }
    else
    {
        data.gender = 'Female';
    }
    
    $("#pet-datails").html(mvc.LoadView('Pet/PetDetails',data));
    
    RenderAppointmentHistoryByPet(data.petid);
};

var RenderAppointmentHistoryByPet = function(id){
    $.ajax({
        url : config.url+'/GetAppointmentByPetId',
        method : "POST",
        data : {
            id : id
        },
        dataType : "json",
        beforeSend : function(){
        },
        success : function(data){
            if(data.success)
            {
                var ListView = '';
                $.each(data.app_list,function(key,value){
                    ListView += mvc.LoadView('Appointment/AppItem',value);
                });
                
                if(ListView.trim() == '')
                {
                    ListView = '<i style="padding-left:20px;">No appointment history...</i>';
                }
                
                var IndexView = mvc.LoadView('Appointment/AppPetIndex',{list:ListView});
                $("#pet-appointment-history").html(IndexView);
            }
            else
            {
                ons.notification.alert(data.message);
            }
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
        }
    });
};

var SetServicesSession = function(key)
{
    sp.set('current_service',key);
    myNavigator.pushPage('servicedetail', { animation : 'lift' });
};

var RenderServiceDetailPage = function()
{
    var key = sp.get('current_service');
    var data = SERVICES_LIST[key];
    if(data.image == '')
    {
        data.image = 'img/logo.png';
    }
    else
    {
        data.image = config.serviceUrl + data.image;
    }
    $("#service-detail-page .page__content .pd-data").html(mvc.LoadView('Appointment/ServiceDetails',data));
};

var resendVerificationCode = function(id)
{
    $.ajax({
        url : config.url+'/ResendVerificationCode',
        method : "POST",
        data : {
            id : id
        },
        dataType : "json",
        beforeSend : function(){
        },
        success : function(data){
            if(data.success)
            {
                ons.notification.alert({
                    title : "Success",
                    message : "Please wait for your account verification code that will be sent on your registered mobile number."
                });
            }
            else
            {
                ons.notification.alert("Error connecting to server.");
            }
        },
        error : function(){
            ons.notification.alert("Error connecting to server.");
        }
    });
};

var RenderProductCategories = function(id)
{
    $.ajax({
        url : config.url+'/GetProductCategories',
        method : "POST",
        data : null,
        dataType : "json",
        beforeSend : function(){
        },
        success : function(data){
            if(data.success)
            {
                var ListView = ''
                $.each(data.list,function(key,value){
                    ListView += mvc.LoadView('Products/ProductCategoryList',value);
                });
                
                $("#product-category-holder").html(mvc.LoadView('Products/ProductCategoryIndex',{list : ListView}));
                
                if(sp.isset('refine_category'))
                {
                    $(".product-category-selector").val(sp.get('refine_category'));
                }
            }
            else
            {
                //ons.notification.alert("Error connecting to server.");
            }
        },
        error : function(){
            //ons.notification.alert("Error connecting to server.");
        }
    });
};

var RenderDoctorInfo = function(elem)
{
   var id = $(elem).val();
   var data = JSON.parse(sp.get("doctor_list"));
   var info = data[id];
   if(info.image == '')
   {
      info.image = 'img/logo.png'; 
   }
   else
   {
       info.image = config.doctorUrl+info.image;
   }
   console.log(info);
   info.schedule = '';
   
   if(info.mon == 1)
   {
        info.schedule += 'mon ';
   }
   if(info.tue == 1)
   {
        info.schedule += 'tue ';
   }
   if(info.wed == 1)
   {
        info.schedule += 'wed ';
   }
   if(info.thur == 1)
   {
        info.schedule += 'thur ';
   }
   if(info.fri == 1)
   {
        info.schedule += 'fri ';
   }
   if(info.sat == 1)
   {
        info.schedule += 'sat ';
   }
   if(info.sun == 1)
   {
        info.schedule += 'sun ';
   }
   
   var IndexView = mvc.LoadView('Appointment/DoctorInfo',info);
   $("#doctor-details").html(IndexView);
};