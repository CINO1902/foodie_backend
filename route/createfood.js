const express = require("express");
const router = express.Router();
const fooddata = require('./model/foodschema');
const orderschema = require('./model/order');
const cart = require('./model/cart');
const unregistered = require('./model/unregistereduser');
const package = require('./model/packagemodel');
const Users = require('./model/registerschema')
const bcrypt = require("bcrypt");
const {validateToken, createTokens} = require("../jwt/middleware");
const nodemailer = require("nodemailer");
const otpverifications = require("./model/otpmodel");
const recoverotp = require("./model/recoverpassword");
const subscription = require("./model/subscription");
const ordersub = require("./model/ordersub");
const coupon = require("./model/coupon");
const notification = require("./model/notification");
const updatepayment = require("./model/updatepayment");
const storecalcuate = require("./model/storecalculate");
const upgradestorage = require("./model/upgradestorage");
const moment = require("moment");
const e = require("express");
const { parse } = require("dotenv");

let dateget = []
let swallow = ['Amala Pack','Semo Pack']
let itemsslide = [
    'https://res.cloudinary.com/dlsavisdq/image/upload/v1670513661/foodie/CHI-heralds-festive-season_pum9at.png',
    'https://res.cloudinary.com/dlsavisdq/image/upload/v1670510774/foodie/SmartSelect_20181125-233844_Instagram_rntql1.jpg',
    'https://res.cloudinary.com/dlsavisdq/image/upload/v1670509149/foodie/1028-Avila-Rice-004watermarked-scaled-1-scaled_p55ays.jpg',
    'https://res.cloudinary.com/dlsavisdq/image/upload/v1668780604/foodie/jellof-rice_bmpdvh.webp',
    'https://res.cloudinary.com/dlsavisdq/image/upload/v1668780600/foodie/EgusiSoup_mo9yii.jpg',
    'https://res.cloudinary.com/dlsavisdq/image/upload/v1668780314/cld-sample-2.jpg'
  ];
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "foodiedelicacies@gmail.com",
      pass: "csdpgiydsnurauwa",
    },
  });

  transporter.verify((error, success)=>{
    if(error){
        console.log(error);
    }
    console.log(success);
  })

router.route('/createfood').post(async (req,res)=>{
    const {item, image_url, mincost,extraable, segment, maxspoon} = req.body;
    function createId(){ 
        var random = Math.floor(1000 + Math.random() * 9000)
        return random;
    }

    let id = createId();
    try{
      let getid =  await fooddata.find({id: id});
    
      if(getid.length !=0 ){
       
        return  res.json({status:"fail", msg:"Id already exist"})
      }else{
        await fooddata.create({
            id: id,
            item: item,
            image_url: image_url,
            mincost:mincost,
            extraable:extraable,
            segment:segment,
            maxspoon:maxspoon
        }).then(()=>{
            res.json({status:"success", msg:"Item Added"})
        }).catch((err)=>{
            if(err){
                res.json({status:"fail", msg:"something went wrong"})
            }
        })
      }
    }catch(err){
        res.json({status:"fails", msg:"something went wrong"})
    }
    
})

router.route('/updateextras').post(async (req,res)=>{
    const {id,extra} = req.body;

   let getid = await fooddata.findOne({id:id});

   if(getid.length !=0){
let checkextra = await fooddata.findOne({id:extra});
if(checkextra){
    console.log(checkextra);
    let findarray = await fooddata.find( {id:id},{ extras: {$elemMatch: {$in: [extra]}}} );
    const extraarr = findarray[0].extras;
      if(extraarr.length === 0){
        fooddata.updateOne(
            { id: id },
           { $push: { extras: extra } },
        
     ).then(()=>{
        res.json({status:"success", msg:'successfully'})
     }).catch((err)=>{
        if(err){
            res.json({status:"fail", msg:'Something went wrong'})
        }
     })
      }else{
        res.json({status:"fail", msg:'Sorry Extra is already available'})
      }
}else{
    res.json({status:"fail", msg:'Sorry Extra ID Does not Exist'})
}
    
    
   }else{
    res.json({status:"fail", msg:'Sorry, ID does not exist'})
   }

})

router.route('/updateavailibity').post(async (req,res)=>{
    const {id,available} = req.body;

   let getid = await fooddata.findOne({id:id});
   if(getid.length != 0){
    fooddata.updateOne(
            { id: id },
           {  availability: available, remaining: false, remainingINT: '0'},
        
     ).then(()=>{
        res.json({status:"success", msg:'successfully'})
     }).catch((err)=>{
        if(err){
            res.json({status:"fail", msg:'Something went wrong'})
        }
     })
   }else{
    res.json({status:"fail", msg:'Sorry, ID does not exist'})
   }

})
router.route('/updateremaining').post(async (req,res)=>{
    const {id,remain,remainint} = req.body;

   let getid = await fooddata.findOne({id:id});
   if(getid.length != 0){
    fooddata.updateOne(
            { id: id },
           {  remaining: remain, remainingINT: remainint, availability: false},
        
     ).then(()=>{
        res.json({status:"success", msg:'successfully'})
     }).catch((err)=>{
        if(err){
            res.json({status:"fail", msg:'Something went wrong'})
        }
     })
   }else{
    res.json({status:"fail", msg:'Sorry, ID does not exist'})
   }

})
router.route('/removeextras').post(async (req,res)=>{
    const {id,extra} = req.body;

   let getid = await fooddata.findOne({id:id});
   if(getid.length != 0){

    let findarray = await fooddata.find( {id:id},{ extras: {$elemMatch: {$in: [extra]}}} );
  const extraarr = findarray[0].extras;
    if(extraarr.length != 0){
      console.log(extraarr.length)
        fooddata.updateOne(
            { id: id },
           { $pull: { extras: extra } },
        
     ).then(()=>{
        res.json({ status:"success" ,msg:'successfully'})
     }).catch((err)=>{
        if(err){
            res.json({status:"fail", msg:'Something went wrong'})
        }
     })
    }else{
        res.json({status:"fail", msg:'Sorry, extras does not exist'})
    }
   
   }else{
    res.json({ status:"fail",msg:'Sorry, ID does not exist'})
   }

})

router.route('/getItems').get( async (req, res)=>{
    
   let getitem =  await fooddata.find();

   res.status(200).json({item: getitem});
})

router.route('/getItemsExtra').post( async (req, res)=>{
    const {id} = req.body
    let getitem =  await fooddata.find({id:id});

    let extraarr = getitem[0].extras ;
  
    async function getextraarr()  {
        values = []
        for(let i=0; i < extraarr.length; i++){
      
            let getextra = await fooddata.find({id:extraarr[i]});
            values.push(getextra);
           
         }
         console.log(values);
         res.json({itemExtra: values})
        
        return values;
    }
    getextraarr();
   
   
 })

 router.route('/updatemincost').post(async (req,res)=>{
    const {id,mincost} = req.body;

    let getId = await fooddata.findOne({id:id});
    if(getId.length != 0){
        await fooddata.updateOne({id:id}, {mincost:mincost}).then(()=>{
            res.json({status:"success" ,msg:'successfully Updated'})
        }).catch((err)=>{
            res.json({status:"fail" ,msg:'Something went wrong'})
        })
    }else{
        res.json({status:"fail" ,msg:'Item Id does not exist'})
    }

})

router.route('/updateextrable').post(async (req,res)=>{
    const {id,able} = req.body;

    let getId = await fooddata.findOne({id:id});
    if(getId.length != 0){
        await fooddata.updateOne({id:id}, {extraable:able}).then(()=>{
            res.json({status:"success" ,msg:'successfully Updated'})
        }).catch((err)=>{
            res.json({status:"fail" ,msg:'Something went wrong'})
        })
    }else{
        res.json({status:"fail" ,msg:'Item Id does not exist'})
    }
})

