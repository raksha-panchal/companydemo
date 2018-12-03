var mongoose=require('mongoose');

var companySchema= new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    contactNo:{type:Number},
    address:{type:String},
    city:{type:String},
    role:{type:String,enum:['inventory','employee','company']},
    employeeId:[{type:mongoose.Schema.Types.ObjectId,ref:"company",default:function(){ 
       if(this.role == "company"){ 
          return true; 
        }else{
         return false;
        }
        }}],
     inventoryId:[{type:mongoose.Schema.Types.ObjectId,ref:"company",default:function(){ 
      if(this.role == "company"){ 
         return true; 
       }else{
        return false;
       }
       }}],
  
  })

module.exports=mongoose.model("company",companySchema)
