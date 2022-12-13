var db=require('../config/connection');
var collection=require('../config/collections');
var ObjectId=require('mongodb').ObjectId
module.exports={

  /* -------------------------------------------------------------------------- */
  /*                           ADD PRODUCTS                                     */
  /* -------------------------------------------------------------------------- */

    addProduct:(product,callBack)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
          callBack(data.insertedId)
        })
    },

  /* -------------------------------------------------------------------------- */
  /*                                LIST ALL PRDUCTS                            */
  /* -------------------------------------------------------------------------- */

    getAllProducts:()=>{
      return new Promise(async(resolve,reject)=>{
       let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
       resolve(products)
      })
   },
    
  /* -------------------------------------------------------------------------- */
  /*                                 DELETE PRODUCTS                            */
  /* -------------------------------------------------------------------------- */

    deleteProducts:(productId)=>{
      return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(productId)}).then((response)=>{
         
          resolve(response)
        })
      })
    },
   
  /* -------------------------------------------------------------------------- */
  /*                                GET PRODUCT DETAILS                         */
  /* -------------------------------------------------------------------------- */  


    getProductDetails:(productId)=>{
       return new Promise((resolve,reject)=>{
          db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(productId)}).then((product)=>{
             resolve(product)
          })
       })
    },
   

  /* -------------------------------------------------------------------------- */
  /*                         GET CATEGORY WISE PRODUCT DETAILS                  */
  /* -------------------------------------------------------------------------- */    



    getCategoryWiseProducts:(categoryId)=>{
      return new Promise(async(resolve,reject)=>{
        let categoryDetails=await db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:ObjectId(categoryId)})
        // console.log(categoryDetails)
        let products=await db.get().collection(collection.PRODUCT_COLLECTION).find({category:categoryDetails.category}).toArray()
        // console.log(products,"heyy")
        resolve(products)
      })
    },



  /* -------------------------------------------------------------------------- */
  /*                                UPDATE PRODUCTS                             */
  /* -------------------------------------------------------------------------- */

    updateProduct:(productId,productDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(productId)},{
                $set:{
                    name: productDetails.name,
                    description: productDetails.description,
                    price: productDetails.price,
                    category: productDetails.category
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
}