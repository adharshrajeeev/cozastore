var productHelper=require('../helpers/product-helpers')
var adminHelper=require('../helpers/admin-helpers')
var userHelper=require('../helpers/user-helpers')




module.exports={



//---------------------------ADMIN LIST ALL PRODUCTS------------------------------//


    adminViewProducts:(req,res)=>{     
        let admin=req.session.admin;
        if(admin){
            productHelper.getAllProducts().then((products)=>{
                console.log(products)
                res.render('admin/admin-viewProducts',{layout:'admin-layout',products})
               })
        }                                        
        else{
            
        }       
    },

//---------------------------ADMIN ADD PRODUCTS------------------------------//

    adminAddProduct:(req,res)=>{   
        let admin=req.session.admin
        if(admin){
            adminHelper.getAllCategories().then((categories)=>{
                res.render('admin/admin-addProduct',{layout:'admin-layout',categories})
            })
        }else{
            res.redirect('/admin') 
        }                                                 
       
        
    },


    adminAddProductIn:(req,res)=>{                                                               
        // console.log(req.body);
        // console.log(req.files.image);
      
        req.body.price=parseInt(req.body.price)
        
        productHelper.addProduct(req.body,(id)=>{
            let image=req.files.image
            let image2=req.files.image2
            let image3=req.files.image3
            let image4=req.files.image4
            console.log(id);
            image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
                image2.mv('./public/product-images2/'+id+'.jpg',(err,done)=>{
                    image3.mv('./public/product-images3/'+id+'.jpg',(err,done)=>{
                        image4.mv('./public/product-images4/'+id+'.jpg',(err,done)=>{
                            if(!err){
                                res.redirect('/products/admin-addProduct')
                            }else{
                                console.log(err);
                            }
                        })
                    })
                })
               
            })   
        })
    },
   
//---------------------------ADMIN DELETE PRODUCTS------------------------------//

adminDeleteProduct:(req,res)=>{
    let productId=req.params.id;
    productHelper.deleteProducts(productId).then((response)=>{
        res.redirect('/products/admin-viewProducts');
    })
},



//---------------------------ADMIN EDIT PRODUCTS------------------------------//

    adminEditProduct:async(req,res)=>{
        let admin=req.session.admin
        if(admin){
            let product=await productHelper.getProductDetails(req.query.id)
            res.render('admin/admin-editProducts',{ layout:'admin-layout',product});
        }else{
            res.render('/admin')
        }
       
        
       
    },


    adminEditProductIn:(req,res)=>{
        req.body.price=parseInt(req.body.price);
        productHelper.updateProduct(req.params.id,req.body).then(()=>{
            console.log(req.params.id);
            let id=req.params.id
            res.redirect('/products/admin-viewProducts')
            if(req.files?.image){
                let image=req.files.image;
                image.mv('./public/product-images/'+id+'.jpg')   
           
            }
        })
    }
    

}