router.route('/addTocart').post(async (req,res)=>{
    const {id, food, amount, extras, multiple, total, image} = req.body; // <-- missed `games`

    function createId(){ 
        function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
          
    var random = Math.floor(10000000000000 + Math.random() * 90000000000000)
                    return random+makeid(4);
  }
  function createpacakgeid(){ 
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    var random = Math.floor(1000000000000 + Math.random() * 9000000000000)
                    return random+makeid(2);
  }
  let package_group = createpacakgeid();
  let findpackagegroupid = await cart.findOne({id:id})
    if(findpackagegroupid){
 
       let package_group = findpackagegroupid.package_group;
    let packageid = createId();
 let findpackageid = await orderschema.find({packageid:packageid});
 if(findpackageid.length !=0){
 
  return res.json({status: 'fail', msg: 'Something went wrong, Try again'}); 
 }
  let date = new Date();
 const insert = new orderschema({id, food, amount, extras, multiple, total, image, packageid, package_group, date}); 
  try{
   await insert.save();
   await cart.create({
    id:id,
    packageid:packageid,
    package_group:package_group,
    amount_total:amount
   })
   return res.json({status: 'success', msg: 'Added To Cart'}); 
  }
   catch(err){
 console.log(err);
 res.json({status: 'fail', msg: 'Something went wrong, Try again'}); 
 }     
     }
     //Do the otherwise
     else{
       let findpackagegroupid = await cart.findOne({package_group:package_group})
       if(findpackagegroupid){
        return res.json({status: 'fail', msg: 'Something went wrong, Try again'}); 
       }else{
           let packageid = createId();

 let date = new Date();
const insert = new orderschema({id, food, amount, extras, multiple, total, image, packageid, package_group, date}); 
 try{
  await insert.save();
  await cart.create({
   id:id,
   packageid:packageid,
   package_group:package_group,
   amount_total:amount
  })
 res.json({status: 'success', msg: 'Added To Cart'}); 
 }
  catch(err){
console.log(err);
res.json({status: 'fail', msg: 'Something went wrong'}); 
}  
} 
       }
     
  })

    
    
    router.route('/removefromcart').post(async (req,res)=>{
        const {packageid} = req.body;

        let findid =  await orderschema.find({packageid:packageid});
        if(findid.length != 0){
            try{
                await cart.deleteMany({packageid:packageid}).then(async()=>{
              
                    await orderschema.deleteMany({packageid:packageid}).then(()=>{
                        return res.status(200).json({ status: "success",msg: "Deleted Succefully"})
                    }).catch(()=>{
                        return res.status(200).json({status: "fail",msg: "something went wrong"})
                    })
                })
            }
           catch(err){
                if(err){
                    return res.status(200).json({status: "fail",msg: "something went wrong"})
                }
            };        
        }else{
            return res.status(200).json({status: "fail", msg: "Cart wasn't found"})
        }
     
    })



router.route('/fetchid').get(validateToken, (req,res, next)=>{

    let id = req.decoded
    return res.status(200).json({success:'true', msg:req.decoded})
    
})
router.route('/callnotification').post(validateToken, async (req,res, next)=>{
    let id = req.decoded.ID
    const {email} = req.body
    const page = parseInt(req.query.page) 
    const limit = parseInt(req.query.limit) 
  const startIndex = (page -1) * limit
  const endIndex = page * limit
  
    if(email != ''){
        let findnotify = await notification.find({id:email})
        const pagnitednotify = {}
        pagnitednotify.pagnitednotify = findnotify.reverse().slice(startIndex, endIndex)
        if(endIndex < findnotify.length ){
            pagnitednotify.next = {
            page: page + 1,
            limit : limit,
        }
        }else{
            pagnitednotify.next = {
                page: page ,
                limit : limit,
            }
        }
        if(startIndex > 0){
            pagnitednotify.previous = {
            page: page - 1,
            limit : limit,
        }
        }else{
            pagnitednotify.previous = {
                page: page ,
                limit : limit,
            } 
        }   
        return res.json({status:"success",  notific: pagnitednotify})
    }else{
        let findnotify = await notification.find({id:id})
        const pagnitednotify = {}
        pagnitednotify.pagnitednotify = findnotify.reverse().slice(startIndex, endIndex)
        if(endIndex < findnotify.length ){
            pagnitednotify.next = {
            page: page + 1,
            limit : limit,
        }
        }else{
            pagnitednotify.next = {
                page: page ,
                limit : limit,
            }
        }
        if(startIndex > 0){
            pagnitednotify.previous = {
            page: page - 1,
            limit : limit,
        }
        }else{
            pagnitednotify.previous = {
                page: page ,
                limit : limit,
            } 
        }   
        return res.json({status:"success", notific: pagnitednotify})
    }
})
router.route('/gettime').post( async (req,res)=>{
 
 
    let date = new Date ;
    console.log(date)
    function addOneDay(date) {
        date.setDate(date.getDate());
        return date;
      }
    return res.json({date:addOneDay(date)})
})

router.route('/fetchlocation').post(async (req,res, )=>{
    const {location} = req.body
    function getamount(){
        switch (location) {
            case 'Labuta':
              day = 200;
              break;
            case 'Agbede':
              day = 200;
              break;
            case 'Kofesu':
              day = 200;
              break;
            case 'Gate':
              day = 200;
              break;
            case 'Harmony':
              day = 200;
              break;
            case 'Accord':
              day = 300;
              break;
            case 'Oluwo':
              day = 300;
               break;
               case 'School':
                day = 200;
                 break;
            case 'Isolu':
               day = 300;
                break;
            case '':
                day = 0;
                break;
            case 'Camp':
               day = 400;
                break;
          }
          return day
    }

    return res.status(200).json({success:'true', msg:getamount()})
    
})
router.route('/fetchidresgitered').get(validateToken, async(req,res, next)=>{

let id = req.decoded.ID;
let getsubdetails = await subscription.find({email:id, subcribed:true})
function getsub(){
 let subscribe = false;
 if(getsubdetails.length !=0){
     subscribe = true
 }
 return subscribe;
}

await Users.findOne({email:id}).then(async(result)=>{
   
    return res.status(200).json({success:'true', firstname:result.firstname, lastname:result.lastname, email: result.email, verified: result.verified, referal:result.referalid, address:result.address, phone:result.phone, location:result.location, subscribed:getsub(), ref:result.loggedstamp})
})
})


router.route('/createunregistered').post(async (req,res)=>{
    function createId(){ 
        var random = Math.floor(1000000000 + Math.random() * 9000000000)
        return random;
    }
    let date = new Date();
    let id = createId();
    try{
        let getid =  await unregistered.find({id: id});
        if(getid.length != 0){
          createId();
        }else{
           
          await unregistered.create({
              id: id,
              address: '',     
          }).then( async()=>{
            const accessToken = createTokens(id)
            return  res.json({status:"success", msg:"Dashboard Created", token:accessToken})
          }).catch((err)=>{
              if(err){
                  res.json({status:"fail", msg:"something went wrong"})
              }
          })
         
          await notification.create({
              id: id,
              notification_type:12,
              date:date
           })
        }
      }catch(err){
          res.json({status:"fail", msg:"something went wrong"})
      }
})

router.route('/getCart').post( async (req, res)=>{
   const {email, Id} = req.body;
   const page = parseInt(req.query.page) 
   const limit = parseInt(req.query.limit) 
 const startIndex = (page -1) * limit
 const endIndex = page * limit
async function getcart()  {
   
   let result = []
    
        const getcartId = await orderschema.find({id:Id});
        if(typeof getcartId != "undefined"
        && getcartId != null
        && getcartId.length != null
        && getcartId.length > 0){
            result = [...getcartId, ... result];
           
        }
        const getcartemail = await orderschema.find({id:email})
       // console.log(getcartemail)
        if(typeof getcartemail != "undefined"
        && getcartemail != null
        && getcartemail.length != null
        && getcartemail.length > 0){
            result = [...getcartemail, ... result];   
           
        }
        const pagnited = {}
        pagnited.pagnited = result.reverse().slice(startIndex, endIndex)
        if(endIndex < result.length ){
          pagnited.next = {
              page: page + 1,
              limit : limit,
           }
        }else{
          pagnited.next = {
              page: page ,
              limit : limit,
           }
        }
       if(startIndex > 0){
          pagnited.previous = {
              page: page - 1,
              limit : limit,
           }
       }  else{
          pagnited.previous = {
              page: page,
              limit : limit,
           }
       } 
   
     res.json({status: 'success', result: pagnited}) 
    
    return result.reverse();
}
getcart();
 })

 router.route('/createpackage').post(async (req, res)=>{
    const {category, package_name, amount, extras, image, id}= req.body;
   
 
    const insert = new package({category, package_name, amount, extras, image, id}); 
    try{
        await insert.save();
        return res.json({msg:'Successfully created package'})
    }catch(e){
        console.error(e)
        return res.json({msg:'Something went wrong'})
    }
  })

  router.route('/callsoup').get(async (req, res)=>{
    try{
       let soup =  await package.find({category:'soup'})
       return res.json({soup:soup})
    }catch(e){
        return res.json({msg:'Something went wrong', status:'fail'})
    }
  })

