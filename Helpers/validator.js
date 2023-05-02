const Validator= require('validatorjs')
const validator=async(body,rules,custom_message,callback)=>{
    const validation= new Validator(body,rules,custom_message);
    validation.passses(()=>callback(null,true))
    validation.fails(()=>callback(validation.errors,false))

}
module.exports=validator