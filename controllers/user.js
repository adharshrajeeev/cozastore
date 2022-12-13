
const UserDetailsHelper=require('../helpers/user-helpers');
const productHelpers=require('../helpers/product-helpers')
const userHelper=require('../helpers/user-helpers');
// const { Db } = require('mongodb');
// const userHelpers = require('../helpers/user-helpers');


var paypal = require('paypal-rest-sdk');




paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AdiaQvZGg7FxbhZPA75joHN4KYPuOarG7MHEbBYon_sZefXr8V_5e0oPXOZ75XxWJqq257Jawh4ZL3du',
    'client_secret': 'EPqwTsitDJ4YbPGwJKvXM_zBZd10XxOzrGQZsubfC4RdxEHAhIBCOOOcgNDbwjzYLP9TAST_cPX9vHYQ'
  });

module.exports={

//---------------------------HOME PAGE DISPLAY------------------------------//

    userhomePage:async(req,res)=>{
      
        let user=req.session.user
        req.session.returnTo=req.originalUrl
        let cartCount=null;
        let wishlistCount=null;
        if(req.session.user){
         cartCount=await userHelper.getCartCount(req.session.user._id)
         wishlistCount=await userHelper.getWishlistCount(req.session.user._id)
         console.log(wishlistCount,"helll yea")
        }
       
        let banners=await userHelper.getAllBanners();
          
       
      
        let categories=await userHelper.getAllcategories()
        UserDetailsHelper.getAllProducts().then((products)=>{
          res.render('user/index',{user,products,cartCount,categories,banners,wishlistCount});
        })
       
                              
    },

//---------------------------USER LOGIN------------------------------//

    getLogin:(req,res)=>{
        if(req.session.loggedIn){
            res.redirect('/');
        }
        else{
            res.render('user/userLogin',{layout:null,"loginErr":req.session.loginErr});
            req.session.loginErr=false;
            
        }
       
    },


    postLogin:(req,res)=>{
       userHelper.usersLogin(req.body).then((response)=>{
        if(response.status){
            if(response.user.isblocked){
                res.redirect('/userlogin');
            }else
            {
                req.session.loggedIn=true
                req.session.user=response.user
                res.redirect(req.session.returnTo);
            }
           
        }else{
            req.session.loginErr="Invalid UserName or Password";
            res.redirect('/userLogin');
        }
       })

    },

//---------------------------USER LOGOUT------------------------------//

    getLogout:(req,res)=>{
      req.session.user=false;
      req.session.loggedIn=false;
       res.redirect('/')
    },


//---------------------------USER SIGNUP DETAILS------------------------------//

    getSignup:(req,res)=>{
        
        res.render('user/userSignUp',{layout:null});
    },


    postSignup:(req,res)=>{
      userHelper.usersSignup(req.body).then((response)=>{
        if(response.status==false){
        
            req.session.UserSignUpError="USER ALREADY EXISTS"
            res.render('user/userSignUp',{layout:null,"UserSignUpError":req.session.UserSignUpError})
            req.session.UserSignUpError=false;
            
        }else{
            res.redirect('/userLogin') 
        }
       
      })
    },
    
//---------------------------USERLIST ALL PRODUCTS------------------------------//

    getProducts:async(req,res)=>{  
        let cartCount=null
        let wishlistCount=null
        if(req.session.user){

         cartCount=await userHelper.getCartCount(req.session.user._id)
         wishlistCount=await userHelper.getWishlistCount(req.session.user._id)
        }                                             
        UserDetailsHelper.getAllProducts().then((products)=>{
        let user=req.session.user
        req.session.returnTo=req.originalUrl;
        res.render('user/product',{products,user,cartCount,wishlistCount})
       })
},

//--------------------------SHOW CATEGORY WISE PRODUCTS---------------------------------//


    getCategoryWise:async(req,res)=>{
        let cartCount=null
        if(req.session.user){
            cartCount=await userHelper.getCartCount(req.session.user._id)
            wishlistCount=await userHelper.getWishlistCount(req.session.user._id)
           }
           let user=req.session.user;
           req.session.returnTo=req.originalUrl;
           let products=await productHelpers.getCategoryWiseProducts(req.query.id)
        res.render('user/product-categoryView',{user,products,cartCount,wishlistCount})
    },



 //-------------------------SINGLE PRODUCT VIEW DETAILS----------------------------------//

 getProductDetails:async(req,res)=>{
    let cartCount=null
    let wishlistCount=null;
    let user=req.session.user
        if(user){
         cartCount=await userHelper.getCartCount(req.session.user._id);
         wishlistCount=await userHelper.getWishlistCount(req.session.user._id)
        }
   
    req.session.returnTo=req.originalUrl
    let product=await productHelpers.getProductDetails(req.query.id)
    res.render('user/product-view',{user,product,cartCount,wishlistCount});
 },



 //----------------------------------OTP LOGIN-------------------------------------------//
 getotpPage:(req,res)=>{
    res.render('user/userOtp',{layout:null});
 },


let: signupData=0,


//----------------------------------POST OTP---------------------------------------------------//

postOtp:(req,res)=>{
    userHelper.doOTP(req.body).then((response)=>{
        if(response.status){
            signupData=response.user;
             console.log(signupData)
             
            res.redirect('/confirmOtp')
            
        }
        else{
            res.redirect('/OtpPage')
        }
    })
   console.log(req.body);
},

//----------------------------------DISPLAY CONFIRM OTP PAGE----------------------------------------

getconfirmOTP:(req,res)=>{
    res.render('user/userConfirmOtp',{layout:null})
},


//-----------------------------------POST CONFIRM OTP----------------------------------------------

postconfirmOTP:(req,res)=>{
    console.log(req.body)
  userHelper.doOTPConfirm(req.body,signupData).then((response)=>{
    if(response.status){
        
        
       req.session.loggedIn=true;
       req.session.user=signupData;

   
        res.redirect('/')
    }else{
        res.redirect('/confirmOtp')
    }
  })
},


 //--------------------------------------GET CART DETAILS------------------------------------//
 
 getcartDetails:async(req,res)=>{
    let user=req.session.user._id;
    
    if(user)
   { 
        let name=req.session.user
        let products=await userHelper.getCartProducts(req.session.user._id)
        let totalValue=0;
        if(products.length>0){
            totalValue=await userHelper.getTotalAmount(req.session.user._id)
        }
        wishlistCount=await userHelper.getWishlistCount(req.session.user._id)
         cartCount=await userHelper.getCartCount(req.session.user._id) 
         res.render('user/cart',{user,products,totalValue,cartCount,name,wishlistCount})
    }else{
        res.redirect('/')
    }
  
   
 },

 

//-----------------------------------------VERIFY LOGIN MIDDLEWARE-----------------------------------------//

 verifyUserLogin:(req,res,next)=>{
    if(req.session.loggedIn){
        next();

    }
    else{
        res.redirect('/userLogin')
    }
 },

 //-----------------------------------------ADD TO CART-----------------------------------------//

 addToCart:(req,res)=>{
    userHelper.productAddToCart(req.params.id,req.session.user._id).then(()=>{
       res.json({status:true})
    })
 },


 addToWishList:(req,res)=>{

    userHelper.addProductToWishList(req.params.id,req.session.user._id).then(()=>{
        res.json({status:true})
    })
 },

 //-----------------------------------------REMOVE FROM WIHSLIST------------------------

 removeProductFromWishlist:async(req,res)=>{
    
     userHelper.removeWishlistProduct(req.body).then(async(response)=>{
            res.json({status:true})
     })
 },

 ChangeProductQuantity:(req,res,next)=>{
    console.log(req.body)
    userHelper.changeProductsQuantity(req.body).then(async(response)=>{
       response.total=await userHelper.getTotalAmount(req.body.user)
        res.json(response)
        
    })
 },

 removeProductFrmCart:(req,res)=>{
    let productId=req.params.id
    console.log(productId)
    userHelper.deleteCartProduct(productId).then((response)=>{
        res.redirect('/cart')
    })
 },


 //---------------------------------------PROCEED TO CHECKOUT PGE----------------------------------//

 getCheckoutPage:async(req,res)=>{
    let user=req.session.user;
    if(user){
        let address=await userHelper.getShippingAddress(req.session.user._id)
        let cartCount=await userHelper.getCartCount(req.session.user._id)
         let  wishlistCount=await userHelper.getWishlistCount(req.session.user._id)
        let total=await userHelper.getTotalAmount(req.session.user._id)
        res.render('user/checkOut',{user,cartCount,total,address,wishlistCount})
    }else
    {
        res.redirect('/')
    }
    
 },

 //--------------------------------------PLACE ORDER---------------------------------------------

 PlaceOrder:async(req,res)=>{

    let user=req.session.user
    let products=await userHelper.getCartProductList(req.body.userId)
    let totalPrice=await userHelper.getTotalAmount(req.body.userId)
    let productPrice=await userHelper.getProductPrice(req.body.userId)
    console.log(productPrice,"heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeey");
    
    let verifyCoupon=await userHelper.couponVerify(user._id);
    
    console.log(verifyCoupon.couponId,'123333333333333333');
    console.log(req.body.couponcode,"3255555555555555555555")

    if(verifyCoupon.couponId == req.body.couponcode){

        let discountAmount=(totalPrice * parseInt(verifyCoupon.couponPercentage))/100;
        
        let amount=totalPrice-discountAmount;
        console.log(discountAmount,"thi is dicsount++++++++++++++++++++++++")
            console.log(amount,"this is original--------------- ")
       await userHelper.placeOrder(req.body,products,amount,user._id).then((orderId)=>{
            // console.log(req.body,"sugaam")
            if(req.body['paymentMethod']==='COD'){
                res.json({codSuccess:true})
            }
            else if(req.body['paymentMethod']==='RAZORPAY'){
               userHelper.generateRazorPay(orderId,totalPrice).then((response)=>{
                response.razorPay=true
                   res.json(response)
               })
            }
            else if(req.body['paymentMethod']==='PAYPAL'){
                var payment = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "http://localhost:3000/orderSucess",
                        "cancel_url": "http://localhost:3000"
                    },
                    "transactions": [{
                        "amount": {
                            "currency": "USD",
                            "total": totalPrice
                        },
                        "description": orderId
                    }]
                };
    
                userHelper.createPaypal(payment).then((transaction)=>{
                        var id = transaction.id;
                        var links = transaction.links;
                        var counter = links.length;
                    while(counter--){
                        if(links[counter].rel=='approval_url'){
                            transaction.payPal = true
                            transaction.linkto = links[counter].href
                            transaction.orderId = orderId
                            userHelper.changePaymentStatus(orderId).then(()=>{
                                res.json(transaction)
                            })
                        }
                    }
                })
            }
            
        })
    }
    else{
        userHelper.placeOrder(req.body,products,totalPrice,user).then((orderId)=>{
            // console.log(req.body,"sugaam")
            if(req.body['paymentMethod']==='COD'){
                res.json({codSuccess:true})
            }
            else if(req.body['paymentMethod']==='RAZORPAY'){
               userHelper.generateRazorPay(orderId,totalPrice).then((response)=>{
                response.razorPay=true
                   res.json(response)
               })
            }
            else if(req.body['paymentMethod']==='PAYPAL'){
                var payment = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "http://localhost:3000/orderSucess",
                        "cancel_url": "http://localhost:3000"
                    },
                    "transactions": [{
                        "amount": {
                            "currency": "USD",
                            "total": totalPrice
                        },
                        "description": orderId
                    }]
                };
    
                userHelper.createPaypal(payment).then((transaction)=>{
                        var id = transaction.id;
                        var links = transaction.links;
                        var counter = links.length;
                    while(counter--){
                        if(links[counter].rel=='approval_url'){
                            transaction.payPal = true
                            transaction.linkto = links[counter].href
                            transaction.orderId = orderId
                            userHelper.changePaymentStatus(orderId).then(()=>{
                                res.json(transaction)
                            })
                        }
                    }
                })
            }
            
        })
    }
   
    // console.log(req.body)
    
    
 },

 //---------------------------------------PAYMENT - FAILED RAZORPAY--------------------


 getPaymentFailed:async(req,res)=>{
    // if(req.session.user.orderId){
       await userHelper.deletePendingOrder(req.params.orderId).then(()=>{
        res.render('user/paymentFailed');
       })
   
   
 },


 //-----------------------------------------ORDER SUCESSS RENDER PAGE-------------------------

 sucessOrder:(req,res)=>{
    let user=req.session.user
    res.render('user/orderSucess',{user})
 },

 //----------------------------------------VIEW ORDERS PAGE------------------------------------

 getOrders:async(req,res)=>{
    let user=req.session.user;
    if(user){
        let cartCount=await userHelper.getCartCount(req.session.user._id)
        let  wishlistCount=await userHelper.getWishlistCount(req.session.user._id)
        let orders=await userHelper.getUserOrders(req.session.user._id)
        console.log(orders)
        res.render('user/userOrders',{orders,user:req.session.user,cartCount,wishlistCount})
    }else{
        res.redirect('/')
    }
   
 },

 //-------------------------------------------SHOW USER PROFILE--------------------------

 getUserProfile:async(req,res)=>{
        let user=req.session.user;
        if(user){
            let allAddress=await userHelper.getShippingAddress(req.session.user._id)
            let cartCount=await userHelper.getCartCount(req.session.user._id)
            let  wishlistCount=await userHelper.getWishlistCount(req.session.user._id)
            userHelper.getUserDetails(req.session.user._id).then((user)=>{
                res.render('user/userProfile',{user,allAddress,cartCount,wishlistCount})
              })
            
        }else
        {
            res.redirect('/');
        }
       
    
 },

 //--------------------------------------EDIT USER PROFILE-------------------------------------

 postUserProfile:(req,res)=>{
     console.log(req.body)
     let user=req.session.user._id;
     userHelper.updateUserProfile(user,req.body).then((response)=>{
        res.json({status:true})
     })
 },

