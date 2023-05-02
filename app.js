require('dotenv').config();
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const authRouter= require('./Routes/authRouter')
const nodemailer= require('nodemailer')
// const multer = require('multer')
// // const  upload = multer({ dest: './public/uploads/' })
// const storage=multer({
//     // dest:'./public/uploads/',
//     dest:function(req,file,cb){
//         cb(null,'./public/uploads/')
//     },
//     filename:function(req,file,cb){
//         const uniqueSfx=date.now();
//         cb(null,file.filename+'-'+uniqueSfx)
//     }
// });

// const upload=multer({storage:storage});

app.get('/',(req,res)=>{
   return res.send('Welcome To the Node Js Api');

});

app.get('/api',function(req,res){
    return res.json({
        'name':'Ashish',
        'Project':'Node Api',
    });
});


app.get('/api/create_jwt',function(req,res){
    user={
        'name':'Ashish',
        'Project':'Node Api',
    }
    jwt.sign(user,'secret_key',{expiresIn:'500s'},(error,token)=>{
        if(error)
        {
            console.log(error.message)
        }else{

            console.log({token})
            res.json({token})
        }

    })
});

app.use('/api/user/',authRouter);


app.get('/api/check_jwt',verify_jwt,function(req,res){
    console.log('req.token')
    console.log(req.token)
    jwt.verify(req.token,'secret_key',(error,auth_data)=>{
        if(error)
        {
            console.log(error.message)
            res.json({
                err:error.message
            });
        }else
        {

            console.log({auth_data})
            res.json({auth_data})
        }
    })
});



// middleware 
function verify_jwt(req,res,next)
{
    console.log(req.headers)
    const bearer_header=req.headers['authorization'];
    if (bearer_header == '' || typeof bearer_header == 'undefined')
    {
        res.json({
            err:'Token Not Found.'
        }) 
    }else
    {
        const bearer=bearer_header.split(' ')
        const token=bearer[1];
        console.log('token')
        console.log(bearer)
        req.token=token
        next();
    }
}


app.listen(process.env.PORT,(err,res)=>{
    if( err){
        console.log(err.message)
    }else{
        console.log('Your Server Started : 7000')
    }

})