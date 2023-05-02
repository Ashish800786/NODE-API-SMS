const jwt = require('jsonwebtoken')

const is_login=async(req,res,next)=>
 {
    const bearer_header=req.headers['authorization']
    if(bearer_header != '' && typeof bearer_header != 'undefined')
    {
        const bearer=bearer_header.split(' ');
        const token=bearer[1]
        req.token=token
        jwt.verify(req.token,'secret_key',async(err,result)=>{
            if(err)
            {
              return res.json({
                'err':err.message
             });
            }else{
                return res.json({
                    'result':result
                })
            }
        }) ;
        next();   
    }else{
        return res.json({
            err:'Token Not Found.'
        });
    }
 }
//  is_logout:async(req,res,next)=>{

//  }
module.exports={
    is_login
}