var express = require('express');
var router = express.Router();
const { adminViewProducts,adminAddProduct,adminAddProductIn,adminEditProduct,adminDeleteProduct,adminEditProductIn }=require('../controllers/products')


router.get('/admin-viewProducts',adminViewProducts);
router.get('/admin-addProduct',adminAddProduct)
router.post('/admin-addProduct',adminAddProductIn)
router.get('/edit-product/',adminEditProduct)
router.post('/admin-editProduct/:id',adminEditProductIn)
router.get('/delete-product/:id',adminDeleteProduct)


module.exports = router;