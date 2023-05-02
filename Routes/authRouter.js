const express = require("express")
const authRouter = express();
const bodyParser=require('body-parser')
const authController=require('../Controllers/authController')
const authMiddlware= require('../middlewares/authMiddleware')
const multer= require('multer')
// const multer = require('multer')
// const  upload = multer({ dest: './public/uploads/' })
const storages=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'../public/uploads/')

    },
    filename:function(req,file,cb){
        const uniqueSfx= Date.now()
        cb(null,file.fieldname+'-'+uniqueSfx)

    }
});

const upload=multer({storage:storages});
authRouter.use(bodyParser.json())
authRouter.use(bodyParser.urlencoded({extended:true}))



authRouter.post('/register',authController.register)
authRouter.post('/login',authController.login)
authRouter.get('/all-users',authMiddlware.is_login,authController.all_users)
authRouter.get('/users/:id',authController.userById)
authRouter.put('/users/update/:id',authController.userUpdate)
authRouter.patch('/users/status/:id',authController.userStatus)
authRouter.patch('/users/delete/:id',authController.userDelete)
authRouter.patch('/users/restore/:id',authController.userRestore)
authRouter.patch('/users/profile/:id',upload.single('img'),authController.userProfileImg)


module.exports=authRouter