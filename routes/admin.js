var express = require('express');
var router = express.Router();
const {adminSignup,adminLogin,userList,getCategory,addCategory,addCategoryIn,editCategory,editCategoryIn,deleteCategory,
    logout,adminLoggedIn,blockUser,UnBlockUser,ViewAllUserOrders,adminProductWiseOrders,setPorductOrderStatus,
    viewAdminBanners,addBanners,postBannerIn,geteditBannerPage,postEditBannerDetails,showCouponsPage,addCoupons,postCoupons,
    getAdminSalesReport,getAdminDailySalesReport,getAdminMonthlySalesReport,getAdminYearlySalesReport,getOffersList,
    addCatgeoryOffer}=require('../controllers/admin')


router.get('/',adminSignup);
router.get('/adminlogin',adminLogin);
router.post('/adminLogin',adminLoggedIn)
router.get('/userList',userList)
router.get('/getCategory',getCategory)
router.get('/addCategories',addCategory)
router.post('/addCatogories',addCategoryIn)
router.get('/editCategories',editCategory)
router.post('/editCategories/:id',editCategoryIn)
router.get('/deleteCategory/:id',deleteCategory)
router.get('/blockUser',blockUser)
router.get('/unBlockUser',UnBlockUser)
router.get('/logout',logout)
router.get('/adminproductOrders/:id',adminProductWiseOrders)


router.get('/ViewAllOrders',ViewAllUserOrders)
router.post('/orderedProductStatus',setPorductOrderStatus)
router.get('/viewBanners',viewAdminBanners)
router.get('/addBanners',addBanners)
router.post('/admin-addBanners',postBannerIn)
router.get('/edit-banner',geteditBannerPage)
router.post('/postEditBanner/:id',postEditBannerDetails)

router.get('/viewCoupons',showCouponsPage)
router.get('/addCoupons',addCoupons)
router.post('/admin-addCoupon',postCoupons)
router.get('/salesReport',getAdminSalesReport)



router.post('/admin-dailysales',getAdminDailySalesReport)
router.post('/admin-monthlySales',getAdminMonthlySalesReport)
router.post('/admin-yearlySales',getAdminYearlySalesReport)

router.get('/viewOffers',getOffersList)
router.post('/admin-addCategoryOffer',addCatgeoryOffer)
module.exports = router;
    