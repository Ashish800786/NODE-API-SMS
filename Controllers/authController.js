const pool= require('../database')
const res=require('express/lib/response')
const bcrypt = require('bcrypt')
// const validation= require('../Helpers/validator')
const validator= require('node-input-validator');
var passwordValidator = require('password-validator');
const jwt=require('jsonwebtoken')

const nodemailer= require('nodemailer');
const { query } = require('express');
const Validator = require('validatorjs');

const send_mails=(req,body_text="<h1>Hello this is email varification email</h1>",to_email='ashishkingyadav786@gmail.com',subject='Email varification.')=>{
    // const transpoter=nodemailer.createTransport({
    // //    service: 'gmail',
    //     host:'smtp.gmail.com',
    //     port:587,
    //     secure:false,
    //     requireTLS:true,
    //     tls: {rejectUnauthorized: false},
    //     auth:{
    //             user:'ashishyadav800786@gmail.com',
    //             pass:"arhiuusztufljbut"
    //         }
    // });

    var transpoter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "6ee40fe244ddf7",
          pass: "d1c25231219ecc"
        }
      });

    const mailOptions={
        from:'ashishyadav800786@gmail.com',
        to:'ashishkingyadav786@gmail.com',
        subject:'subject',
        // text:"",
        html:'body_text',
    }

    console.log('Mail Sending......');
    console.log('From: ashishyadav800786@gmail.com');
    console.log('To:'+to_email);
    console.log('SUbject:'+subject);
    console.log('body:'+body_text);


    transpoter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


    // transport.sendMail(mailOptions,(error,info)=>{
    //     if(error){
           
    //         console.log('Mail Failed!'+error)
    //         //  res.josn({'error':error.message});
    //     }else
    //     {
    //         console.log('Mail Sent......'+info.response)
    //         // return res.json({'Mail Sent: ':info.response});
    //     }

    // });

}