//----------------------------------ADD USER ADDRESS-------------------------------------------

 addUserAddress:(req,res)=>{
    let userId=req.session.user._id
   userHelper.addAddress(userId,req.body).then((data)=>{
     res.redirect('/userProfile');
   })
 },


 //----------------------EDIT USER ADDRESS----------------------------------------------------

 editAddress:async(req,res)=>{
  
    let user=req.session.user
    if(user){
        let userId=req.session.user._id
        let Id=req.params.id
        let cartCount=await userHelper.getCartCount(req.session.user._id)
        let  wishlistCount=await userHelper.getWishlistCount(req.session.user._id)
        userHelper.editUserAddress(Id,userId).then((data)=>{

            res.render('user/editUserAddress',{data,user,cartCount,wishlistCount})
        })
    }else
    {
        res.redirect('/');
    }
    
 },


 //------------------------POST EDIT USER ADDRESS-------------------------------------------------


 postEditUserAddress:(req,res)=>{
    let userId=req.body.user;
    let Id=req.body.id;

    userHelper.postEditUserAddress(req.body,userId,Id).then((response)=>{
        res.redirect('/userProfile')
    })
 },

 //-------------------------------DELETE USER ADDRESS-----------------------------------

 deleteUserAddress:(req,res)=>{
        let id=req.params.id;
        let userId=req.session.user._id;
        userHelper.deleteAddress(userId,id).then((response)=>{
            res.redirect('/userProfile')
        })
 },

 //---------------------------------------------------USER CANCEL ORDER---------------------------------

 userCancelOrder:(req,res)=>{
   let cancelUserId=req.query.id
   userHelper.updateUserOrderStatus(cancelUserId)
   res.redirect('/ViewOrders')
 },

 //-------------------------------------------SHOW ORDERED PRODUCTS-----------------------------------------

 viewOrderedProducts:async(req,res)=>{
    let products=await userHelper.getOrderdProducts(req.params.id)
    let cartCount=await userHelper.getCartCount(req.session.user._id)
    let  wishlistCount=await userHelper.getWishlistCount(req.session.user._id)
    res.render('user/orderedProducts',{products,user:req.session.user,cartCount,wishlistCount})
 },



 //------------------------------------------CANCEL ORDER--------------------------------------

 userCancelProduct:(req,res)=>{
    let cancelProductId=req.query.id
    userHelper.updateProductOrderStatus(cancelProductId)            //NEEDED TO RECTIFY
    res.redirect('/viewOrderProducts/:id')
 },


 //---------------------------------------------CANCEL ORDERED PRODUCT-------------------------------

 setOrderedProductStatus:(req,res)=>{
    let status=req.body.status;
    let orderId=req.body.orderId;
    let productId=req.body.productId;
    userHelper.setEachProductStatus(status,orderId,productId).then((response)=>{
        if(response){
            res.json({status:true})
        }else{
            res.json({status:false})
        }
    })
    console.log(status)
 },

 //-----------------------------------------VERIFY PAYMENT------------------------------

 paymentVerify:(req,res)=>{
    userHelper.verifyPayment(req.body).then(()=>{
        userHelper.changePaymentStatus(req.body['order[receipt]']).then(()=>{
             console.log("Payment sucess");
            res.json({status:true})
        })
    }).catch((err)=>{
        console.log(err)
        res.json({status:false})
    })
    console.log(req.body)
 },


 addDeliveryAaddress:(req,res)=>{
    // console.log(req.body);
     userHelper.addAddress(req.session.user._id,req.body).then((data)=>{
        res.redirect('/proceedToCheckOut')
     })
    
 },


 //---------------------------POST APPLY COUPON----------------------------------


 postCouponApply:async(req,res)=>{
    let user=req.session.user._id;
    const date=new Date();
    let totalAmount= await userHelper.getTotalAmount(user)
    let Total=totalAmount;

    if(req.body.coupon == ''){
        res.json({noCoupon:true,Total})
    }
    else
    { 
        let couponres=await userHelper.applyCoupon(req.body,user,date,totalAmount)
        if (couponres.verify) {

        let discountAmount=(totalAmount * parseInt(couponres.couponData.couponPercentage))/100;
        let amount = totalAmount - discountAmount
        couponres.discountAmount = Math.round(discountAmount)
        couponres.amount = Math.round(amount);
        res.json(couponres)

    }else{
        
        couponres.Total=totalAmount;
        res.json(couponres)

    }
    
    }
   
    
 },


 //------------------------------------POST REMOVE COUPON--------------------------------------

 postCouponRemove:async(req,res)=>{

    let user=req.session.user._id;
    await userHelper.removeCoupon(user).then(async(response)=>{
        response.totalAmount= await userHelper.getTotalAmount(user);
        res.json(response)
    })
 },