router.route('/fetchpackage').get( async (req, res)=>{
    let getitem =  await package.find();

    res.status(200).json({item: getitem});
 })


 router.route('/confirmorder').post(validateToken, async (req, res)=>{
    const {package_group, amount, verified, email, name, number, address, location, ref} = req.body;
  
    let Id = req.decoded.ID;
    let date = new Date();
   try{
    async function getcart()  {
   
        let result = []
         if(email == ''){
            const getcartId = await orderschema.find({id:Id});
            if(typeof getcartId != "undefined"
            && getcartId != null
            && getcartId.length != null
            && getcartId.length > 0){
                result = [...getcartId, ... result];
               
            }
         }else{
            const getcartemail = await orderschema.find({id:email})
            
            if(typeof getcartemail != "undefined"
            && getcartemail != null
            && getcartemail.length != null
            && getcartemail.length > 0){
                result = [...getcartemail, ... result];   
               
            }
         }
             
            
       
         return result;
     }
     
        function createordernumber(){ 
            function makeid(length) {
                var result           = '';
                var characters       = '0123456789';
                var charactersLength = characters.length;
                for ( var i = 0; i < length; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }     
                        return makeid(6);
      }
   
    let findgroup =  await cart.find({package_group:package_group})
    if( findgroup.length!= 0){
        await cart.deleteMany({package_group:package_group})
        if(email != ''){
            await notification.create({
                id: email,
                  notification_type:10,
                  payment_amount:amount,
                  ordernum:package_group,
                  date:date
               })
        }else{
            await notification.create({
                id: Id,
                  notification_type:10,
                  payment_amount:amount,
                  ordernum:package_group,
                  date:date
               })
        }
       
        await orderschema.updateMany({package_group:package_group}, {order:true, date:date, status:1, ordernum:createordernumber(), discounted:verified, discounted_amount:amount, name:name, number:number, address:address, location:location, email:email, ref:ref}).then((result)=>{
           
            return  res.status(200).json({status: 'success', result: result, token:Id});
       }).catch((err)=>{
           console.error(err)
       })
         let result = await  getcart()
       function getamountday(){
          let amount_list = []
          let total = 0;
          if(result.length != 0){
         
            for(let i=0; i< result.length; i++){
                let itemdate = result[i].date
               
                if(date.getDate() == itemdate.getDate() && date.getMonth() == itemdate.getMonth() && date.getFullYear() == itemdate.getFullYear()){
                    amount_list.push(parseInt(result[i].discounted_amount));
                }
            }
            if(amount_list.length != 0){
                 total = amount_list.reduce((a, b) => a + b, 0)
            }
          }
         
          return total;
      }
     
     function getweek(d) {
       return moment(d).week();
     }
     function getamountweek(){
        let amount_list = []
        let total = 0;
        if(result.length != 0){
       
          for(let i=0; i< result.length; i++){
              let itemdate = result[i].date
             
              if(getweek(date) == getweek(itemdate)  && date.getFullYear() == itemdate.getFullYear()){
                  amount_list.push(parseInt(result[i].discounted_amount));
              }
          }
          if(amount_list.length != 0){
               total = amount_list.reduce((a, b) => a + b, 0)
          }
        }
        return total;
    }
    console.log(getamountday())
      if(getamountday() >= 3000 ){
        let checkcoupon = await notification.find({notification_type:1, id:email});
        if(checkcoupon.length !=0){

         let checkdate = checkcoupon[checkcoupon.length -1].date
          function diff_hours(dt2, dt1) {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));
 }

         if(date.getDate() != checkdate.getDate()){
            
            console.log(date)
            let code =  await createcoup('1000', 'money',0)
            if(email != ''){
                await notification.create({
                    id: email,
                      notification_type:1,
                      discount:1000,
                      coupon:code,
                      date:date
                   })
            }else{
                await notification.create({
                    id: Id,
                      notification_type:1,
                      discount:1000,
                      coupon:code,
                      date:date
                   })
            }  
         }
        }else{
            let code =  await createcoup('1000', 'money',0)
            if(email != ''){
                await notification.create({
                    id: email,
                      notification_type:1,
                      discount:1000,
                      coupon:code,
                      date:date
                   })
            }else{
                await notification.create({
                    id: Id,
                      notification_type:1,
                      discount:1000,
                      coupon:code,
                      date:date
                   })
            }
            
        }   
         }else if(getamountday() >= 1500 && getamountday() <=2800){
            if(email != ''){
                await notification.create({
                    id: email,
                   notification_type:4,
                   amount_daily:3000 - getamountday(),
                   date:date
                })
            }else{
                await notification.create({
                    id: Id,
                   notification_type:4,
                   amount_daily:3000 - getamountday(),
                   date:date
                })
            }
           
         }
        
         if(getamountweek() >= 10000){
            let checkcoupon = await notification.find({notification_type:2, id:email});
            if(checkcoupon.length !=0){
             let checkdate = checkcoupon[checkcoupon.length -1].date
             if(getweek(checkdate) != getweek(date) && date.getFullYear() != itemdate.getFullYear()){
                let code =  await createcoup('0', 'discount','10')
                if(email != ''){
                    await notification.create({
                        id: email,
                          notification_type:2,
                          discount:10,
                          coupon:code,
                          date:date
                       })
                }else{
                    await notification.create({
                        id: Id,
                          notification_type:2,
                          discount:10,
                          coupon:code,
                          date:date
                       }) 
                }
               
             }
            }else{
                let code =  await createcoup('0', 'discount','10')
                if(email != ''){
                    await notification.create({
                        id: email,
                          notification_type:2,
                          discount:10,
                          coupon:code,
                          date:date
                       })
                }else{
                    await notification.create({
                        id: Id,
                          notification_type:2,
                          discount:10,
                          coupon:code,
                          date:date
                       })
                }
                
            }   
             }else if(getamountweek() >= 7000 && getamountweek() <=9500){
                if(email != ''){
                    await notification.create({
                        id: email,
                       notification_type:5,
                       amount_weekly:10000 - getamountweek(),
                       date:date
                    })
                }else{
                    await notification.create({
                        id: Id,
                       notification_type:5,
                       amount_weekly:10000 - getamountweek(),
                       date:date
                    })
                }
              
             }

    }else{
        return  res.status(400).json({status: 'fail', msg:'Something went wrong'});
    }}catch(e){
        return  res.status(400).json({status: 'fail', msg:'Something went wrong'});
    }
       

 })


 router.route("/register").post( async (req,res)=>{
    const {firstname, lastname, email, phone, password} = req.body;
    let emailuse = email.toLowerCase();
    
    let user = await Users.find({email:emailuse});
    if(user.length !=0){
      
        return res.status(400).json({success:'false', msg:'User Already Exist'})
       
    }
    let date = new Date();
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
  await bcrypt.hash(password,10).then((hash)=> {
     Users.create({
        firstname:firstname,
        lastname:lastname,
        email: emailuse.trim(),
        phone:phone,
        location:'', 
        address:'',
        password: hash,
        referalid: makeid(9),
        date:date
    }).then(()=>{
      
      return  res.json({success:'true', msg:'Register Successfully'})
    }).catch((err)=>{
        if(err){
        return    res.status(400).json({sucess:'false', msg:'Something Went wrong'})
        }
    });
   });
   let code =  await createcoup('0', 'discount','10')
   await notification.create({
    id: emailuse,
    notification_type:13,
    coupon: code,
    discount:10,
    date:date
 })
})

router.route("/login").post(async (req,res)=>{
    const { email, password } = req.body;
    let emailuse = email.toLowerCase().trim();
    const user = await Users.findOne({email: emailuse });
   
  
    if (!user) {
        
       return res.status(400).json({success:'false', msg: "User Doesn't Exist" });
}else{
    const dbPassword = user.password;
    bcrypt.compare(password, dbPassword).then(async(match) => {
      if (!match) {
        return res
          .status(400)
          .json({success:'false',  msg: "Wrong Username and Password Combination!" });
      } else {
      let subscrib =  await subscription.find({email:email,subcribed:true})
      
        function getsub(){
            let subscribe = false;
            if(subscrib.length !=0){
                subscribe = true
            }
            return subscribe;
        }
       let ref = Date.now();
        const accessToken = createTokens(emailuse)
        await Users.updateOne({email:emailuse},{loggedstamp:ref})
       return res.json({token:accessToken, msg:"Successfully Logged In", success:'true', subscribe: getsub(), ref:ref});
      }
    }).catch((e)=>{
        return res.json({success:'fail', msg:'Something went wrong'})
    });
}
});


router.route("/requestOTP").post( async (req,res)=>{
    const {email} = req.body;
    let emailuse = email.toLowerCase().trim();
   try{
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailoptions = {
        from: "foodiedelicacies@gmail.com",
        to: emailuse,
        subject: "Verify Your Email",
        html: `<p>Enter <b>${otp}</b> in your app to verify your email and complete your registration</p>`
    };
    const saltround = 10;
    const hashotp = await bcrypt.hash(otp, saltround);

    await  otpverifications.create({
        email:emailuse,
        otp:hashotp,
        createdAt:Date.now(),
        expiresAt:Date.now() + 60000,
    })
   
    await transporter.sendMail(mailoptions);
    res.json({
        success:'true',
        msg:'Otp sent successfully',
    })
   }catch(error){
    res.json({
        success:'false',
        msg:error,

    })
   }
})


router.route("/verifyOTP").post( async (req,res)=>{
    const {email, otp} = req.body;
  
    try{
        let emailuse = email.toLowerCase().trim();

        let otpverificationsRecords = await otpverifications.find({email:emailuse});
            if(otpverificationsRecords.length == 0){
              return  res.json({
                    success:'false',
                    msg:'Account Does not exist or it has been verified successfully'
                });
            }else{
        let expiresAt = otpverificationsRecords[0].expiresAt;
        let hashotp = otpverificationsRecords[0].otp;

      
        let date = new Date()
        console.log(date.getTime() )
        if(expiresAt.getTime() < date.getTime()){
            console.log(expiresAt.getTime() )
              await otpverifications.deleteMany({email:emailuse});
              return  res.json({
                expiresAt:expiresAt,
             success:'false',
             msg:'Otp has Expired, Please request a new one'
         })
         }else{
            
    bcrypt.compare(otp, hashotp).then(async (match )=>{
      if (!match) {
        return  res.json({
                     success:'false',
                     msg:'OTP is incorrect',
                 })
      } else {
        await Users.updateOne({email:emailuse},{verified:true});
             await otpverifications.deleteMany({email:emailuse});
             return res.json({
                 success:'true',
                 msg:'Email Verified Successfully',
             })
      }
    
    })
}
}

}catch(error){
res.json({
success:'false',
msg:error,
})
}
})

