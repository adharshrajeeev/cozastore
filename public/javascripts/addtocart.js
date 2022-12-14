


function addToCart(productId){
  swal("Sucess", "Product added to Cart", "success")
    $.ajax({
        url:'/addToCart/'+productId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count=$('#cartCount').html()
                count=parseInt(count)+1
                $("#cartCount").html(count)
            }
           
        }
    })
}



$("#checkOutForm").submit((e)=>{
  console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhu")
  e.preventDefault()
  $.ajax({
    url:'/placeOrder',
    method:'post',
    data:$('#checkOutForm').serialize(),
    success:(response)=>{
      alert(response)
      if(response.codSuccess){

        location.href='/orderSucess'

      }
      else if(response.razorPay){

           razorpayPayment(response)
      }
      else if(response.payPal){
        console.log(response)
        location.replace(response.linkto)
      }
    }
  })
})

function razorpayPayment(order){
  var options = {
    "key": "rzp_test_ow6sQKwWcM8BIK", // Enter the Key ID generated from the Dashboard
    "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "Adharsh_R",
    "description": "Test Transaction",
    "image": "https://example.com/your_logo",
    "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": function (response) {
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature);


      verifyPayment(response, order)
  },
  "modal": {
    "ondismiss": function(){
      window.location.replace('https://cozastore.gq/payment-failed/'+order.receipt);
    }
},
    "prefill": {
        "name": "Gaurav Kumar",
        "email": "gaurav.kumar@example.com",
        "contact": "9999999999"
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }

};
var rzp1 = new Razorpay(options);
rzp1.open();
}

function verifyPayment(payment,order) {
    console.log("ivdaaaaaaaaaaaaaa vadaa")
  $.ajax({
    
      url: '/verifyPayment',
      data: {
          payment,
          order
      },

      method: 'post',
      success:(response)=>{
        if(response.status){
          location.href='/orderSucess'
        }else{
          alert("Payment Failed");
        }
      }
    

  });

}



function applyCoupon(event){
  event.preventDefault()
  let coupon=document.getElementById('couponName').value;
 
  $.ajax({
    
    url: '/applyCoupon',
    data: {
      coupon
    },
    method: 'post',
    success:(response)=>{
      if(response.verify){
        console.log("hey hey hey")
        document.getElementById('discount').innerHTML="₹ "+response.discountAmount
        document.getElementById('totall').innerHTML= "₹ "+response.amount
        document.getElementById('percentage').innerHTML=response.couponData.couponPercentage+'%'
        document.getElementById('error').innerHTML = ''
        document.getElementById('error2').innerHTML = '(Coupon has Applied)'
        document.getElementById("applyCouponBtn").hidden = true;
        document.getElementById('deleteCouponBtn').hidden=false;
      }
      else{
          console.log("hoy hoy hohy")
        document.getElementById('discount').innerHTML= "₹ " +0
        document.getElementById('totall').innerHTML= "₹ "+response.Total
        document.getElementById('percentage').innerHTML= 0 + "%"

        if(response.used){
        
          document.getElementById('error2').innerHTML=response.used;
        }
        else if(response.minAmount){
          document.getElementById('error').innerHTML = response.minAmountMsg;
        }
        else if(response.maxAmount){
          document.getElementById('error').innerHTML = response.maxAmountMsg
        }
        else if(response.invalidDate){
          document.getElementById('error').innerHTML = response.invalidDateMsg
        }
        else if(response.invalidCoupon){
          document.getElementById('error').innerHTML = response.invalidCouponMsg
        }
        else if(response.noCoupon){
          document.getElementById('error').innerHTML = 'Invalid Coupon Details'
        }
      }
    }
    
  

});
}


function removeCoupon(event){
  event.preventDefault();
  let coupon=document.getElementById('couponName').value;

  $.ajax({
    
    url: '/removeCoupon',
    data: {
      coupon
    },
    method: 'post',
    success:(response)=>{
      swal({
        title: "Coupon Deleted!",
        text: "You have removed the coupon!",
        icon: "success",
        button: "OK!",
    }).then(() => {
        document.getElementById('percentage').innerHTML=0+'%'
        document.getElementById('discount').innerHTML=0
        document.getElementById('error2').innerHTML = ''
        document.getElementById('couponName').value = ''

        // document.getElementById('couponName').value = ""
        document.getElementById("applyCouponBtn").hidden = false
        document.getElementById("deleteCouponBtn").hidden = true
        document.getElementById("error").innerHTML = ""
        document.getElementById('totall').innerHTML='₹ '+response.totalAmount
    })
    }
    
  

});
}


//-----------------------SEARCH PRODUCT-----------------------------------



function searchProduct(search){
  
}


//------------------------------ADD TO WISHLIST--------------------------------

function addToWishList(productId){
  swal("Sucess", "Product added to WishList", "success")
    
    $.ajax({
        url:'/addToWishList/'+productId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count=$('#wishListCount').html()
                count=parseInt(count)+1
                $("#wishListCount").html(count)
            }
           
        }
    })
}


//-----------------------------REMOVE FROM WISHLIST-----------------------------------


function removeFromWishList(productId,wishListId){
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this imaginary file!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      $.ajax({
        url:'/removeFromWishList',
        data:{
          productId:productId,
          wishListId:wishListId
        },
        method:'post',
        success:(response)=>{
            if(response.status){
              swal("Poof! Your Product has been Removed!", {
                icon: "success",
              });
              location.reload();
            }
           
        }
    })
      
    } else {
      swal("Your Product is safe!");
    }
  });
}




 

