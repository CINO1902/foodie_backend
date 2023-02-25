var CronJob = require('cron').CronJob;

const subscription = require("./model/subscription");
const ordersub = require("./model/ordersub");
const moment = require("moment");
let time = false;
var job = new CronJob(
	'* 4 21 * * *',
	async function () {
        let date = new Date().toLocaleDateString()
		
      let result = await subscription.find({subcribed:true})
       
        let list = []
        for(let i=0; i< result.length; i++){
            list.push(result[i].email)
        }
       
        async function getsub() {
      for(let i=0; i<list.length; i++) {
        let getdate = await  ordersub.find({email:list[i]});
      
        let now = new Date();
        let filtered = getdate.filter(item => {
            let date = new Date(item.date);
          
            return now.getDate() == date.getDate() && now.getMonth() == date.getMonth() && now.getFullYear() == date.getFullYear();
         });
     
       let getfrequency =  await subscription.find({email:list[i], subcribed:true});
   
       let frequency = getfrequency[0].frequency;
       let getroll = getfrequency[0].rollover;
       console.log(frequency)
       if(filtered.length < (frequency+1) ){
        let getrollover = (frequency+1) - filtered.length;

        if(getroll <6){
            let updateroll = getrollover + getroll;
            function roll(){
                let roll = 0
                if(updateroll <= 5){
                    roll = updateroll
                }else{
                    roll = 5
                }
                return roll;
            }
            
           
            await subscription.updateOne({email:list[i], subcribed:true},{rollover:roll()});
          
          
        }

       }

        }
        }

        async function activateuser(){
            let checkrolloverusers = await subscription.find({newplan:true})

            if(checkrolloverusers!= 0){
                for(let i=0; i< checkrolloverusers; i++){
                    let email = checkrolloverusers[i].email;
                    let newsubid = checkrolloverusers[i].subid;
                    let findcurrentplan = await subscription.find({email:email, subcribed:true})
                    let date = new Date();
                    let expiredate = findcurrentplan[i].expiredate;
                    let currentsubid = findcurrentplan[i].subid
                    if(date == expiredate){
                        await subscription.updateOne({subid:currentsubid},{subcribed:false});
                        await subscription.updateOne({subid:newsubid},{subcribed:true, newplan:false});
                        await notification.create({
                            id: email,
                            notification_type:8,
                            date:date
                         })
                    }
                }
            }
        }
        async function deactivateuser(){
            let nonactiveuser = await subscription.find({subcribed:true})

            if(nonactiveuser!= 0){
                for(let i=0; i< nonactiveuser; i++){
                    let expire = nonactiveuser[i].expiredate;
                    let newsubid = nonactiveuser[i].subid;
                    let email = nonactiveuser[i].email
                    await notification.create({
                          id: email,
                          notification_type:9,
                          date:date
                       })
                  
                    let date = new Date();
                   
                    if(date == expire){
                        await subscription.updateOne({subid:newsubid},{subcribed:false});
                     
                    }
                }
            }
        }deactivateuser()
        activateuser()
        getsub()
        setinter()
       
      
    
       
	},
	null,
	true,
	'Africa/Lagos'
);
function setinter(){
        job.stop()  
}





