
var adminHelper=require('../helpers/admin-helpers')

const user = require('./user');
const collections = require('../config/collections');
const moment=require('moment')
const adminId="admin@gmail.com";
const passwordId="1234"

module.exports={

//------------------------------------- ADMIN SIGNUP ------------------------------------//

    adminSignup:async(req,res)=>{
      let admin=req.session.admin;
      if(admin){
         res.redirect('/admin/adminLogin');
      }else{
        
          console.log(user)
          res.render('admin/adminLogin',{layout:null,"adminLoginError":req.session.adminLoginError})

         req.session.adminLoginError=false;
         
      }
        
    },

//------------------------------------ ADMIN LOGIN ------------------------------------//

    adminLogin:async(req,res)=>{
      let adminId=req.session.admin
      if(adminId){
         let TotalUsers= await adminHelper.getTotalUsers()
         
         let salesData=await adminHelper.getAllSales()
         let totalProducts=await adminHelper.getAllProductCount()
         let totalOrders=await adminHelper.getTotalOrders()

         let daily=await adminHelper.getDailySalesGraph();
         let monthly=await adminHelper.getMonthlySalesGraph();
         let yearly=await adminHelper.getYearlySalesGraph();

         let paymentmode=await adminHelper.getPaymentWiseDetails()

         let profit=await adminHelper.getPofitdetails()
         console.log(profit,"this is profit")
         
         res.render('admin/admin-dashboard',{layout:'admin-layout',TotalUsers,salesData,
        totalProducts,totalOrders,daily,monthly,yearly,paymentmode,profit});
      }
      else{
         res.redirect('/admin');
      }
     
    },

    adminLoggedIn:(req,res)=>{

       let adminData={email,password}=req.body;
       if(adminId===email && passwordId===password){
         req.session.adminLoggedIn=true;
         req.session.admin=adminData;
         res.redirect('/admin/adminLogin')
       }else{
         req.session.adminLoginError="Invalid adminId and Password";
         res.redirect('/admin');
       }
    },


   logout:(req,res)=>{
      req.session.admin=null;
      req.session.adminLoggedIn=false
      res.redirect('/admin');
   },


//----------------------------- ADMIN GET USER LIST MANAGEMENT--------------------------------//
                                

     userList:(req,res)=>{
      let admin=req.session.admin
      if(admin){
         adminHelper.getAllUsers().then((users)=>{ 
            
            res.render('admin/admin-viewUser',{layout:'admin-layout',users})
         })
      }else{
         res.redirect('/admin')
      }
        
     },



 //---------------------------- ADMIN BLOCK USER ---------------------------------------------//
                                                      

     blockUser:(req,res)=>{
        let blockUserId=req.query.id
        adminHelper.updateUserStatus(blockUserId)
        res.redirect('/admin/userList')
     },


//---------------------------- ADMIN UNBLOCK USER ---------------------------------------------//

 UnBlockUser:(req,res)=>{
   let unBlockUserId=req.query.id
   adminHelper.setUserStatus(unBlockUserId)
   res.redirect('/admin/userList')
},



//---------------------------- ADMIN DISPLAY CATEGORY LIST---------------------------------------------//
 

  getCategory:(req,res)=>{
     let admin=req.session.admin
     if(admin){
      adminHelper.getAllCategories().then((categories)=>{
         res.render('admin/admin-ViewCategory',{layout:'admin-layout',categories});
        
        })
        
     }
     else{
      res.redirect('/admin')
     }
     
  },


//---------------------------- ADMIN ADD CATEGORIES PAGE---------------------------------------------// 

  addCategory:(req,res)=>{
   let admin=req.session.admin
   if(admin){
      res.render('admin/admin-addCategories',{layout:'admin-layout'})
   }else{
      res.redirect('/admin')
   }
   
  },


//---------------------------- ADMIN ADD CATEGORIES INN---------------------------------------------//  
   
addCategoryIn:(req,res)=>{
   adminHelper.addCategory(req.body).then((id)=>{
    let name=id;
      req.files?.image.mv('./public/category-images/'+name+'.jpg',(err,done)=>{
         if(!err){
            res.redirect('/admin/addCategories')
         }else{
            console.log(err);
         }
      })
   
     
   })
},


//---------------------------- ADMIN UPDATE CATEGORIES INN---------------------------------------------//   

editCategory:async(req,res)=>{
   let admin=req.session.admin
   if(admin){
      let categoryList=await adminHelper.getCategory(req.query.id)
   res.render('admin/admin-editCategory',{layout:'admin-layout',categoryList})
   }else{
      res.redirect('/admin')
   }


},


editCategoryIn:(req,res)=>{
   adminHelper.editCategory(req.params.id,req.body).then(()=>{
      let id=req.params.id;
      res.redirect('/admin/getCategory')
   })
 },
   

 /*-------------------------------------------------------------------*/
 /*                            DELETE CATEGORY                        */
 /*-------------------------------------------------------------------*/

deleteCategory:(req,res)=>{
   let categoryId=req.params.id
   adminHelper.deleteCategories(categoryId).then((response)=>{
      res.redirect('/admin/getCategory')
   })
},

 
 /*-------------------------------------------------------------------*/
 /*                          VIEW ALL ORDERS                          */
 /*-------------------------------------------------------------------*/
 
 ViewAllUserOrders:(req,res)=>{
   adminHelper.getAlluserOrders().then((ordersList)=>{
      res.render('admin/ViewOrdersList',{layout:'admin-layout',ordersList})
   })
   
 },

  /*-------------------------------------------------------------------*/
 /*                     VIEW PRODUCTS ORDERS                          */
 /*-------------------------------------------------------------------*/
 

 adminProductWiseOrders:async(req,res)=>{
   let products=await adminHelper.getProductWiseOrders(req.params.id)
   res.render('admin/VieworderedProducts',{layout:'admin-layout',products})
 },


 /*-------------------------------------------------------------------*/
 /*                     SET ORDERD PRODUCT STATUS                     */
 /*-------------------------------------------------------------------*/
 


 setPorductOrderStatus:(req,res,next)=>{
   let status=req.body.status;
   let orderId=req.body.orderId;
   let productId=req.body.productId
   adminHelper.setDeliveryStatus(status,orderId,productId).then((response)=>{
      if(response){
         res.json({status:true})
      }
      else{
         res.json({status:false})
      }
   })
  
 },

/*-------------------------------------------------------------------*/
 /*                     ADMIN SHOW BANNERS                             */
 /*-------------------------------------------------------------------*/

 viewAdminBanners:async(req,res)=>{
   let banners=await adminHelper.showBanners()
   res.render('admin/showBanners',{layout:'admin-layout',banners})
},

/*-------------------------------------------------------------------*/
 /*                     ADMIN ADD BANNERS FORM                       */
 /*-------------------------------------------------------------------*/


 addBanners:(req,res)=>{
   res.render('admin/admin-addBanners',{layout:'admin-layout'})
 },


 /*----------------------------------------------------------------- --*/
 /*                     ADMIN ADD BANNERS IN                           */
 /*-------------------------------------------------------------------*/



 postBannerIn:(req,res)=>{
   adminHelper.addBannersIn(req.body).then((id)=>{
      let name=id;
        req.files?.image.mv('./public/banner-images/'+name+'.jpg',(err,done)=>{
           if(!err){
              res.redirect('/admin/addBanners')
           }else{
              console.log(err);
           }
        })
       
     })
 },

/*----------------------------------------------------------------- --*/
 /*                   GET EDIT BANNER PAGE                            */
 /*-------------------------------------------------------------------*/




 geteditBannerPage:async(req,res)=>{
   let bannerDetails=await adminHelper.getbannerDetails(req.query.id)
   res.render('admin/admin-editBanners',{layout:'admin-layout',bannerDetails})
 },


 /*----------------------------------------------------------------- --*/
 /*                UPDATE BANNER DETAILS                                */
 /*-------------------------------------------------------------------*/



 postEditBannerDetails:(req,res)=>{
      adminHelper.updateBanner(req.params.id,req.body).then(()=>{
         let id=req.params.id
         res.redirect('/admin/viewBanners')
         if(req.files?.image){
            let image=req.files?.image;
            image.mv('./public/banner-images/'+id+'.jpg')  
         }
      })
 },


 /*----------------------------------------------------------------- --*/
 /*                SHOW COUPONS PAGE                                   */
 /*-------------------------------------------------------------------*/



 showCouponsPage:async(req,res)=>{
   let coupons=await adminHelper.getAllCoupons()
   res.render('admin/showCoupons',{layout:'admin-layout',coupons})
 },


/*----------------------------------------------------------------- --*/
 /*                SHOW ADD COUPONS PAGE                              */
 /*-------------------------------------------------------------------*/

 addCoupons:(req,res)=>{
  
   
   res.render('admin/admin-addCoupons',{layout:'admin-layout'})

 },


 /*----------------------------------------------------------------- --*/
 /*                ADD COUPONS IN                                      */
 /*-------------------------------------------------------------------*/

 postCoupons:(req,res)=>{
   adminHelper.addCouponsIn(req.body).then(()=>{
      console.log(req.body,"HEY THIS IS THE COUPON DAATA")
      res.redirect('/admin/addCoupons')
   })
 },


 /*----------------------------------------------------------------- --*/
 /*               SALES REPORT PAGE                                     */
 /*-------------------------------------------------------------------*/

 getAdminSalesReport:async(req,res)=>{

   let dailyReport=await adminHelper.getDailySalesReport()
   let monthlyReport=await adminHelper.getMonthlySalesReport()
   let yearlyReport=await adminHelper.getYearlySalesReport()
      res.render('admin/admin-salesReport',{layout:'admin-layout',dailyReport,monthlyReport,yearlyReport})
 },

 /*----------------------------------------------------------------- --*/
 /*              DAILY SALES REPORT POST                                     */
 /*-------------------------------------------------------------------*/


 getAdminDailySalesReport:async(req,res)=>{
   day=req.body.day;
   todate=req.body.toDay;
  
   let dailySales=await adminHelper.getDailySalesReport(day,todate);
   res.render('admin/admin-salesReport',{layout:'admin-layout',dailySales})
 },


 getAdminMonthlySalesReport:async(req,res)=>{
   let months=req.body.year+"-"+req.body.month;
   console.log(months)
   let monthlySales=await adminHelper.getMonthlySalesReport(months);
   console.log(monthlySales)
   res.render('admin/admin-salesReport',{layout:'admin-layout',monthlySales})
 },


 getAdminYearlySalesReport:async(req,res)=>{
   let year=req.body.year;
   let yearlySales=await adminHelper.getYearlySalesReport(year);
   res.render('admin/admin-salesReport',{layout:'admin-layout',yearlySales})
 },


 /*----------------------------------------------------------------- --*/
 /*              OFFER MANAGEMENT                                       */
 /*-------------------------------------------------------------------*/


 getOffersList:async(req,res)=>{
   let offersList=await adminHelper.getAllCategories();
   adminHelper.getAllCategories().then((categories)=>{
      res.render('admin/viewOffers',{layout:'admin-layout',categories,offersList})
   })
   
 },


 /*----------------------------------------------------------------- --*/
 /*             ADD CATEGORY OFFER                                     */
 /*-------------------------------------------------------------------*/

 addCatgeoryOffer:(req,res)=>{

   adminHelper.addCategoryOffer(req.body).then((category)=>{
      
      adminHelper.getProductForOffer(category).then((products)=>{
         products.forEach(element=>{
            
            adminHelper.addOfferToProduct(req.body,element)
         });
         res.redirect('/admin/viewOffers')
      }).catch((error)=>{
         console.log(error)
         res.render('404',{layout:null})
      })
   }).catch((error)=>{
      console.log(error)
      res.render('404',{layout:null})
   })
 }

}    
