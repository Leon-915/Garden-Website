

var stripe = require("stripe")("sk_test_JRhqrzUHUqG7i7AOtCFZLZPF");


function createPlan(product,interval,nickname,amount,intervalCount,callback)
{
    stripe.plans.create({
    product: product,
    currency: 'eur',
    interval: interval,
    interval_count:intervalCount,
    nickname: nickname,
    amount: amount,
},function(err,plan)
{
  callback(plan,err); 
});
}

function attachPaymentSourceToCustomer(token,customer,callback)
{
    stripe.customers.update(customer, {
       source: token
    }, function(err) {
  // asynchronously called
     callback(err); 
    /*if (!err)
    {
          stripe.customers.update(customer, {
          default_source: token
          }, function(err) { callback(err); });
         
    }else
    {
        console.log("ERROR UPDATE SOURCE----- "  +  err);

        callback(err); 

    }*/
    
     

  });
}

module.exports = {





processPayment: function (token,user,job,callback)
{



var cost =   job.cost * 100;
var customer  =  user.stripe_customerid ;
var description  =  "Once of job for  "+ user.email ;
var tokenId  =  token.id;//"tok_1CEWRnAoxEO9v5iRhzYLc00c" ; //token.id;
var jobType  =  job.servicerequied;//"tok_1CEWRnAoxEO9v5iRhzYLc00c" ; //token.id;
var _job  =  job;


console.log("JOB TYPE -=------------------- " + job.servicerequied );
console.log("AMOUNT -=------------------- " + job.cost );

console.log("USER CUST ID -=------------------- " + user.stripe_customerid  );
console.log("description -=------------------- " + description  );

attachPaymentSourceToCustomer(tokenId,customer,function(err)
{

      //monthly == prod_CdoP8cwddu5LJj
     //weekly ==  prod_CdoOW8dBhISwqT
    if (err){


         callback(err,err);

    }else
    {
       if(jobType == 4)
       {

        //createPlan(product,interval,nickname,amount,callback)
          createPlan("prod_CgXETn6kikQ7Ov","month","Mothly Service "+user.email,cost,1,function(plan,err)
            {

                 if(err)
                 {
                    callback(plan, err);
                 }else{

                       stripe.subscriptions.create({
                                customer: customer,
                                  items: [{plan: plan.id}],
                         }, function(err)
                         {
                          _job.subscription = true;
                          _job.subscriptionID = plan.id;
                            callback(_job, err);
                         });

                 }


            });
       }

       if(jobType == 3)
       {

        //createPlan(product,interval,nickname,amount,callback)
          createPlan("prod_CgXDih9P9SXOa5","day","By-Weekly Service "+user.email,cost,14,function(plan,err)
            {

                 if(err)
                 {
                    callback(plan, err);
                 }else{

                       stripe.subscriptions.create({
                                customer: customer,
                                  items: [{plan: plan.id}],
                         }, function(err)
                         {
                          _job.subscription = true;
                          _job.subscriptionID = plan.id;
                            callback(_job, err);
                         });

                 }


            });
       }

       if(jobType == 2)
       {
         createPlan("prod_CgXDih9P9SXOa5","week","Weekly Service "+user.email,cost,1,function(plan,err)
            {

                 if(err)
                 {
                    callback(plan, err);
                 }else{
                     
                         stripe.subscriptions.create({
                                customer: customer,
                                  items: [{plan: plan.id}],
                         }, function(err)
                         {
                            _job.subscription = true;
                            _job.subscriptionID = plan.id;
                            callback(_job, err);
                         });
                       

                 }


            });
       }

       if(jobType == 1)
       {
             stripe.charges.create(
              {
                amount: cost,
                currency: "eur",
                description: description,
                customer: customer,
                }, function(err, charge) {
                 // asynchronously called
    
                    console.log("CHARGE----- "  +  charge);
                      console.log("ERROR----- "  +  err);

                    callback(_job, err); 
     

              });
       }

      

     


     
    }
  });

   //attachPaymentSourceToCustomer
    

  
    

},

createStripeUser: function(email,callback)
{
   console.log("USER EMAIL----- "  +  email);
    stripe.customers.create({
      email: email
  
  }, function(err, stripeuser) {
  // asynchronously called
    
    console.log("USER ----- "  +  stripeuser);
    console.log("ERROR----- "  +  err);

    callback(stripeuser, err); 
     

  });
}, 

createSubscriptionForUser: function(customer,plan)
{
	 stripe.subscriptions.create({
    customer: customer,
    items: [{plan:plan}],
  });
} 



  
};