router.route("/resendOTP").post( async (req,res)=>{
    const {email} = req.body;
    try{
        let emailuse = email.toLowerCase().trim();
        await otpverifications.deleteMany({email:emailuse});
     const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
     const mailoptions = {
         from: "foodiedelicacies@gmail.com",
         to: emailuse,
         subject: "Verify Your Email",
         html: `<p>Enter <b>${otp}</b> in your app to verify your email and complete your registration</p>`
     };
     const saltround = 10;
     const hashotp = await bcrypt.hash(otp, saltround);
 
     await  otpverifications.create({
         email:emailuse,
         otp:hashotp,
         createdAt:Date.now(),
         expiresAt:Date.now() + 60000,
     })
     
     await transporter.sendMail(mailoptions);
     return  res.json({
         success:'true',
         msg:'Otp sent successfully',
 
     })
    }catch(error){
        return res.json({
         success:'false',
         msg:'Something Went Wrong',
 
     })
    }
})

router.route('/calculateamount').post(async (req,res)=>{
    dateget.length = 0
    const {email, category1, category2, category3, drinks1, drinks2, drinks3} = req.body; 
    function getamount(category){
      let  amount = 0
        if(category == 'sapa'){
            amount = 800 * 30
        }else if(category == 'longthroat'){
            amount = 1300 * 30
        }else if(category == 'odogwu'){
            amount = 1800 * 30
        }
        return amount
    }
let finddrinkamount1 = await package.find({id:'1007'})
let finddrinkamount2 = await package.find({id:'1008'})
let finddrinkamount3 = await package.find({id:'1009'})
let finddrinkamount4 = await package.find({id:'1010'})
let drink1amount = finddrinkamount1[0].amount
let drink2amount = finddrinkamount2[0].amount
let drink3amount = finddrinkamount3[0].amount
let drink4amount = finddrinkamount4[0].amount

    function getdrinkamount(category){
        let  amount = 0
          if(category == '1007'){
              amount = drink1amount * 30
          }else if(category == '1008'){
              amount = drink2amount * 30
          }else if(category == '1009'){
              amount = drink3amount * 30
          }else if(category == '1010'){
            amount = drink4amount * 30
        }
          return amount
      }

      let drinkfinal = getdrinkamount(drinks1) + getdrinkamount(drinks2) + getdrinkamount(drinks3)
  
   let finalamount = getamount(category1) + getamount(category2) + getamount(category3);
  let subfrequency1food = getamount(category1) - percentage(30, getamount(category1))
  let subfrequency1drink = getdrinkamount(drinks1) - percentage(20, getdrinkamount(drinks1))
  let frequency1 =  subfrequency1food + subfrequency1drink
  let subfrequency2food = getamount(category2) - percentage(30, getamount(category2))
  let subfrequency2drink = getdrinkamount(drinks2) - percentage(20, getdrinkamount(drinks2))
  let frequency2 = subfrequency2food + subfrequency2drink
  let subfrequency3food = getamount(category3) - percentage(30, getamount(category3))
  let subfrequency3drink = getdrinkamount(drinks3) - percentage(20, getdrinkamount(drinks3))
  let frequency3 = subfrequency3food + subfrequency3drink

  let priceseach = []
  let drinkforeach = []
  let foodforeach = []
  priceseach.push(frequency1, frequency2, frequency3)
  drinkforeach.push(subfrequency1drink, subfrequency2drink,subfrequency3drink)
  foodforeach.push(subfrequency1food, subfrequency2food, subfrequency3food)
  console.log(priceseach);
        function percentage(getpercent, totalValue) {
            return (getpercent / 100) * totalValue;
         } 
         let subscidizeddrink = drinkfinal - percentage(20, drinkfinal)
         let subamount = finalamount - percentage(30, finalamount)
      await storecalcuate.deleteMany({email:email})
         await storecalcuate.create({
            email:email,
            totalamount:subamount + subscidizeddrink,
            drinkamount:  subscidizeddrink,
            discounted:subamount,
            finalamount:finalamount
         })
         

         return res.json({amount:(subamount + subscidizeddrink), drinks:drinkforeach, food: foodforeach, total: priceseach})
})

router.route('/rollovercalculateamount').post(async (req,res)=>{
    dateget.length = 0
    const {email, category1, category2, category3, drinks1, drinks2, drinks3} = req.body; 
    function getamount(category){
      let  amount = 0
        if(category == 'sapa'){
            amount = 800 * 30
        }else if(category == 'longthroat'){
            amount = 1300 * 30
        }else if(category == 'odogwu'){
            amount = 1800 * 30
        }
        return amount
    }
let finddrinkamount1 = await package.find({id:'1007'})
let finddrinkamount2 = await package.find({id:'1008'})
let finddrinkamount3 = await package.find({id:'1009'})
let finddrinkamount4 = await package.find({id:'1010'})
let drink1amount = finddrinkamount1[0].amount
let drink2amount = finddrinkamount2[0].amount
let drink3amount = finddrinkamount3[0].amount
let drink4amount = finddrinkamount4[0].amount

    function getdrinkamount(category){
        let  amount = 0
          if(category == '1007'){
              amount = drink1amount * 30
          }else if(category == '1008'){
              amount = drink2amount * 30
          }else if(category == '1009'){
              amount = drink3amount * 30
          }else if(category == '1010'){
            amount = drink4amount * 30
        }
          return amount
      }

      let drinkfinal = getdrinkamount(drinks1) + getdrinkamount(drinks2) + getdrinkamount(drinks3)
  
   let finalamount = getamount(category1) + getamount(category2) + getamount(category3);
  let subfrequency1food = getamount(category1) - percentage(30, getamount(category1))
  let subfrequency1drink = getdrinkamount(drinks1) - percentage(20, getdrinkamount(drinks1))
  let frequency1 =  subfrequency1food + subfrequency1drink
  let subfrequency2food = getamount(category2) - percentage(30, getamount(category2))
  let subfrequency2drink = getdrinkamount(drinks2) - percentage(20, getdrinkamount(drinks2))
  let frequency2 = subfrequency2food + subfrequency2drink
  let subfrequency3food = getamount(category3) - percentage(30, getamount(category3))
  let subfrequency3drink = getdrinkamount(drinks3) - percentage(20, getdrinkamount(drinks3))
  let frequency3 = subfrequency3food + subfrequency3drink

  let priceseach = []
  let drinkforeach = []
  let foodforeach = []
  priceseach.push(frequency1, frequency2, frequency3)
  drinkforeach.push(subfrequency1drink, subfrequency2drink,subfrequency3drink)
  foodforeach.push(subfrequency1food, subfrequency2food, subfrequency3food)
  console.log(priceseach);
        function percentage(getpercent, totalValue) {
            return (getpercent / 100) * totalValue;
         } 
         let subscidizeddrink = drinkfinal - percentage(20, drinkfinal)
         let subamount = finalamount - percentage(30, finalamount)
      await storecalcuate.deleteMany({email:email})
         await storecalcuate.create({
            email:email,
            totalamount:subamount + subscidizeddrink,
            drinkamount:  subscidizeddrink,
            discounted:subamount,
            finalamount:finalamount
         })
         

         return res.json({amount:(subamount + subscidizeddrink) - percentage(10, (subamount + subscidizeddrink)), rollover:(subamount + subscidizeddrink), drinks:drinkforeach, food: foodforeach, total: priceseach})
})