module.exports={
     register : async(req,res)=>{
        try{
            const first_name=req.body.first_name
            const last_name=req.body.last_name
            const username=req.body.username
            const email=req.body.email
            const password=req.body.password
            const c_password=req.body.c_password
            var schema = new passwordValidator();

            // Add properties to it
            schema
            .is().min(8,'Minimum length 8')                                    // Minimum length 8
            .is().max(100)                                  // Maximum length 100
            .has().uppercase()                              // Must have uppercase letters
            .has().lowercase()                              // Must have lowercase letters
            .has().digits(2)                                // Must have at least 2 digits
            .has().not().spaces()                           // Should not have spaces
            .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

            const passwrod_validator=schema.validate(password)
            if(!passwrod_validator)
            {
                const passwrod_validator_message=schema.validate(password,{ details: true })
                return res.status(403).send(passwrod_validator_message)
            }

            const v = new validator.Validator(req.body, {
                first_name: 'required|maxLength:15',
                last_name: 'required|maxLength:15',
                username: 'required|maxLength:15',
                email: 'required|email',
                password: 'required',
                c_password: 'required|same:password'
              });

              validator.addCustomMessages({
                'first_name.required': 'Phla naam bharo.',
                'first_name.email': 'Email bharo.',
                'first_name.maxLength': 'Naam 15 charactor s jyada nhi hona chahiya..',
                'last_name': 'Last Naam bharo..',
                'last_name.maxLength': 'Naam 15 charactor s jyada nhi hona chahiya..',
                'username': 'User Naam bharo..',
              });
              v.check().then((matched) => {
                if (!matched) 
                {
                 return  res.status(422).send(v.errors);
                }else{
                    if(email)
                    {
                    if(password)
                    {
                        if(password==c_password)
                        {
                            hash_pass=bcrypt.hashSync(password,10)
                            query=`INSERT INTO users(first_name,last_name,user_name,email,password) VALUES(?,?,?,?,?)`;
                            data_arr=[
                                first_name,
                                last_name,
                                username,
                                email,
                                hash_pass,
                            ]
                            pool.query(query,data_arr,async(err,result)=>{
                                if(err)
                                {
                                    return res.json({
                                            'err':err.message
                                        })
                                }else{
                                    send_mails(req,"<h1>Hello this is email varification email For Ashish</h1>",'ashishkingyadav786@gmail.com','Email varification. Ashish')
                                   return res.json({
                                        result:result,
                                        'msg':'Your Registration is sccessfull. Please varify Your email.'
                                    });
                                }
                            });
                        }else{
                            return res.json({
                                'err':'Password and confirm password did not matched.'
                            });
                        }
                    }else
                    {
                        return res.json({
                            'err':'Password required.'
                        });
                    }
                }else
                {
                    return res.json({
                        'err':'Email is required.'
                    });
                }
                }
              });
        }catch(error)
        {
          return res.json({
            'err':error.message
          });
        }
    }
    ,

    login:async(req,res)=>{
        try{
        const email= req.body.email
        const password= req.body.password
        var schema = new passwordValidator();
        schema
        .is().min(8,'password should be Minimum 8 charactors')
        .is().max(100)
        .has().uppercase()
        .has().lowercase()
        .has().digits(2)
        .has().not().spaces()
        .is().not().oneOf(['Passw0rd', 'Password123'])
        

        const v=new validator.Validator(req.body,
            {
            email:'required|email',
            password:'required|minLength:8|maxLength:100'
           }
        )

        validator.addCustomMessages({
            'email.required':'Email required.',
            'password.required':'Password required.'
        })

        v.check().then((matched)=>{
            if(!matched)
            {
                return res.json({
                    'err':v.errors
                })
            }else
            {
                if(schema.validate(password))
                {
                            const query=`select * from users where email=?`;
                            pool.query(query,[email],async function(err,result){
                                if(err)
                                {
                                    return res.json({
                                        'err':err.message
                                    });
                                }else
                                {
                                    console.log(result)
                                    console.log(JSON.stringify(result[0]));
                                    const user_password=result[0].password
                                    if(bcrypt.compareSync(password,user_password))
                                    {
                                        const users=JSON.stringify(result[0])
                                        jwt.sign(JSON.parse(users),'secret_key',{expiresIn:'500s'},function(error,token){
                                            if(error)
                                            {
                                                return res.json({
                                                    'err':error.message
                                                });
                                            }else
                                            {
                                                return res.json({toekn:token});
                                            }
                                        })
                                    }else
                                    {
                                        return res.json({
                                            err:'Password is not correct.'
                                        });
                                    }
                                }
                            });
                }
                else{
                    return res.json({
                        'err':schema.validate(password,{ details: true })
                    });
                }
            }
        });
        }catch(error)
        {
           return res.json({
            'err':error.message
           });
        }
    }
    ,
    all_users:async(req,res)=>{
        try{
           query=`select * from users`;
           pool.query(query,null,function(error,result){
            if(error)
            {
                return res.json({
                    'err':error.message
                });
            }else
            {
                return res.json({
                    'users':result
                });
            }
           })
        }catch(err)
        {
            return res.json({
                'err':err.message
            });
        }
    },
    userById:async(req,res)=>{
        try{
            const id=req.params.id
            const query='select * from users where id = ?';
            pool.query(query,[id],(error,result)=>{
                if(error)
                {
                    return res.json({
                        'error':error.message
                    });
                }else
                {
                    return res.json({
                        'users':result
                    });
                }
            })
        }catch(error)
        {
            return res.json({
                'err':error.message
            });
        }
    },
    userUpdate:async(req,res)=>{
        try{
            const first_name= req.body.first_name
            const last_name=req.body.last_name
            const id= req.params.id

            const v=new validator.Validator(req.body,({
                first_name:'required|minLength:3|maxLength:50',
                last_name:'required|minLength:3|maxLength:50'
            }))
            validator.addCustomMessages({
               'first_name.required':'First Name is required' ,
               'last_name.required':'Last Name is required' ,
            });

            v.check().then((matched)=>{
                if(!matched){
                    return res.json({
                        'err':v.errors
                    });
                }else
                {
                    const query=`update users set first_name=? , last_name=? where id =?`
                    pool.query(query,[first_name,last_name,id],function(error,result){
                        if(error){
                            return res.status(201).json({
                                'err':error.message
                            });

                        }else
                        {
                            return res.status(200).json({
                                'users_update':result
                            });
                        }
                    }) 
                }
            })
        }catch(error)
        {
            return res.status(401).json({
                'err':error.message
            });
        }
    },
    userStatus:async(req,res)=>{
        try{
            const id=req.params.id
            const query='update users set status = case status when 1 then 0 when 0 then 1 else 1 end where id=?';
            // const query='update users set status = case status when "1" then "0" when "0" then "1" end where id=?';
            pool.query(query,[id],function(error,result){
                if(error)
                {
                    return res.status(201).json({
                        'err':error.message
                    });
                }else{
                    return res.status(200).json({
                        'result':result
                    });
                }
            });
        }catch(error)
        {
          return res.status(201).json({
            'err':error.message
          });
        }

    }
    ,
    userDelete:async(req,res)=>{
        try{
            const id= req.params.id
            const query='Update users set delete_status=1 where id = ?'
            pool.query(query,[id],function(error,result){
                if(error)
                {
                    return res.status(201).json({
                        'err':error.message
                    });

                }else{
                    return res.status(200).json({
                        'result':result
                    });
                }

            })


        }catch(error)
        {
            return res.status(201).json({
                'error':error.message
            });
        }

    },
    userRestore:async(req,res)=>{
        try{
            const id= req.params.id
            const query='Update users set delete_status=0 where id=?'
            pool.query(query,[id],(error,result)=>{
                if(error)
                {
                    return res.status(201).json({
                        'err':error.message
                    })

                }else{
                    return res.status(200).json({
                        'result':result
                    });
                }
            })

        }catch(error)
        {
            return res.status(201).json({
                'err':error.message
            });
        }

    }
    ,userProfileImg:async(req,res)=>{
        try{
            console.log('req.body')
            console.log(req.body)
            console.log('req.file')
            console.log(req.file)
            return res.status(200).json({
                'success':'success'
            })

        }catch(error)
        {

        }
    }
}







