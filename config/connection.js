const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect=(done)=>{
    const url='mongodb+srv://adharsh:test123@cluster0.jbrekb1.mongodb.net/?retryWrites=true&w=majority'
    const dbname='ecommerce'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    })
   
}


module.exports.get=()=>{
    return state.db
}