router.route('/sendsubscription').post(async (req,res)=>{
    const {email, frequency, day1, day2, day3, drink1, drink2, drink3, category1, category2, category3} = req.body; // <-- missed `games`

    function createId(){ 
        function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
          
    var random = Math.floor(10000000000000 + Math.random() * 90000000000000)
                    return random+makeid(8);
  }
 
     let finddata = await storecalcuate.find({email:email})
     if(finddata.length != 0){

    let discounted = finddata[0].discounted
    let finalamount = finddata[0].finalamount
    let drinkamount = finddata[0].drinkamount
    let totalamount = finddata[0].totalamount
    sumdetails(discounted, finalamount, drinkamount,totalamount )

 async function  sumdetails(discounted, finalamount, drinkamount, totalamount){
    let subid = createId();
    let findpackageid = await subscription.find({subid:subid});
    if(findpackageid.length !=0){
     createId();
    return res.json({status: 'fail', msg: 'Something went wrong, Try again'}); 
    }else{
       let createdate = new Date();
       let date = createdate.setDate(createdate.getDate() );
       let date2 = new Date();
       let expiredate = date2.setDate(date2.getDate() + 29);
       console.log(category1);
       let subcribed = true;
      const insert = new subscription({email, frequency, day1, day2, day3, drink1, drink2, drink3, category1, category2, category3, totalamount, drinkamount, finalamount, discounted, subid, subcribed, date, expiredate}); 
       try{
        await insert.save();
        await notification.create({
            id: email,
            notification_type:11,
            payment_amount:totalamount,
            date:createdate
         })
         await notification.create({
            id: email,
            notification_type:6,      
            date:createdate
         })
       res.json({status: 'success', msg: 'Subscription created sucessfully'}); 
       }
        catch(err){
      console.log(err);
      res.json({status: 'fail', msg: 'Something went wrong'}); 
      }     
    }
 }
   
 
}else{
    return res.json({status:'fail', msg:'Something went wrong'})
 }
     
  })


  router.route('/rolloversubscription').post(async (req,res)=>{
    const {email, days, frequency, day1, day2, day3, drink1, drink2, drink3, category1,category2,category3} = req.body; // <-- missed `games`

    function createId(){ 
        function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
          
    var random = Math.floor(10000000000000 + Math.random() * 90000000000000)
                    return random+makeid(8);
  }       
    let subid = createId();
 let findpackageid = await subscription.find({subid:subid});
 if(findpackageid.length !=0){
  createId();
 return res.json({status: 'fail', msg: 'Something went wrong, Try again'}); 
 }
 console.log(day1);
  let createdate = new Date();
  let date = createdate.setDate(createdate.getDate() +( days + 1) );
  let date2 = new Date();
  let expiredate = date2.setDate(date2.getDate() +( 30 + days +1));
  console.log(days)
  let subcribed = false;
  let newplan= true;
  let finddata = await storecalcuate.find({email:email})
  if(finddata.length != 0){

 let discounted = finddata[0].discounted
 let finalamount = finddata[0].finalamount
 let drinkamount = finddata[0].drinkamount
 let totalamount = finddata[0].totalamount
 
 const insert = new subscription({email, frequency, day1, day2, day3, drink1, drink2, drink3, category1, category2, category3,totalamount, drinkamount, finalamount, discounted,  subid, subcribed, newplan, date, expiredate}); 
  try{
   await insert.save();
 return  res.json({status: 'success', msg: 'Added To List'}); 
  }
   catch(err){
 console.log(err);
 return res.json({status: 'fail', msg: 'Something went wrong'}); 
 }     
     
}else{
    return res.json({status: 'fail', msg: 'Something went wrong'}); 
}
  })


  router.route('/checkupgrade').post(async (req,res)=>{
    dateget.length = 0
        const {email, frequency, day1, day2, day3, drinks1, drinks2, drinks3, category1, category2, category3} = req.body;
    let currentdate = new Date().getDate();
    let getsubdetails = await subscription.find({email:email, subcribed:true})
    let checkorder = await ordersub.find({email:email})

    if(getsubdetails.length != 0){
       let email = getsubdetails[0].email
       let datereg = getsubdetails[0].date
      
       let expiredate = getsubdetails[0].expiredate
       let usecategory1 = getsubdetails[0].category1
       let usecategory2 = getsubdetails[0].category2
       let drinkamount = getsubdetails[0].drinkamount
       let price =getsubdetails[0].finalamount
       let newplan = getsubdetails[0].newplan
       let existingdrink1 = getsubdetails[0].drink1
       let existingdrink2 = getsubdetails[0].drink2
       let existingdrink3 = getsubdetails[0].drink3
       function drinkget(){
        let drink = 0
        if(drinkamount == undefined || drinkamount == ''){
            drink = 30
           }else{
            drink = drinkamount
           }
           return drink;
       }
      
              let subid = getsubdetails[0].subid
       let rollover = getsubdetails[0].rollover
      let currentdate = new Date();
      var dif= expiredate.getDate()-currentdate.getDate();
      let d =  dif +1;
   

      let dailyprice = price/30
      
     let subcribed = true;
     function getamount(category, d){
       let  amount = 0
         if(category == 'sapa'){
             amount = 800 * d
         }else if(category == 'longthroat'){
             amount = 1300 * d
         }else if(category == 'odogwu'){
             amount = 1800 * d
         }
         return amount
     }
     let finddrinkamount1 = await package.find({id:'1007'})
let finddrinkamount2 = await package.find({id:'1008'})
let finddrinkamount3 = await package.find({id:'1009'})
let finddrinkamount4 = await package.find({id:'1010'})
let drink1amount = finddrinkamount1[0].amount
let drink2amount = finddrinkamount2[0].amount
let drink3amount = finddrinkamount3[0].amount
let drink4amount = finddrinkamount4[0].amount

    function getdrinkamount(category, d){
        let  amount = 0
          if(category == '1007'){
              amount = drink1amount * d
          }else if(category == '1008'){
              amount = drink2amount * d
          }else if(category == '1009'){
              amount = drink3amount * d
          }else if(category == '1010'){
            amount = drink4amount * d
        }
          return amount
      }
      function percentage(getpercent, pricetopay) {
        return (getpercent / 100) * pricetopay;
     } 
      let drinkfinal = getdrinkamount(drinks1,30) + getdrinkamount(drinks2, 30) + getdrinkamount(drinks3, 30)

      let subscidizeddrink = drinkfinal - percentage(20, drinkfinal)
      let drinkprice = drinkget() / 30
      let dailydrinkprice = subscidizeddrink / 30
      let unused_drink = drinkprice * d
      let drink_to_pay = dailydrinkprice * d
      let final_drink = (drink_to_pay - unused_drink).toFixed(2)
    
        let totalamount = getamount(category1,30) + getamount(category2,30) + getamount(category3,30);
        let dailypricenew = totalamount/30
        let pricetopay = dailypricenew * d
     let unused_money = dailyprice * d;

    let subfrequency1food = getamount(category1,d) - percentage(30, getamount(category1,d))
    let subfrequency1drink = getdrinkamount(drinks1,d) - percentage(20, getdrinkamount(drinks1,d))
    let frequency1 =  subfrequency1food + subfrequency1drink
    let subfrequency2food = getamount(category2,d) - percentage(30, getamount(category2,d))
    let subfrequency2drink = getdrinkamount(drinks2,d) - percentage(20, getdrinkamount(drinks2,d))
    let frequency2 = subfrequency2food + subfrequency2drink
    let subfrequency3food = getamount(category3,d) - percentage(30, getamount(category3,d))
    let subfrequency3drink = getdrinkamount(drinks3,d) - percentage(20, getdrinkamount(drinks3,d))
    let frequency3 = subfrequency3food + subfrequency3drink
  
    let priceseach = []
    let drinkforeach = []
    let foodforeach = []
    priceseach.push(frequency1, frequency2, frequency3)
    drinkforeach.push(subfrequency1drink, subfrequency2drink,subfrequency3drink)
    foodforeach.push(subfrequency1food, subfrequency2food, subfrequency3food)
    console.log(unused_money)
    let outstandingfood = unused_money -percentage(30, unused_money)
      let discount = parseInt((totalamount - percentage(30, totalamount)))
     let new_amount_to_pay = pricetopay - unused_money
     let amount_to_pay = parseInt((new_amount_to_pay - percentage(30, new_amount_to_pay)))
   if(checkorder.length != 0){
    let date = checkorder[checkorder.length -1].date
   // 
   let drinkamountfood = parseFloat(final_drink) + parseFloat(amount_to_pay)


    if( date.getDate() != currentdate.getDate()){
        if(parseInt(totalamount)  < price){
      
            return res.json({status:'fail', msg:'You cannot upgrade to a lower plan'})
         }else if(drinks1 != '' || drinks2 != '' || drinks3 != ''){
            
            if(parseInt(subscidizeddrink) < drinkget() || parseInt(subscidizeddrink) == drinkget()){
                return res.json({status:'fail', msg:'The previous drinks value is higher than the one sellected'})
            }else{
                if((amount_to_pay + final_drink) < 1000){
                    return res.json({status:'fail', msg:'You cannot upgrade to a plan with a value than 1000'})
                }else{
                  //  dateget.push(parseFloat(discount), totalamount, subscidizeddrink, parseInt(discount) + subscidizeddrink, newplan, rollover, datereg, expiredate, subid, drinkamountfood, existingdrink1, existingdrink2, existingdrink3, drinkget())
                  await upgradestorage.deleteMany({email:email})
                  await upgradestorage.create({
                    email:email,
                    finalamount:totalamount,
                    discounted:parseFloat(discount),
                    drinkamount: subscidizeddrink,
                    totalamount:parseInt(discount) + subscidizeddrink,
                    newplan:newplan,
                    rollover:rollover,
                    date:datereg,
                    expireday:expiredate,
                    subid:subid,
                    drinkamountfood:drinkamountfood,
                    existingdrink1:existingdrink1,
                    existingdrink2:existingdrink2,
                    existingdrink3:existingdrink3,
                    drinkget:drinkget()
                   })
                    return res.json({status:'success', amount:drinkamountfood.toString(), outstandingdrink:unused_drink, outstandingfood:outstandingfood, outstandingtotal: unused_drink+ outstandingfood, priceseach:priceseach, drinkforeach:drinkforeach, foodforeach:foodforeach})
                }
            }
         } else{
            if(parseInt(amount_to_pay)  < 1000){
                return res.json({status:'fail', msg:'You cannot upgrade to a plan with a value than 1000'})
            }else{

                //    dateget.push(parseFloat(discount), totalamount, subscidizeddrink, parseInt(discount) + subscidizeddrink, newplan, rollover, datereg, expiredate, subid, amount_to_pay, )
                await upgradestorage.deleteMany({email:email})
                  await upgradestorage.create({
                    email:email,
                    finalamount:totalamount,
                    discounted:parseFloat(discount),
                    drinkamount: subscidizeddrink,
                    totalamount:parseInt(discount) + subscidizeddrink,
                    newplan:newplan,
                    rollover:rollover,
                    date:datereg,
                    expireday:expiredate,
                    subid:subid,
                    drinkamountfood:amount_to_pay,
                   })
                return res.json({status:'success', amount:amount_to_pay, priceseach:priceseach, drinkforeach:drinkforeach, foodforeach:foodforeach, outstandingdrink:unused_drink, outstandingfood:outstandingfood, outstandingtotal: unused_drink+ outstandingfood})
            }
            
         }
    }else{
        return res.json({status:'fail', msg:"You can't upgrade after making an Order today"})
    }
   
  
   }else{
    return res.json({status:'fail', msg:"You can't upgrade When you haven't made an order"})
   }
    
    }else{
        return res.json({status:'fail', msg:"User doesn't have subcription plan"})
    }   
  })

  router.route('/upgradesub').post(async (req,res)=>{
    const {email, frequency, day1, day2, day3, drink1, drink2, drink3, category1, category2, category3} = req.body; // <-- missed `games`
   
    
    let currentdate = new Date();
   
 
 
    try{
        
    let finddata = await upgradestorage.find({email:email})
    if(finddata.length!= 0){

        let totalamount = finddata[0].totalamount
        let drinkamount = finddata[0].drinkamount
        let finalamount = finddata[0].finalamount
        let discounted =finddata[0].discounted
        let subcribed = true
        let newplan = finddata[0].newplan
        let rollover =  finddata[0].rollover
        let date = finddata[0].date
        let expiredate = finddata[0].expiredate
        let subid = finddata[0].subid
        let payamount = finddata[0].drinkamountfood
     if(drink1 != ''|| drink2 != '' || drink3 != ''){
        await subscription.deleteMany({email:email, subcribed:true, subid:subid})
        const insert = new subscription({email, frequency, day1, day2, day3, category1, category2, category3, totalamount, finalamount, discounted, subid, subcribed, newplan, rollover, date, expiredate}); 
        await insert.save();
       
        await notification.create({
            id: email,
            notification_type:11,
            payment_amount:payamount,
            date:currentdate
         })
         await notification.create({
            id: email,
            notification_type:7,
            date:currentdate
         })
         return res.json({status: 'success', msg: 'Upgraded Sucessfully'}); 
    }else{
        let drink1 = finddata[0].existingdrink1
        let drink2 = finddata[0].existingdrink2
        let drink3 = finddata[0].existingdrink3
        let drinkamount = finddata[0].drinkget
        await subscription.deleteMany({email:email, subcribed:true, subid:subid})
        const insert = new subscription({email, frequency, day1, day2, day3, drink1, drink2, drink3, drinkamount, category1, category2, category3, totalamount, finalamount, discounted, subid, subcribed, newplan, rollover, date, expiredate}); 
        await insert.save();
     
        await notification.create({
            id: email,
            notification_type:11,
            payment_amount:payamount,
            date:currentdate
         })
         await notification.create({
            id: email,
            notification_type:7,
            date:currentdate
         })
         return res.json({status: 'success', msg: 'Upgraded Sucessfully'}); 
    }
   
}else{
    return res.json({status: 'fail', msg: 'Something went wrong'}); 
}
    }
     catch(err){
   console.log(err);
   return res.json({status: 'fail', msg: 'Something went wrong'}); 
   }     


  
  }) 
  router.route("/getpackageid").post(async (req,res)=>{
    const {day1, day2, day3, drink1, drink2, drink3,} = req.body;
    let extraarr1 = day1;
    let extraarr2 = day2;
    let extraarr3 = day3;
    let drink11 = drink1;
    let drink21 = drink2;
    let drink31 = drink3;
    let refined1 = extraarr1.map(id =>{
        myobject =  extraarr1[0]
      
       let result = []
       let count = Object.keys(myobject).length

       for(let i = 0; i < count; i++){
           result.push(id[i])
       }
      
       return result;
   })  
   console.log(refined1)
 
   let refined2 = extraarr2.map(id =>{
       myobject =  extraarr2[0]
      
      let result = []
      let count = Object.keys(myobject).length

      for(let i = 0; i < count; i++){
          result.push(id[i])
      }
      
      return result;
  })
  
  let refined3 = extraarr3.map(id =>{
        myobject =  extraarr3[0]
       
       let result = []
       let count = Object.keys(myobject).length

       for(let i = 0; i < count; i++){
           result.push(id[i])
       }
       
       return result;
   })
   function refind(getdrink){
    let getdrin = []
    if(getdrink.length!=0){
        getdrin = getdrink[0]
    }else{
        getdrin = []
    }
    return getdrin
}
   async function getextraarr()  {
    let values1 = []
    let values2 = []
    let values3 = []
   
   
    for(let i=0; i < refind(refined1).length; i++){
  
        let getextra = await package.find({id:refind(refined1)[i]});
        function foodget(getdrink){
            let getdrin = ''
            if(getdrink.length!=0){
                getdrin = getdrink[0].package_name
            }else{
                getdrin = ''
            }
            return getdrin
     }

   
        values1.push(foodget(getextra));
       
     }
     for(let i=0; i < refind(refined2).length; i++){
  
        let getextra = await package.find({id:refind(refined2)[i]});
        function foodget(getdrink){
            let getdrin = []
         if(getdrink.length!=0){
             getdrin = getdrink[0].package_name
         }else{
             getdrin = []
         }
         return getdrin
     }
        values2.push(foodget(getextra));

       
     }
     for(let i=0; i < refind(refined3).length; i++){
  
        let getextra = await package.find({id:refind(refined3)[i]});
        function foodget(getdrink){
            let getdrin = []
         if(getdrink.length!=0){
             getdrin = getdrink[0].package_name
         }else{
             getdrin = []
         }
         return getdrin
     }
        values3.push(drinksget(getextra));

       
     }
     function drinksget(getdrink){
           let getdrin = ''
        if(getdrink.length!=0){
            getdrin = getdrink[0].package_name
        }else{
            getdrin = ''
        }
        return getdrin
    }
  
        let getdrink1 = await package.find({id:drink11});
       

       
        let getdrink2 = await package.find({id:drink21});
        let getdrink3 = await package.find({id:drink31});
      return res.json({food1:values1, food2: values2, food3: values3, drink1:drinksget(getdrink1), drink2:drinksget(getdrink2),  drink3:drinksget(getdrink3)})
       
     
    }
    getextraarr()
  })
  router.route("/getmostcommon").post(async (req,res)=>{
    const {email} = req.body;
    let getid =  await subscription.find({email:email,subcribed:true});
    if(getid.length != 0){
        let extraarr1 = getid[0].day1;
        let extraarr2 = getid[0].day2;
        let extraarr3 = getid[0].day3;
        let drink1 = getid[0].drink1;
        let drink2 = getid[0].drink2;
        let drink3 = getid[0].drink3;
       console.log(extraarr1)
        let refined1 = extraarr1.map(id =>{
             myobject =  extraarr1[0]
            
            let result = []
            let count = Object.keys(myobject.toJSON()).length
    
            for(let i = 0; i < count -1; i++){
                result.push(id[i])
            }
            
            return result;
        })     
        let refined2 = extraarr2.map(id =>{
            myobject =  extraarr2[0]
           
           let result = []
           let count = Object.keys(myobject.toJSON()).length
    
           for(let i = 0; i < count -1; i++){
               result.push(id[i])
           }
           
           return result;
       })
       let refined3 = extraarr3.map(id =>{
             myobject =  extraarr3[0]
            
            let result = []
            let count = Object.keys(myobject.toJSON()).length
    
            for(let i = 0; i < count -1; i++){
                result.push(id[i])
            }
            
            return result;
        })
      
        function drinks(){
            list = []
            if(drink1 != ''){
            list.push(drink1)
            }
            if(drink2 != ''){
                list.push(drink2)
                }
                if(drink3 != ''){
                    list.push(drink3)
                    }
           return list
              
        }
        function check1(){
            list = []
            if(refined1.length == 0){
                list = refined1
            }else{
                list = refined1[0]
            }
           return list
              
        }
        function check2(){
            let list = [];
            if(refined2.length == 0){
                 list = refined2
            }else{
             list  =  refined2[0]
            }
                return list;
        }
    
        function check3(){
            let list = [];
            if(refined3.length == 0){
                 list =  refined3 
            }else{
                list  = refined3[0] 
            }
                return list;
        }
       
        
        let finalrefined = []
        finalrefined.push(...check1(),...check2(),...check3(),...finalrefined);
        let uniquerefined = [...new Set(finalrefined)]
        let uniquedrink = [...new Set(drinks())]
    
         
      
        async function getextraarr()  {
            let values = []
            let valuesdrink = []
            
            for(let i=0; i < uniquerefined.length; i++){
          
                let getextra = await package.find({id:uniquerefined[i]});
                values.push(...getextra);
               
             }
             for(let i=0; i < uniquedrink.length; i++){
          
                let getdrink = await package.find({id:uniquedrink[i]});
                valuesdrink.push(...getdrink);
               
             }
         
           let arr1 = ['1000','1001','1002','1003','1004','1005','1006']
           let arr2 = ['1011','1012','1013','1014','1015','1016','1017']
           let arr3 =['1018','1019','1020','1021','1022','1023','1024']
           const sapa = uniquerefined.some(r=> arr1.indexOf(r) >= 0)
           const longthroat = uniquerefined.some(r=> arr2.indexOf(r) >= 0)
           const odogwu = uniquerefined.some(r=> arr3.indexOf(r) >= 0)
           
           let date = new Date();
             res.json({suggestfood: values, frequency: getid[0].frequency, expire: getid[0].expiredate, date: getid[0].date, currentdate:date, sapa:sapa, longthroat:longthroat, odogwu:odogwu, drinks: valuesdrink, swallow:swallow})
           
            return values;
        }
        getextraarr();
    }
   
   
  })
  router.route("/deletesub").post(async (req,res)=>{
    const {email, generatedID} = req.body;
    try{
        let getsub =  await subscription.find({email:email, subcribed:true});
      
        let day = new Date().getDate().toString()
        let month = new Date().getMonth() +1
        let year = new Date().getFullYear().toString()
        let insertedrollover = getsub[0].rollover
        let frequency =  getsub[0].frequency;
        let count = await ordersub.find({email:email, day:day, month: month, year:year})
      let coountfood = count.filter(item=>{
        return item.category != '4'
    })

    if (coountfood.length > frequency +1){
        let roll = insertedrollover +1
        console.log(roll)
        
        await subscription.updateOne({email:email, subcribed:true},{rollover:roll});
        await ordersub.deleteMany({generatedid:generatedID, order:false})
        return res.json({success:'success', msg:"Deleted Successfully"})
    }else{
        await ordersub.deleteMany({generatedid:generatedID, order:false})

        return res.json({success:'success', msg:"Deleted Successfully"})
    }
      
    }catch(e){
        return res.json({success:'fail', msg:"Something went wrong"})
    }
    
  })

  router.route("/cartsub").post(async (req,res)=>{
    const {email, id, category,  packagename, image} = req.body;
 
   let getsub =  await subscription.find({email:email, subcribed:true});
  

   if(getsub.length != 0){
    let frequency =  getsub[0].frequency;
    let coundrink1 = getsub[0].drink1;
    let coundrink2 = getsub[0].drink2;
    let coundrink3 = getsub[0].drink3;
    
   
   
    function countdri(){
     let   drinks = 0;
     if(coundrink1 != ""){
       
        drinks = drinks+1
     }
      if(coundrink2 != ""){
      
        drinks = drinks+1
       
     }
      if(coundrink3 != ""){
        drinks = drinks+1
      
     }
     return drinks
    }
        let expire = getsub[0].expiredate;
        let createat = getsub[0].date;

        let insertedrollover = getsub[0].rollover
      
        function createId(){ 
            function makeid(length) {
                var result           = '';
                var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for ( var i = 0; i < length; i++ ) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
              
        var random = Math.floor(10000000000000 + Math.random() * 90000000000000)
                        return random+makeid(8);
      }
    
      let day = new Date().getDate().toString()
      let month = new Date().getMonth() +1
      let year = new Date().getFullYear().toString()

      
       let count = await ordersub.find({email:email, day:day, month: month, year:year})
      let coountfood = count.filter(item=>{
        return item.category != '4'
    })
    let coountdrink = count.filter(item=>{
        return item.category == '4'
    })

     if(category == '4'){
        if(coountdrink.length  < countdri()  ){
            await ordersub.create({
                email:email,
                id:id,   
                order:false,
                generatedid: createId(8),       
                status:'6',
                category:category,
                packagename:packagename,
                image:image,
                day:day,
                month:month.toString(),
                year:year,
                date:new Date(),
                createdAt: createat,
                expire: expire
            })    
            return res.json({success:'success', msg:"Added to cart"})
           }else{
            return res.json({success:'fail', msg:"You have exceeded your daily order"})
           }
     }else{
       
        if(coountfood.length  < frequency +1 ){
            await ordersub.create({
                email:email,
                id:id,   
                order:false,
                generatedid: createId(8),       
                status:'6',
                category:category,
                packagename:packagename,
                image:image,
                day:day,
                month:month.toString(),
                year:year,
                date:new Date(),
                createdAt: createat,
                expire: expire
            })    
            return res.json({success:'success', msg:"Added to cart"})
           }else if( insertedrollover != 0 ){
            console.log(insertedrollover)
            await ordersub.create({
                email:email,
                id:id,
                order:false,
                generatedid: createId(8),
                status:'6',
                category:category,
                packagename:packagename,
                image:image,
                day:day,
                month:month.toString(),
                year:year,
                date:new Date(),
                createdAt: createat,
                expire: expire
            })
            let roll = insertedrollover -1;
            await subscription.updateOne({email:email, subcribed:true},{rollover:roll});
            return res.json({success:'success', msg:"Added to cart"})
           }
    
        else{
            return res.json({success:'fail', msg:"You have exceeded your daily order"})
           }
     }
       
   }else{
    return res.json({success:'fail', msg:"You don't have subscription plan"})
   }    
    })
    router.route("/getcartsub").post(async (req,res)=>{
        const {email} = req.body
        let getcartsub = await ordersub.find({email:email, order:false})
        return res.json({details:getcartsub})
    })

  router.route("/ordersub").post(async (req,res)=>{
    const {email, name, phone, location, address} = req.body;

      function createordernumber(){ 
        function makeid(length) {
            var result           = '';
            var characters       = '0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
          
   
                    return makeid(6);
  }
      try{
        await ordersub.updateMany({order:false, email:email},{
            order:true, ordernum:createordernumber(), name:name,phone:phone,location:location,address:address, status:'1',date:new Date(),
         })
         return res.json({success:'success', msg:"Order Placed Successfully"})
      }catch(e){
        return res.json({success:'fail', msg:"Something Went wrong"})
      }
    
    })





  router.route('/subhistory').post( async (req, res)=>{
    const {email} = req.body;
    const page = parseInt(req.query.page) 
    const limit = parseInt(req.query.limit) 
  const startIndex = (page -1) * limit
  const endIndex = page * limit
 async function getcart()  {
    
    let result = []
     
         const getcartId = await ordersub.find({email:email});
         if(typeof getcartId != "undefined"
         && getcartId != null
         && getcartId.length != null
         && getcartId.length > 0){
             result = [...getcartId, ... result];
            
         }
        console.log(result.length)
      let date = new Date();
      let getsub = await subscription.find({email:email, subcribed:true})
     if(getsub.length != 0){
        let rollover = getsub[0].rollover
        const pagnited = {}
      pagnited.pagnited = result.reverse().slice(startIndex, endIndex)
      if(endIndex < result.length ){
        pagnited.next = {
            page: page + 1,
            limit : limit,
         }
      }else{
        pagnited.next = {
            page: page ,
            limit : limit,
         }
      }
     if(startIndex > 0){
        pagnited.previous = {
            page: page - 1,
            limit : limit,
         }
     }  else{
        pagnited.previous = {
            page: page,
            limit : limit,
         }
     } 

      res.json({status: 'success', result: pagnited, date:date, rollover:rollover, totalordered:result.length}) 
     }
     return result;
 }
 getcart();
  })


  router.route('/subsciption').post( async (req, res)=>{
    const {email} = req.body

    let getsubdetails = await subscription.find({email:email, subcribed:true})
    let newplan = await subscription.find({email:email, newplan:true})
   
   function newpland(){
    let newl = false
    if(newplan.length != 0){
      newl = newplan[0].newplan
    }
    return newl
   } 
    if(getsubdetails.length != 0){
        let date = new Date();
        var start = moment(date);
var end = moment(getsubdetails[0].date);

//Difference in number of days
let diff =moment.duration(start.diff(end)).asDays();
      // let diff = moment(getsubdetails[0].date).fromNow().asDays();
    //    let diff = date.getDate() - getsubdetails[0].date.getDate()



        return res.json({startdate:getsubdetails[0].date, expiredate:getsubdetails[0].expiredate, currentdate:date, newplan:newpland(), frequency:getsubdetails[0].frequency, dayuse: parseInt(diff) + 1})
    }
  })

  router.route('/updateaddress').post( async (req, res)=>{
    const {email, address,  phone, location} = req.body
    console.log(phone)
    console.log(location)
    try{
        let getsubdetails = await Users.find({email:email})
        if(getsubdetails.length != 0){
            await Users.updateOne({email:email}, {address:address, phone:phone, location:location})
            return res.json({status:'Success', msg:'Updated Succesfully'})
        }else{
            return res.json({status:'fail', msg:'user do not exist'})
        }
      
    }catch(e){
        return res.json({status:'fail', msg:'Something Went wrong'})
    }
   
  })

  router.route('/createcoupon').post( async (req, res)=>{

    const {amount, discount, type} = req.body
  let number =  await createcoup(amount, type,discount)
     console.log(number)
  })


  router.route('/verifycoupon').post( async (req, res)=>{

    const {code} = req.body

    try{
     let checkcode = await coupon.find({code:code});
     if(checkcode == 0){
        return res.json({status:'fail', msg:'Code does not exist or has been used',  type:'nothing'})
     }else{
        let currentdate = new Date().getDate();
        let amount = checkcode[0].amount;
        let type = checkcode[0].type;
        let discount = checkcode[0].discount
        let expire = checkcode[0].expire
        if(expire.getDate() < currentdate){
            return res.json({status:'fail', msg:'This code have been expired', type:'nothing'})
        }
        return res.json({status:'success', msg:'Successfully', amount:amount, type:type, discount:discount})
     }      
        }
    catch(e){
        return res.json({status:'fail', msg:'Something Went wrong',  type:'nothing'})
    }
  })
 
async function createcoup(amount, type, discount){
  
   let status = '';
    let date = new Date();
    let date2 = new Date();
    let expire = date2.setDate(date2.getDate() +(3));
    try{
        function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        let code = makeid(8)
        let checkcode = await coupon.find({code:code});
        if(checkcode != 0){
            status = 0
                return status
        }else{
            if(type == 'discount'){
                coupon.create({
                    code:code,
                    amount:0,
                    discount:discount,
                    type:type,
                    created:date,
                    expire:expire
                })
                status = code
                return status
            }else if(type == 'money'){
                coupon.create({
                    code:code,
                    amount:amount,
                    discount:0,
                    type:type,
                    created:date,
                    expire:expire
                })
                status = code
                return status
            } 
        }
       
    }catch(e){
        status = 0
                return status
    }
    return status;
}


router.route("/sendrecoverotp").post( async (req,res)=>{
    const {email} = req.body;
    let emailuse = email.toLowerCase().trim();
   try{
    await recoverotp.deleteMany({email:emailuse});
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailoptions = {
        from: "foodiedelicacies@gmail.com",
        to: email,
        subject: "Recover Your Password",
        html: `<p>Enter <b>${otp}</b> in your app to change your password</p>`
    };
    const saltround = 10;
    const hashotp = await bcrypt.hash(otp, saltround);
    let findmail = await Users.find({email:emailuse})

    if(findmail.length != 0){
        await  recoverotp.create({
            email:emailuse,
            otp:hashotp,
            createdAt:Date.now(),
            expiresAt:Date.now() + 60000,
        })
       
        await transporter.sendMail(mailoptions);
        return res.json({
            success:'true',
            msg:'Otp sent successfully',
    
        })
    }else{
        return res.json({
            success:'false',
            msg:'Email does not exit in our database',
    
        })
    }
   
   }catch(error){
    return res.json({
        success:'false',
        msg:'Something Went Wrong',

    })
   }
})


router.route("/resendrecoverOTP").post( async (req,res)=>{
    const {email} = req.body;
    try{
        let emailuse = email.toLowerCase().trim();
        await recoverotp.deleteMany({email:emailuse});
     const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
     const mailoptions = {
        from: "foodiedelicacies@gmail.com",
        to: email,
        subject: "Recover Your Password",
        html: `<p>Enter <b>${otp}</b> in your app to change your password</p>`
    };
     const saltround = 10;
     const hashotp = await bcrypt.hash(otp, saltround);
 
     await  recoverotp.create({
         email:emailuse,
         otp:hashotp,
         createdAt:Date.now(),
         expiresAt:Date.now() + 60000,
     })
     
     await transporter.sendMail(mailoptions);
     return  res.json({
         success:'true',
         msg:'Otp sent successfully',
 
     })
    }catch(error){
        return res.json({
         success:'false',
         msg:'Something Went Wrong',
 
     })
    }
})


router.route("/verifynewpassword").post( async (req,res)=>{
    const {email, otp, password} = req.body;
  
    try{
        let emailuse = email.toLowerCase().trim();

        let otpverificationsRecords = await recoverotp.find({email:emailuse});
            if(otpverificationsRecords.length == 0){
              return  res.json({
                    success:'false',
                    msg:'Account Does not exist or it has been verified successfully'
                });
            }else{
        let expiresAt = otpverificationsRecords[0].expiresAt;
        let hashotp = otpverificationsRecords[0].otp;

        const saltround = 10;
        const hashpassword = await bcrypt.hash(password, saltround);
        let date = new Date()
        console.log(date.getTime() )
        if(expiresAt.getTime() < date.getTime()){
            console.log(expiresAt.getTime() )
              await otpverifications.deleteMany({email:emailuse});
              return  res.json({
                expiresAt:expiresAt,
             success:'false',
             msg:'Otp has Expired, Please request a new one'
         })
         }else{
            
    bcrypt.compare(otp, hashotp).then(async (match )=>{
      if (!match) {
        return  res.json({
                     success:'false',
                     msg:'OTP is incorrect',
                 })
      } else {
        await Users.updateOne({email:emailuse},{password:hashpassword});
             await recoverotp.deleteMany({email:emailuse});
             return res.json({
                 success:'true',
                 msg:'Password changed Successfully',
             })
      }
    
    })
}
}

}catch(error){
res.json({
success:'false',
msg:error,
})
}
})
router.route("/getimageslider").get( async (req,res)=>{
    
try{
   return res.json({success:'success', item:itemsslide})
}catch(e){
    return res.json({success:'fail', item:''})
} 
})

router.route("/insertingref").post( async (req,res)=>{
    
    const {Id, ref} = req.body;
try{
 
    let checkuser = await updatepayment.find({id:Id})
    if(checkuser.length != 0){
        await updatepayment.deleteMany({id:Id})
        await updatepayment.create({
            id:Id,
            payment_ref:ref,
            done:'waiting'
        })
        return res.json({success:'success'})
    }else{
        await updatepayment.create({
            id:Id,
            payment_ref:ref,
            done:'waiting'
        })
        return res.json({success:'success'})
    }
}catch(e){
    return res.json({success:'fail'})
} 
})

router.route("/confirmingref").post( async (req,res)=>{
    const {email} =req.body
try{
    console.log(email);
    await updatepayment.updateMany({id:email}, {done:'paid'})
    return res.json({success:'success'})
}catch(e){
    return res.json({success:'fail'})
} 
})

router.route("/failedref").post( async (req,res)=>{
    const {email} =req.body
try{
    console.log(email)
    await updatepayment.updateMany({id:email}, {done:'failed'})
    return res.json({success:'success'})
}catch(e){
    return res.json({success:'fail'})
} 
})

router.route("/verifyref").post( async (req,res)=>{
    const {email} =req.body
try{
   let getdata = await updatepayment.find({id:email})
   if(getdata.length != 0){
    let done = getdata[0].done
    return res.json({success:'success', msg:done})
   }else{
    return res.json({success:'success', msg:'empty'})
   }
  
}catch(e){
    return res.json({success:'fail'})
} 
})

router.route("/deleteaccount").post( async (req,res)=>{
    const {email} =req.body
try{
   let getdata = await subscription.find({email:email, subcribed:true})
  
   if(getdata.length != 0){
    return res.json({success:'fail', msg:"You can't delete your account while you have a subscription"})
   }
  else{
    let getuser = await Users.find({email:email})
   
    if(getuser.length != 0){
        await Users.deleteMany({email:email})
        return res.json({success:'success', msg:'Account Deleted succesfully'})
    }else{
        return res.json({success:'fail', msg:"You don't have an account with us"})
    }
   }
}catch(e){
    console.log(e);
    return res.json({success:'fail', msg:'Something went wrong'})
} 
})
// async function monitorListingsUsingEventEmitter(timeInMs = 60000, pipeline = []) {
//  //   const collection = client.db("sample_airbnb"). collection ("listingsAndReviews");
//     const changeStream = updatepayment.watch(pipeline);
//     changeStream.on('change', (next) => {
//         console.log(next.documentKey);
//     });

//     // await closeChangeStream(timeInMs, changeStream)
// }

// function closeChangeStream (timeInMs = 60000, changeStream) {
//     return new Promise((resolve) => {
//     setTimeout(() =>{
//     console.log("Closing the change stream");
//     changeStream.close ();
//     resolve();
//      }, timeInMs )
//     })
// }
 // monitorListingsUsingEventEmitter(15000)


  
module.exports = router;