var db=require('../config/connection');
var collection=require('../config/collections');
const bcrypt=require('bcrypt');
var ObjectId=require('mongodb').ObjectId
require('dotenv').config()
const Client=require('twilio')(process.env.accoundSid,process.env.authToken)
const moment = require("moment")

const Razorpay=require('razorpay');



var paypal = require('paypal-rest-sdk');





paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AdiaQvZGg7FxbhZPA75joHN4KYPuOarG7MHEbBYon_sZefXr8V_5e0oPXOZ75XxWJqq257Jawh4ZL3du',
  'client_secret': 'EPqwTsitDJ4YbPGwJKvXM_zBZd10XxOzrGQZsubfC4RdxEHAhIBCOOOcgNDbwjzYLP9TAST_cPX9vHYQ'
});

var instance = new Razorpay({
  key_id: 'rzp_test_ow6sQKwWcM8BIK',
  key_secret: 'HSVEmxaiCGgagQQe0oMx7whh',
});

module.exports={

  /* -------------------------------------------------------------------------- */
  /*                                 ADD USER(SIGNUP)                           */
  /* -------------------------------------------------------------------------- */
  
    usersSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
             if(user){
               
                resolve({status:false})
            }
            else{
                userData.password=await bcrypt.hash(userData.password,10)
                 db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                  resolve({status:true})
                })
            }
      
        })
    },

  /*--------------------------------------------------------------------------- */
  /*                                USER LOGIN                                  */
  /* -------------------------------------------------------------------------- */  

    usersLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            // let loginStatus=false;
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            
            if(user){
              bcrypt.compare(userData.password,user.password).then((status)=>{
               if(status){
               
                console.log("Login Sucess");
                response.user=user
                response.status=true
                resolve(response)
               }
               else{
                console.log("LOGIN FAILED");
                resolve({status:false})
               }
              })   
            }
            else{
                console.log("user login fialed");
                resolve({status:false})
            }
        })
    },

    //----------------------------------------OTP SECTION-------------------------------------------
   
    // doOTP:(userData)=>{
    //   let response={}
    //    return new Promise(async(resolve,reject)=>{
    //     let user=await db.get().collection(collection.USER_COLLECTION).findOne({phoneNumber:userData.phone})
    //     if(user){
           
    //       response.status=true
    //       response.user=user
    //       console.log("11111111111111")
    //       Client.verify.services(process.env.serviceId)
    //       .verifications
    //       .create({ to: `+91${userData.phone}`, channel: 'sms' })
    //       .then((data)=>{
            
           
    //       });
    //       resolve(response)
    //     }
    //     else{
    //       response.status=false;
    //       resolve(response)
    //     }
    //    })

    // },

    // doOTPConfirm:(confirmotp,userData)=>{
    //    return new Promise((resolve,reject)=>{
        
    //     console.log(userData)
    //     Client.verify.services(process.env.serviceId)
    //     .verificationChecks
    //     .create({
    //       to:`+91${userData.phoneNumber}`,
    //       code:confirmotp.phone
    //     })
    //     .then((data)=>{
    //       if(data.status=='approved'){
           
    //         resolve({status:true})
    //       }else{
    //         resolve({status:false})
    //       }
    //     })
    //    })
    // },

  /* -------------------------------------------------------------------------- */
  /*                         GET USER DETAILS                                   */
  /* -------------------------------------------------------------------------- */


    getUserDetails:(userId)=>{
      return new Promise((resolve,reject)=>{
        let userdetails=db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectId(userId)})
        resolve(userdetails)
      })
     
    },


  /* -------------------------------------------------------------------------- */
  /*                         GET USER DETAILS                                   */
  /* -------------------------------------------------------------------------- */



  addUserAddressIn:(deliveryAddress,userId)=>{
      return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).updateOne({_id:(ObjectId(userId))},
        {
          $set:{
            shippingAddress:{
              name:deliveryAddress.firstname,
              phoneNumber:deliveryAddress.phonenumber,
             deliveryAddress: deliveryAddress.address1,
             city:deliveryAddress.city,
             state:deliveryAddress.state,
             postCode:deliveryAddress.postcode,
             country:deliveryAddress.country

            }
          }
        }).then((response)=>{
          resolve(response)
        })
      })
  },

  /* -------------------------------------------------------------------------- */
  /*                 EDIT USER ADDRESS IN PROFILE                                */
  /* -------------------------------------------------------------------------- */

  editUserAddress:(Id,userId)=>{
      return new Promise(async(resolve,reject)=>{
        let data=await db.get().collection(collection.ADDRESS_COLLECTION).findOne({ $and: [{ user: ObjectId(userId) }, { id: Id }] })
        resolve(data)
      })
  },



  /* -------------------------------------------------------------------------- */
  /*                POST EDIT USER ADDRESS IN PROFILE                           */
  /* -------------------------------------------------------------------------- */  


  postEditUserAddress:(details,userId,id)=>{
      return new Promise(async(resolve,reject)=>{
        let data=await db.get().collection(collection.ADDRESS_COLLECTION).updateOne({user:ObjectId(userId),id:id},
        {
          $set:{
            name:details.name,
            address:details.address,
            number:details.mobileNumber,
            pincode:details.pincode,
            state:details.state,
            city:details.city,
            country:details.country
           
          }
        })
        resolve(data)
      })
  },


   /* -------------------------------------------------------------------------- */
  /*                         DELETE USER ADDRESS                                */
  /* -------------------------------------------------------------------------- */  


  deleteAddress:(userId,Id)=>{
      return new Promise(async(resolve,reject)=>{
        console.log(userId);
        console.log(Id);
       await db.get().collection(collection.ADDRESS_COLLECTION).deleteOne({ user: ObjectId(userId), id: Id }).
       then((response)=>{
          resolve(response)
       })
      })
  },
     
  /* -------------------------------------------------------------------------- */
  /*                  PROCEED TO CHEKOUT DELIVERY ADDRESS                       */
  /* -------------------------------------------------------------------------- */


  
  addAddress:(userId,details)=>{
   return new Promise((resolve,reject)=>{
    let tempId= moment().format().toString();
    tempId.replace(/\s+/g, ' ').trim()

    let date = new Date()

    let address= db.get().collection(collection.ADDRESS_COLLECTION).insertOne({
      user:ObjectId(userId),
      name:details.name,
      address:details.address,
      pincode: details.pincode,
      number: details.mobileNumber,
      state: details.state,
      city: details.city,
      country: details.country,
      id:tempId
    })
    resolve(address)
   })
  },


  /* -------------------------------------------------------------------------- */
  /*                        GET ADDRESS IN CHEKOUT PAGE                         */
  /* -------------------------------------------------------------------------- */

  getShippingAddress:(userId)=>{
      return new Promise(async(resolve,reject)=>{
        let data=await db.get().collection(collection.ADDRESS_COLLECTION).find({ user:ObjectId(userId) }).toArray()
        resolve(data)
      })
  },


  /* -------------------------------------------------------------------------- */
  /*                         UPDATE USER PROFILE DETAILS                        */
  /* -------------------------------------------------------------------------- */


    updateUserProfile:(userId,userDetails)=>{
      console.log(userId,"yea",userDetails)
       return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(userId)},
        {
          $set:{
            userName:userDetails.userName,
            name:userDetails.name,
            lname:userDetails.lname,
            phoneNumber:userDetails.phoneNumber,
            email:userDetails.email
          }
        }).then((response)=>{
          
          resolve(response)
        })
       })
    },  

  
  /* -------------------------------------------------------------------------- */
  /*                         USER SIDE GET ALL PRODUCTS                         */
  /* -------------------------------------------------------------------------- */

    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
         let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
         resolve(products)
        })
     },
   

  /* -------------------------------------------------------------------------- */
  /*                        LIST BANNERS IN INDEX PAGE                          */
  /* -------------------------------------------------------------------------- */  



     getAllBanners:()=>{
       return new Promise(async(resolve,reject)=>{
        let banners=await db.get().collection(collection.BANNER_COLLECTION).find().toArray()
        resolve(banners)
       })
     }, 


     
  /* -------------------------------------------------------------------------- */
  /*                         LIST ALL CATEGORIS                                */
  /* -------------------------------------------------------------------------- */

     getAllcategories:()=>{
         return new Promise(async(resolve,reject)=>{
          let categories=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
          resolve(categories)
         })
     },

  /* -------------------------------------------------------------------------- */
  /*                        PRODUCT ADDED TO CART                               */
  /* -------------------------------------------------------------------------- */



     productAddToCart:(productId,userId)=>{
    
       return new Promise(async(resolve,reject)=>{
        let details=await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(productId)},{projection:{name:1,stock:1,category:1,price:1}})
        // console.log(details,"this is the infromation about details in cart")
        let productObj={
          item:ObjectId(productId),
          quantity:1,
          price:details.price,
          productName:details.name,
          category:details.category
        }
        let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
        if(userCart){

            let productExist=userCart.products.findIndex(product=> product.item==productId)
            console.log(productExist)
            if(productExist!=-1){
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:ObjectId(userId),'products.item':ObjectId(productId)},
                {
                 $inc:{'products.$.quantity':1}
                }
                ).then(()=>{
                  resolve()
                })
            }else{
              db.get().collection(collection.CART_COLLECTION).updateOne({user:ObjectId(userId)},
              {
  
                  $push:{products:productObj}
  
              }).then((response)=>{
                resolve()
              })
            }
            
        }else{
          let cartObj={
            user:ObjectId(userId),
            products:[productObj]
          }
          db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
            resolve()
          })
        }
       })
     },

  /* -------------------------------------------------------------------------- */
  /*                         GET CART  PRODUCTS                                 */
  /* -------------------------------------------------------------------------- */


     getCartProducts:(userId)=>{
      return new Promise(async(resolve,reject)=>{
        let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
          {
            $match:{user:ObjectId(userId)}
           },
           {
            $unwind:'$products'
           },{
            $project:{
              item:'$products.item',
              quantity:'$products.quantity',
             
            }
           },
           {
            $lookup:{
              from:collection.PRODUCT_COLLECTION,
              localField:'item',
              foreignField:'_id',
              as:'product'
            }
           },
           {
            $project:{
              item:1,
              quantity:1,
              
              product:{
                $arrayElemAt:['$product',0]
              }
            }
           }
         
        ]).toArray()
        resolve(cartItems)
      })
     },


    /* -------------------------------------------------------------------------- */
    /*                         GET CART  COUNT                                    */
    /* -------------------------------------------------------------------------- */

     getCartCount:(userId)=>{
      return new Promise(async(resolve,reject)=>{
        let count=0;
        let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
        if(cart){
           count=cart.products.length
        }
        resolve(count)
      })
     },
     

     
    /* -------------------------------------------------------------------------- */
    /*                         GET WISHLIST PRODUCTS                              */
    /* -------------------------------------------------------------------------- */



     getWishListProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
          let wishlistItems=await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([
            {
              $match:{user:ObjectId(userId)}
             },
             {
              $unwind:'$products'
             },{
              $project:{
                item:'$products.item',
                quantity:'$products.quantity',
               
              }
             },
             {
              $lookup:{
                from:collection.PRODUCT_COLLECTION,
                localField:'item',
                foreignField:'_id',
                as:'product'
              }
             },
             {
              $project:{
                item:1,
                quantity:1,
                
                product:{
                  $arrayElemAt:['$product',0]
                }
              }
             }
           
          ]).toArray()
          resolve(wishlistItems)
        })
        
     },



     /* -------------------------------------------------------------------------- */
    /*                         GET WISHLIST COUNT                                    */
    /* -------------------------------------------------------------------------- */

    getWishlistCount:(userId)=>{
      return new Promise(async(resolve,reject)=>{
        let count=0;
        let wishList=await db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:ObjectId(userId)})
        if(wishList){
          count=wishList.products.length
        }
        resolve(count)
      })
    },


  /* -------------------------------------------------------------------------- */
  /*                    REMOVE PRODUCT FROM WISHLIST                            */
  /* -------------------------------------------------------------------------- */



    removeWishlistProduct:(details)=>{
      return new Promise(async(resolve,reject)=>{
      
        db.get().collection(collection.WISHLIST_COLLECTION).updateOne({_id:ObjectId(details.wishListId)},
        {
          $pull:{
            products:{item:ObjectId(details.productId)}
          }
        }).then((response)=>{
          
          resolve(response)
        })
      })
    },

    
  /* -------------------------------------------------------------------------- */
  /*                    REMOVE PRODUCT FROM CART                                */
  /* -------------------------------------------------------------------------- */


    removeCartProduct:(details)=>{
      return new Promise((resolve,reject)=>{
        db.get().collection(collection.CART_COLLECTION).updateOne({_id:ObjectId(details.cartId)},
        {
          $pull:{
            products:{item:ObjectId(details.productId)}
          }
        }).then((response)=>{
          resolve(response)
        })
      })
    },


  /* -------------------------------------------------------------------------- */
  /*                         CHANGE PRODUCT QUANTITY                             */
  /* -------------------------------------------------------------------------- */

     changeProductsQuantity:(details)=>{
        details.count=parseInt(details.count)
        details.quantity=parseInt(details.quantity)
        return new Promise((resolve,reject)=>{
           if(details.count==-1 && details.quantity==1){
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:ObjectId(details.cart)},
            {
              $pull:{products:{item:ObjectId(details.product)}}
            }
            ).then((response)=>{
              resolve({removeProduct:true})
            })
           }else{
            
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:ObjectId(details.cart),'products.item':ObjectId(details.product)},
            {
                $inc:{'products.$.quantity':details.count}
            }
            ).then((response)=>{

              resolve({status:true})

            })

           }
            
         
        })
     },


     deleteCartProduct:(productId)=>{
           return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION).deleteOne({_id:ObjectId(productId)}).then((response)=>{
              resolve(response)
              console.log(response);
            })
           })
     },


  /* -------------------------------------------------------------------------- */
  /*                         ADD TO WISHLIST                                   */
  /* -------------------------------------------------------------------------- */




     addProductToWishList:(productId,userId)=>{
        return new Promise(async(resolve,reject)=>{
          let details=await db.get().collection(collection.WISHLIST_COLLECTION).findOne({_id:ObjectId(productId)});
           let productObj={
            item:ObjectId(productId),
            quantity:1,
            
          }

          let userWishList=await db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:ObjectId(userId)})
          if(userWishList){
                let productExist=userWishList.products.findIndex(product=> product.item==productId);
                if(productExist!=-1){
                db.get().collection(collection.WISHLIST_COLLECTION)
                .updateOne({user:ObjectId(userId),'products.item':ObjectId(productId)},
                {
                 $inc:{'products.$.quantity':1}
                }
                ).then(()=>{
                  resolve()
                })
            }else{
              db.get().collection(collection.WISHLIST_COLLECTION).updateOne({user:ObjectId(userId)},
              {
  
                  $push:{products:productObj}
  
              }).then((response)=>{
                resolve()
              })
            }

          }else{
             let prodOBJ={
            user:ObjectId(userId),
            products:[productObj]
          }
          db.get().collection(collection.WISHLIST_COLLECTION).insertOne(prodOBJ).then((response)=>{
            resolve()
          })
          }
        
         
          

        })
     },

  /* -------------------------------------------------------------------------- */
  /*                         GET TOTAL AMOUNT                                   */
  /* -------------------------------------------------------------------------- */

     getTotalAmount:(userId)=>{
       
      return new Promise(async(resolve,reject)=>{
        let total=await db.get().collection(collection.CART_COLLECTION).aggregate([
          {
            $match:{user:ObjectId(userId)}
           },
           {
            $unwind:'$products'
           },{
            $project:{
              item:'$products.item',
              quantity:'$products.quantity'
            }
           },
           {
            $lookup:{
              from:collection.PRODUCT_COLLECTION,
              localField:'item',
              foreignField:'_id',
              as:'product'
            }
           },
           {
            $project:{
              item:1,
              quantity:1,
              product:{
                $arrayElemAt:['$product',0]
              }
            }
           },
           {
            $group:{
              _id:null,
              total:{$sum:{$multiply:['$quantity',{'$toInt':'$product.price'}]}}
            }
           }
         
        ]).toArray()
        resolve(total[0]?.total)
      })

     },


 /* -------------------------------------------------------------------------- */
  /*                GET USER ADDRESS AT TEH TIME OF CHEKOUT                     */
  /* -------------------------------------------------------------------------- */



     getUserAddress:(userId)=>{
      return new Promise(async(resolve,reject)=>{
        
        let alladdress=await db.get().collection(collection.USER_COLLECTION).aggregate([
          {
            $match:{_id:ObjectId(userId)}
          },
          {
            $unwind:'$address'
          },
          {
            $project:{
              _id:0,
              address:'$address'
            }
          }
        ]).toArray()
        resolve(alladdress)
      })
     },

     ////////////////////////////---------------------------QUERY FOR GETTING PRICE------------------------------//////////////////////////////

     getProductPrice:(userId)=>{
        return new Promise(async(resolve,reject)=>{
          
        let price=await db.get().collection(collection.CART_COLLECTION).findOne({_id:ObjectId(userId)})
             
        resolve(price)
        })
     },


  /* -------------------------------------------------------------------------- */
  /*                         PLACE ORDER                                        */
  /* -------------------------------------------------------------------------- */
     
     placeOrder:(order,products,totalPrice,user)=>{
      return new Promise(async(resolve,reject)=>{
      
        console.log(totalPrice,"please be amount")
         let status=order['paymentMethod']==='COD'? 'Placed':'Pending';
         products.forEach(products => {
          products.status=status;
         });
         let orderObj={
          deliveryDetails:ObjectId(order['payment-address']),
          userId:ObjectId(order.userId),
          paymentMethod:order['paymentMethod'],
          products:products,
          totalAmount:totalPrice,
          date:new Date(),
          orderDate:moment().format('YYYY-MM-D'),
          orderMonth:moment().format('YYYY-MM'),
          orderYear:moment().format('YYYY'),
          status:status
         }
         if(order.couponcode){
          
          await db.get().collection(collection.COUPON_COLLECTION).updateOne({couponId:order.couponcode},
            {
              $push:{
                Users:ObjectId(order.userId)
              }
            })

         }

         db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
          if(status=='Placed'){
            db.get().collection(collection.CART_COLLECTION).deleteOne({user:ObjectId(order.userId)})
          }
          resolve(response.insertedId)
         })
      })
     },


   /* -------------------------------------------------------------------------- */
  /*                      GET CART  PRODUCTS LIST                                */
  /* -------------------------------------------------------------------------- */

     getCartProductList:(userId)=>{
      return new Promise(async(resolve,reject)=>{
        let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
        resolve(cart.products)
      })
     },

  /* -------------------------------------------------------------------------- */
  /*                         GET ALL ORDERS                                     */
  /* -------------------------------------------------------------------------- */


     getUserOrders:(userId)=>{
      return new Promise(async(resolve,reject)=>{
        let orders=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
          {
            $match:{userId:ObjectId(userId)}
          },
          {
            $lookup:{
              from:collection.ADDRESS_COLLECTION,
              localField:'deliveryDetails',
              foreignField:'_id',
              as:'address'
            }
          },
          {
            $unwind:'$address'
          },
          {
            $sort:{
              date:1
            }
          },
          {
            $project:{
              date:1,
              totalAmount:1,
              products:1,
              paymentMethod:1,
              address: 1, 
              status: 1
            }
          }
        ]).toArray()
        resolve(orders)
      })
     },



     
  /* -------------------------------------------------------------------------- */
  /*                                CANCEL ORDERS                               */
  /* -------------------------------------------------------------------------- */

     updateUserOrderStatus:(cancelUserId)=>{
          return new Promise((resolve,reject)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(cancelUserId)},
            {
              $set:{status:'canceled',Cancel:true}
            })
          }).then((response)=>{
            resolve()
          })
     },







  /* -------------------------------------------------------------------------- */
  /*                               ORDERED PRODUCTS                              */
  /* -------------------------------------------------------------------------- */
    

  getOrderdProducts:(orderId)=>{
    return new Promise(async(resolve,reject)=>{
      let orderedItems=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match:{_id:ObjectId(orderId)}
        },
        {
          $unwind:'$products'
        },
        {
          $project:{
            item:'$products.item',
            quantity:'$products.quantity',
            status:'$products.status',
            cancelled:'$products.cancelled',
          }
        },
        {
           $lookup:{
              from:collection.PRODUCT_COLLECTION,
              localField:'item',
              foreignField:'_id',
              as:'product'
           }
        },
        {
          $project:{
            item:1,
            quantity:1,
            status:1,
            cancelled:1,
            product:{
              $arrayElemAt:['$product',0]
            }
          }
        }
      ]).toArray()
      // console.log(orderedItems)
      resolve(orderedItems)
    })
  },
   
  /* -------------------------------------------------------------------------- */
  /*                       CANCEL ORDERED  PRODUCTS                             */
  /* -------------------------------------------------------------------------- */

  setEachProductStatus:(status,orderId,productId)=>{
       return new Promise((resolve,reject)=>{
        db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderId),"products.item":ObjectId(productId)},
        {
          $set:{
            "products.$.status":status,
            "products.$.cancelled":true,
          }
        })
        resolve(true)
       })
  },

 /* -------------------------------------------------------------------------- */
  /*                        GENERATE RAZORPAY                                   */
  /* -------------------------------------------------------------------------- */

  generateRazorPay:(orderId,total)=>{
    return new Promise((resolve,reject)=>{
          var options = {
            amount:total*100,
            currency: "INR",
            receipt: ""+orderId
        };
         instance.orders.create(options, function (err, order) {
          if(err){
            
            console.log(err)
          }
          else{
            console.log("new order created",order)
           resolve(order)
          }
          
           });

        })
       },

  /* -------------------------------------------------------------------------- */
  /*                      VERIFY RAZORPAY                                       */
  /* -------------------------------------------------------------------------- */     

  verifyPayment:(details)=>{
    return new Promise((resolve,reject)=>{
        const crypto=require('crypto');
        let hmac=crypto.createHmac('sha256','HSVEmxaiCGgagQQe0oMx7whh');

      hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]']);   
      hmac=hmac.digest('hex')
      if(hmac==details['payment[razorpay_signature]']){
        resolve()
      }else{
        reject()
      }    
    })
  },
  
   /* -------------------------------------------------------------------------- */
  /*                         GENERATE PAYPAL                                     */
  /* -------------------------------------------------------------------------- */


  createPaypal:(payment)=>{
   return new Promise((resolve,reject)=>{
    paypal.payment.create(payment, function (error, payment) {
      if (error) {
          reject(error)
      } else {
          console.log("Create Payment Response");
          console.log(payment);
          resolve(payment);
      }
      });
   })
  }, 

  /* -------------------------------------------------------------------------- */
  /*                         SET PAYMENT STATUS                                 */
  /* -------------------------------------------------------------------------- */
  
  changePaymentStatus:(orderId)=>{
    return new Promise(async(resolve,reject)=>{
      let order=await db.get().collection(collection.ORDER_COLLECTION).findOne({_id:ObjectId(orderId)})
      db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderId),"products.status":'Pending'},
      {
        $set:{
          'products.$[].status':'Placed'
        }
      }
      ).then(()=>{
        db.get().collection(collection.CART_COLLECTION).deleteOne({user:ObjectId(order.userId)})
          resolve()
      })
    })
  },

  
   /* -------------------------------------------------------------------------- */
  /*                        DELETE PENDING ORDER                                    */
  /* -------------------------------------------------------------------------- */



  deletePendingOrder:(orderId)=>{
      return new Promise((resolve,reject)=>{
        db.get().collection(collection.ORDER_COLLECTION).deleteOne({_id:ObjectId(orderId)});
        resolve()
      })
  },


   /* -------------------------------------------------------------------------- */
  /*                         COUPON APPLY                                       */
  /* -------------------------------------------------------------------------- */


  applyCoupon:(details, userId, date,totalAmount)=>{
    return new Promise(async(resolve,reject)=>{
      let response={};
      
      let coupon=await db.get().collection(collection.COUPON_COLLECTION).findOne({couponId:details.coupon});
      if(coupon){

        const expDate=new Date(coupon.expDate)
       
        response.couponData = coupon;
       

        let user=await db.get().collection(collection.COUPON_COLLECTION).findOne({couponId:details.coupon,Users:ObjectId(userId)})
         
        if(user){
          
          response.used="Coupon Already Applied"
          resolve(response)
         

        }else{

          if(date <=expDate){

              response.dateValid=true;
              resolve(response);

              let total=totalAmount;

              if(total >= coupon.minAmount){
                
                response.verifyMinAmount=true;
                resolve(response)

                if(total <= coupon.maxdiscount){

                  response.verifyMaxAmount=true;
                  resolve(response)
                }
                else{
                  response.maxAmountMsg="Your Maximum Purchase should be"+ coupon.maxdiscount;
                  response.maxAmount=true;
                  resolve(response)
                }
              }
              else{
                
                response.minAmountMsg="Your Minimum purchase should be"+coupon.minAmount;
                response.minAmount=true;
                resolve(response)
              }   

          }else{
            response.invalidDateMsg = 'Coupon Expired'
            response.invalidDate = true
            response.Coupenused = false

            resolve(response)
            console.log('invalid date');
          }
        }
        
      }else{
        response.invalidCoupon=true;
        response.invalidCouponMsg="Invalid Coupon";
        resolve(response)
      }

      if(response.dateValid && response.verifyMaxAmount && response.verifyMinAmount)
      {
        response.verify=true;
        db.get().collection(collection.CART_COLLECTION).updateOne({user:ObjectId(userId)},
        {
          $set:{
            coupon:ObjectId(coupon._id)
          }  
        })
        resolve(response)
      }
    })
  },


  /* -------------------------------------------------------------------------- */
  /*                        VERIFY  COUPON                                       */
  /* -------------------------------------------------------------------------- */



  couponVerify:(userId)=>{
    return new Promise(async(resolve,reject)=>{

      let userCart= await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
     
      if(userCart.coupon){
          
        let couponData=await db.get().collection(collection.COUPON_COLLECTION).findOne({_id:ObjectId(userCart.coupon)});
       
        resolve(couponData)
      }
      resolve(userCart);
    

    })

  },



  
   /* -------------------------------------------------------------------------- */
  /*                         REMOVE COUPON                                       */
  /* -------------------------------------------------------------------------- */

  removeCoupon:(userId)=>{
    return new Promise(async(resolve,reject)=>{
        await db.get().collection(collection.CART_COLLECTION).updateOne({user:ObjectId(userId)},{
          $unset:{
            coupon:""
          }
        }).then((response)=>{
          resolve(response)
        })
    })
  },

  /* -------------------------------------------------------------------------- */
  /*                         SEARCHED PRODUCTS                                  */
  /* -------------------------------------------------------------------------- */

  
  searchProducts:(productName)=>{
    return new Promise(async(resolve,reject)=>{
      var result= new RegExp(productName,'i');
      let products=await db.get().collection(collection.PRODUCT_COLLECTION).find({name:result}).toArray()
      console.log(products,"product searched")
      if(products.length==0){
        reject({productNotFound:true})
      }else{
        resolve(products)
      }
    })
  },


   /* -------------------------------------------------------------------------- */
  /*                       SET WALLET HISTORY                                   */
  /* -------------------------------------------------------------------------- */


  setWalletHistory:async(user,data,description)=>{
    console.log(data,"heyeheyeheyeeheye t55555555555555555555")
    let value1=parseInt(data.productPrice);
    let quantity=parseInt(data.productQuantity);
    let amount=parseInt(value1*quantity);

    return new Promise(async(resolve,reject)=>{
      let walletDetails;
      walletDetails={
        date:new Date().toDateString(),
        orderId:data.orderId,
        amount:amount,
        description:data.status
      }

      let userDate=await db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectId(user._id)});
      db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(user._id)},{
        $push:{
            walletHistory:walletDetails
        }
      }).then((response)=>{
        resolve(response)
      })
    })
  },


  /* -------------------------------------------------------------------------- */
  /*                        RETURN ORDERED PRODUCT                              */
  /* -------------------------------------------------------------------------- */

  returnOrderedProduct:(orderDetails,user)=>{
    return new Promise(async(resolve,reject)=>{
      await db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderDetails.orderId),"products.item":ObjectId(orderDetails.productId)},{
        $set:{
          "products.$.status":orderDetails.status
        }
      }).then(async()=>{
        let value2=parseInt(orderDetails.productPrice);
        let quantity=parseInt(orderDetails.productQuantity);
        let amount=parseInt(value2*quantity);
        let wallet=parseInt(user.wallet)
         amount=amount+wallet;
          console.log("the returned amount ",amount);

        let data=await db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(user._id)},{
          $set:{
            wallet:amount
          }
        })
      })
    
      resolve({ status: true })
    })
  },



  



  
  
}