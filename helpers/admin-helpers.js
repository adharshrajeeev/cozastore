var db=require('../config/connection');
var collection=require('../config/collections');
const bcrypt=require('bcrypt');
const { response } = require('express');

var ObjectId=require('mongodb').ObjectId

module.exports={
    
  /* -------------------------------------------------------------------------- */
  /*                                 view Users                                 */
  /* -------------------------------------------------------------------------- */


    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },

  /* -------------------------------------------------------------------------- */
  /*                                 Block Users                                */
  /* -------------------------------------------------------------------------- */
  updateUserStatus:(blockUserId)=>{
     return new Promise((resolve,reject)=>{
      db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(blockUserId)},
      {  

        $set:{isblocked:true}
      })
     }).then((response)=>{
      resolve()
     })
  },

  /* -------------------------------------------------------------------------- */
  /*                                 Un-Block User                              */
  /* -------------------------------------------------------------------------- */

  setUserStatus:(unBlockUserId)=>{
     return new Promise((resolve,reject)=>{
      db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(unBlockUserId)},
      {
        $set:{isblocked:false}
      })
     }).then((response)=>{
     
      resolve()

     })
  },


    
  /* -------------------------------------------------------------------------- */
  /*                                 ADD CATEGORIES                             */
  /* -------------------------------------------------------------------------- */
  addCategory:(categoryName)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.CATEGORY_COLLECTION).insertOne(categoryName).then((data)=>{
        resolve(data.insertedId)
      })
    })
  },


  /* -------------------------------------------------------------------------- */
  /*                                 GET ALL CATEGORIES                         */
  /* -------------------------------------------------------------------------- */

  
  getAllCategories:()=>{
    return new Promise(async(resolve,reject)=>{
      let categories=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
      resolve(categories)
    })

  },
  /* -------------------------------------------------------------------------- */
  /*                                 GET  CATEGORY                              */
  /* -------------------------------------------------------------------------- */
    
  getCategory:(categoryId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:ObjectId(categoryId)}).then((category)=>{
        resolve(category)
      })
    })
  },



  /* -------------------------------------------------------------------------- */
  /*                                 DELETE  CATEGORIES                         */
  /* -------------------------------------------------------------------------- */
  deleteCategories:(categoryId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:ObjectId(categoryId)}).then((response)=>{
        resolve(response)
      })
    })
  },


  /* -------------------------------------------------------------------------- */
  /*                                 EDIT  CATEGORIES                           */
  /* -------------------------------------------------------------------------- */

  editCategory:(categoryId,categoryDetails)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id:ObjectId(categoryId)},{
        $set:{
          category:categoryDetails.category,
          subCategory:categoryDetails.category
        }
      }).then((response)=>{
        resolve()
      })
    })
  },

 
  /* -------------------------------------------------------------------------- */
  /*                                GET ALL USER ORDERS                         */
  /* -------------------------------------------------------------------------- */


  getAlluserOrders:()=>{
    return new Promise(async(resolve,reject)=>{
      let orderList=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $lookup:{
            from:collection.ADDRESS_COLLECTION,
            localField:'deliveryDetails',
            foreignField:'_id',
            as:'address'
          }
        },
        {
          $unwind: '$address'
        },
        {
          $sort:{
            date:-1
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
      console.log(orderList);
      resolve(orderList)
    })
  },



  getProductWiseOrders:(ordersId)=>{
    return new Promise(async(resolve,reject)=>{
      let orderdItems=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match:{_id:ObjectId(ordersId)}
        },
        {
          $unwind:'$products'
        },
        {
          $project:{
            item:'$products.item',
            quantity:'$products.quantity',
            status:'$products.status'

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
            product:{
              $arrayElemAt:['$product',0]
            }
          }
        }
      ]).toArray()
      console.log(orderdItems)
      resolve(orderdItems)
    })
  },

  setDeliveryStatus:(status,orderId,productId)=>{
    return new Promise((resolve,reject)=>{
      if(status == 'Cancelled'){
        db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderId),"products.item":ObjectId(productId)},
        {
          $set:{
            "products.$.status":status,
            "products.$.cancelled":true,
            "products.$.delivered":false
          }
        })
      }else if(status == 'Delivered'){
        db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderId),"products.item":ObjectId(productId)},
        {
          $set:{
            "products.$.status":status,
            "products.$.cancelled":false,
            "products.$.delivered":true
          }
        })
      }
      else{
        db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:ObjectId(orderId),"products.item":ObjectId(productId)},
        {
          $set:{
            "products.$.status":status,
            "products.$.cancelled":false,
            "products.$.delivered":false
          }
        })
      }
      resolve(true)
    })
  },


  /* -------------------------------------------------------------------------- */
  /*                             GET ALL USERS ACTIVE                           */
  /* -------------------------------------------------------------------------- */

  getTotalUsers:()=>{
   return new Promise(async(resolve,reject)=>{
   let totalUsers= await db.get().collection(collection.USER_COLLECTION).aggregate([
      {
       $match:{
         "isblocked":{$in:[false]}
       }
      },
      {
       $project:{
         user:{_id:1}
       }
      },
      {
       $count:'user'
      }
     ]).toArray()
     resolve(totalUsers[0]?.user)
   })
  },

   /* -------------------------------------------------------------------------- */
  /*                             GET ALL SALES                                   */
  /* -------------------------------------------------------------------------- */

  getAllSales:()=>{
    return new Promise(async(resolve,reject)=>{
      let salesData=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $project:{date:1,totalAmount:1}
        },
        {
          $group:{
            _id:{day: { $dayOfYear: { $toDate: "$date" } }},
            totalAmount:{$sum:'$totalAmount'},
            count:{$sum:1}
          }
        },
        {
          $sort:{_id:-1}
        },
        {
          $limit:5
        }
      ]).toArray()
      resolve(salesData[0]?.totalAmount)
    })
  },

   /* -------------------------------------------------------------------------- */
  /*                            GET PROFIT                                      */
  /* -------------------------------------------------------------------------- */

  getPofitdetails:()=>{
    return new Promise(async(resolve,reject)=>{
      let salesData=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match: {
            "products.status": { $nin: ['Cancelled'] }
          }
        },
        {
          $project:{date:1,totalAmount:1}
        },
        {
          $group:{
            _id:{day: { $dayOfYear: { $toDate: "$date" } }},
            totalAmount:{$sum:'$totalAmount'},
            count:{$sum:1}
          }
        },
        {
          $sort:{_id:-1}
        },
        {
          $limit:5
        }
      ]).toArray()
      resolve(salesData[0]?.totalAmount)
    })
  },

  /* -------------------------------------------------------------------------- */
  /*                             GET ALL CATEGORY WISE SALES                    */
  /* -------------------------------------------------------------------------- */

  getCategoryWiseSales:()=>{
    return new Promise((resolve,reject)=>{
      let categoryList=db.get().collection(ORDER_COLLECTION).aggregate([
        {
          $unwind:"$products" /// need to complete  by the week
        },
      
      ])
    })
  },

  /* -------------------------------------------------------------------------- */
  /*                           TOTAL PRODUCT COUNT                              */
  /* -------------------------------------------------------------------------- */

  getAllProductCount:()=>{
    return new Promise(async(resolve,reject)=>{
      let productCount=await db.get().collection(collection.PRODUCT_COLLECTION).find().count()
      resolve(productCount)
    })

  },

  /* -------------------------------------------------------------------------- */
  /*                           TOTAL ORDERS COUNT                               */
  /* -------------------------------------------------------------------------- */


  getTotalOrders:()=>{
    return new Promise(async(resolve,reject)=>{
      let orderCount=await db.get().collection(collection.ORDER_COLLECTION).find().count()
      resolve(orderCount)
    })
  },



  /* -------------------------------------------------------------------------- */
  /*                           SHOW ALL BANNERS                                  */
  /* -------------------------------------------------------------------------- */


  showBanners:()=>{

    return new Promise((resolve,reject)=>{
      let banners=db.get().collection(collection.BANNER_COLLECTION).find().toArray()
      resolve(banners)
    })
  },



  /* -------------------------------------------------------------------------- */
  /*                           ADD BANNERS IN                                   */
  /* -------------------------------------------------------------------------- */


  addBannersIn:(bannerName)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.BANNER_COLLECTION).insertOne(bannerName).then((data)=>{
        resolve(data.insertedId)
      })
    })
  },
 


  /* -------------------------------------------------------------------------- */
  /*                       GET BANNER DETAILS FOR EDIT PAGE                     */
  /* -------------------------------------------------------------------------- */

  getbannerDetails:(id)=>{
      return new Promise(async(resolve,reject)=>{
       let bannerDetails=await db.get().collection(collection.BANNER_COLLECTION).findOne({_id:ObjectId(id)})
       resolve(bannerDetails)
      })
  },


  /* -------------------------------------------------------------------------- */
  /*                      UPDATE BANNER DETAILS                                  */
  /* -------------------------------------------------------------------------- */


  updateBanner:(id,details)=>{
      return new Promise((resolve,reject)=>{
        db.get().collection(collection.BANNER_COLLECTION).updateOne({_id:ObjectId(id)},{
          $set:{
              name:details.name,
              title:details.title
          }
        }).then((response)=>{
          resolve()
        })
      })
  },


   /* -------------------------------------------------------------------------- */
  /*                      ADD COUPONS                                            */
  /* -------------------------------------------------------------------------- */


  addCouponsIn:(data)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.COUPON_COLLECTION).insertOne(data).then(()=>{
        resolve()
      })
    })
  },


   /* -------------------------------------------------------------------------- */
  /*                      GET ALL COUPONS                                       */
  /* -------------------------------------------------------------------------- */

  getAllCoupons:()=>{
   return new Promise(async(resolve,reject)=>{
    let coupons=await db.get().collection(collection.COUPON_COLLECTION).find().toArray()
    resolve(coupons)
   })
  },


   /* -------------------------------------------------------------------------- */
  /*                      GET DAILY SALES GRAPH                                 */
  /* -------------------------------------------------------------------------- */


  getDailySalesGraph:()=>{
    return new Promise(async(resolve,reject)=>{
        let sales=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
          {
            $project: { date: 1, totalAmount: 1 }
        },
         
          {
            $group:{
              _id: {$dateToString: {format: "%Y-%m-%d",date:"$date"}},
              totalAmount: { $sum: '$totalAmount' },
              count: { $sum: 1 }
            }
          },
          {
            $sort:{
              _id:1
            }
          },
          {
            $limit:7
          }
        ]).toArray()
        resolve(sales)
    })
  },


   /* -------------------------------------------------------------------------- */
  /*                      GET MONTHLY SALES GRAPH                                */
  /* -------------------------------------------------------------------------- */

  getMonthlySalesGraph:()=>{
    return new Promise(async(resolve,reject)=>{
      let sales=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $project: { date: 1, totalAmount: 1 }
      },
       
        {
          $group:{
            _id: {$dateToString: {format: "%Y-%m",date:"$date"}},
            totalAmount: { $sum: '$totalAmount' },
            count: { $sum: 1 }
          }
        },
        {
          $sort:{
            _id: 1
          }
        },
        {
          $limit:7
        }
      ]).toArray()
      resolve(sales)
    })
  },


  /* -------------------------------------------------------------------------- */
  /*                      GET YEARLY SALES GRAPH                                */
  /* -------------------------------------------------------------------------- */

  getYearlySalesGraph:()=>{
    return new Promise(async(resolve,reject)=>{
      let sales=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $project: { date: 1, totalAmount: 1 }
      },
       
        {
          $group:{
            _id: {$dateToString: {format: "%Y",date:"$date"}},
            totalAmount: { $sum: '$totalAmount' },
            count: { $sum: 1 }
          }
        },
        {
          $sort:{
            _id: 1
          }
        },
        {
          $limit:7
        }
      ]).toArray()
      resolve(sales)
    })
  },


   /* -------------------------------------------------------------------------- */
  /*                      GET DALIY SALES REPORT                                */
  /* -------------------------------------------------------------------------- */


  getDailySalesReport:(Fromdate,todate)=>{
    return new Promise(async(resolve,reject)=>{
      let dailyReport=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        
        {
          $match: { orderDate: {$gte:Fromdate,$lte:todate}} 
        },
        
       {
        $project:{
          _id:0,
          totalAmount:1,
          products:1,
          orderDate:1
        }
       },
       {
        $unwind:'$products'
       },
       
       {
        $group:{
          _id:'$products.productName',
          totalAmount:{$sum:'$totalAmount'},
          totals:{$sum:'$totalAmount'},
          Quantity:{$sum:'$products.quantity'}
        }
       },
      ]).toArray();
    
      resolve(dailyReport)
    })
  },


  
   /* -------------------------------------------------------------------------- */
  /*                     GET MONTHLY SALES REPORT                                */
  /* -------------------------------------------------------------------------- */

  getMonthlySalesReport:(month)=>{
    return new Promise(async(resolve,reject)=>{
      let monthlyReport=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match: { orderMonth:month} 
        },
        
       {
        $project:{
          _id:0,
          totalAmount:1,
          products:1,
          orderDate:1
        }
       },
       {
        $unwind:'$products'
       },
       
       {
        $group:{
          _id:'$products.productName',
          totalAmount:{$sum:'$totalAmount'},
          Quantity:{$sum:'$products.quantity'}
        }
       }, 
      ]).toArray();
      resolve(monthlyReport)
    })
  },


  /* -------------------------------------------------------------------------- */
  /*                     GET YEARLY SALES REPORT                                */
  /* -------------------------------------------------------------------------- */



  getYearlySalesReport:(year)=>{
    return new Promise(async(resolve,reject)=>{
      let yearlyReport=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $match: { orderYear:year} 
        },
        
       {
        $project:{
          _id:0,
          totalAmount:1,
          products:1,
          orderDate:1
        }
       },
       {
        $unwind:'$products'
       },
       
       {
        $group:{
          _id:'$products.productName',
          totalAmount:{$sum:'$totalAmount'},
          Quantity:{$sum:'$products.quantity'}
        }
       }, 
      ]).toArray();
      resolve(yearlyReport)
    })
  },


  getPaymentWiseDetails:()=>{
    return new Promise(async(resolve,reject)=>{
      let details=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
        {
          $group:{
            _id:"$paymentMethod",
         
            count:{ $sum: 1}
          }
        },

      ]).toArray();
      resolve(details)
    })
  },



  /* -------------------------------------------------------------------------- */
  /*                    ADD CATEGORY OFFER                                      */
  /* -------------------------------------------------------------------------- */

  addCategoryOffer:({category,offerPercentage,expDate})=>{
    let categoryOffer=parseInt(offerPercentage);
    offer=categoryOffer;
    
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.CATEGORY_COLLECTION).updateOne({category:category},{
        $set:{
          offer:offer,
          ExpiryDate:expDate,
          offerApply:true
        }
      },{upsert:true}).then(()=>{
        resolve(category)
      })
    })
  },




  getProductForOffer:(category)=>{
    return new Promise(async(resolve,reject)=>{
      let products=await db.get().collection(collection.PRODUCT_COLLECTION).find({category:category}).toArray()
      resolve(products)
    })
  },



  addOfferToProduct:({category,offerPercentage},product)=>{
  
    let offerP=parseInt(offerPercentage);
    offerPercentage=offerP;
    let productPricee=parseInt(product.price);
    product.price=productPricee;

    let offerPrice=(offerPercentage/100)*product.price;
    let totalPrice=product.price-offerPrice;

    return new Promise((resolve,reject)=>{
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:product._id,category:category},
        {
          $set:{
            discountPercentage:offerPercentage,
            categoryDiscount:offerPrice,
            price:totalPrice,
            originalPrice:product.price
          }
        }).then(()=>{
          resolve()
        })
    })

    
  },

  /* -------------------------------------------------------------------------- */
  /*                    DELETE CATGORY OFFER                                    */
  /* -------------------------------------------------------------------------- */



  deleteCategoryOffer:({categoryId})=>{
    return new Promise(async(resolve,reject)=>{
      let category=await db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:ObjectId(categoryId)});
      db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id:ObjectId(categoryId)},
      {
        $unset:{
          ExpiryDate:category.ExpiryDate,
          offer:category.offer,
          offerApply:category.offerApply
        }
      }).then(async()=>{
        let product=await db.get().collection(collection.PRODUCT_COLLECTION).find({category:category.category}).toArray();
        db.get().collection(collection.PRODUCT_COLLECTION).updateMany({category:category.category},
          {
            $unset:{
              categoryDiscount:product.categoryDiscount,
              discountPercentage:product.discountPercentage,
              price:product.price
            }
          }).then(()=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateMany({category:category.category},
              {
                $rename:{
                  originalPrice:'price'
                }
              })
              resolve();
          })
      })
    })
  },


  
  /* -------------------------------------------------------------------------- */
  /*                    DELETE COUPON                                            */
  /* -------------------------------------------------------------------------- */


  deleteCoupon:(couponId)=>{
    return new Promise(async(resolve,reject)=>{
      db.get().collection(collection.COUPON_COLLECTION).deleteOne({_id:ObjectId(couponId)}).then((response)=>{
        resolve(response)
      })
    })
  },


   /* -------------------------------------------------------------------------- */
  /*                   GET COUPON DETAILS                                       */
  /* -------------------------------------------------------------------------- */

  getCouponDetails:(couponId)=>{
    return new Promise(async(resolve,reject)=>{
      let couponDetails=await db.get().collection(collection.COUPON_COLLECTION).findOne({_id:ObjectId(couponId)})
      resolve(couponDetails)
    })
  },

  
   /* -------------------------------------------------------------------------- */
  /*                  UPDATE COUPONS In                                       */
  /* -------------------------------------------------------------------------- */



  updateCouponIn:(couponId,data)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.COUPON_COLLECTION).updateOne({_id:ObjectId(couponId)},{
      $set:{
          couponName:data.couponName,
        couponId:data.couponId,
        maxdiscount:data.maxdiscount,
        minAmount:data.minAmount,
        expDate:data.expDate,
        couponPercentage:data.couponPercentage
      }
      }).then((response)=>{
        resolve();
      })
    })
  }




}