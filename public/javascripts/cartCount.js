function changeQuantity(cartId,productId,userId,count){
    event.preventDefault();
    let quantity=parseInt(document.getElementById(productId).innerHTML)
    count=parseInt(count);
   
      $.ajax({
        url:'/changeProductQuantity',
        data:{
            user:userId,
            cart:cartId,
            product:productId,
            count:count,
            quantity:quantity,
            
        },
        method:'post',
        success:(response)=>{
            if(response.removeProduct){
                swal({
                    title: "Good job!",
                    text: "Prodcut removed from cart!",
                    icon: "success",
                    button: "OK",
                  });
               setTimeout(()=>{
                location.href='http://localhost:4000/cart';
               },1000) 
            }
            else{
                document.getElementById(productId).innerHTML= quantity + count;
                // document.getElementById("Total").innerHTML=response.total;
                document.getElementById("Total2").innerHTML=response.total;
            }
            
        }
    });
}