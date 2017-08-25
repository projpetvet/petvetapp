document.addEventListener('init', function(event) {

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
                if(!isNaN(parseInt(quantity)))
                {
                    AddToCart(id,quantity);
                }
                else
                {
                    ons.notification.alert("Please enter a number only");
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
                sp.set('user_id',data.id);
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
                sp.set('user_id',data.id);
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
    $.ajax({
        url : config.url+'/GetProducts',
        method : "POST",
        data : null,
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
                $("#shopping-page .page__content").html("");
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
                    $("#shopping-page .page__content").append(productView);
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
                        listView = mvc.LoadView('Order/OrderItem',value);
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
                //doctor
                sp.set("doctor_list",JSON.stringify(data.doctor_list));
                var doctorListView = '';
                $.each(data.doctor_list,function(key,value){
                    value['key'] = key;
                    doctorListView += mvc.LoadView('Appointment/DoctorList',value);
                });
                var doctorIndexView = mvc.LoadView('Appointment/DoctorIndex',{list:doctorListView});
                $("#request-schedule-page #doctor-selection").html(doctorIndexView);
                //pets
                var petListView = '';
                $.each(data.pet_list,function(key,value){
                    petListView += mvc.LoadView('Appointment/PetList',value);
                });
                var petIndexView = mvc.LoadView('Appointment/PetIndex',{list:petListView});
                $("#request-schedule-page #pet-selection").html(petIndexView);
                //services
                var serviceListView = '';
                $.each(data.services_list,function(key,value){
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
        ons.notification.alert("Please select atleast one service.");
    }
    else
    {
        var data = {
            customer_id : sp.get("user_id"),
            pet_id : pet,
            doctor_id : doctorData[doctorkey]['id'],
            app_date : app_date,
            app_time : app_time,
            selected_services : selected_services
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