//----------------------------------SHOW WISH LIST---------------------------------------------

displayWishList:async(req,res)=>{
    let user=req.session.user;
    // let userId=req.session.user._id
   if(user)
   { 
       
        let products=await userHelper.getWishListProducts(req.session.user._id)
        let totalValue=0;
        if(products.length>0){
            totalValue=await userHelper.getTotalAmount(req.session.user._id)
        }
         cartCount=await userHelper.getCartCount(req.session.user._id) 
         wishlistCount=await userHelper.getWishlistCount(req.session.user._id)
         console.log(products,'wish list prducts')
         res.render('user/wishList',{user,products,totalValue,cartCount,wishlistCount})
    }else{
        res.redirect('/')
    }
},

//---------------------------------SEARCH PRODUCTS--------------------------------------------------

postSearchProducts:async(req,res)=>{
    let user=req.session.user
        if(user){
            cartCount=await userHelper.getCartCount(req.session.user._id) 
            wishlistCount=await userHelper.getWishlistCount(req.session.user._id);
            userHelper.searchProducts(req.body.search).then((products)=>{
                res.render('user/searchedProducts',{products,cartCount,wishlistCount,user})
            }).catch((err)=>{
                console.log(err);
            })
        }
        else{
            userHelper.searchProducts(req.body.search).then((products)=>{
                res.render('user/searchedProducts',{products})
            }).catch((err)=>{
                console.log(err);
            })
        }
      
  
   
    
}


}