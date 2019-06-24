var express = require('express');
var util = require("util");
var router = express.Router();
var jobs = require('../models/jobs.js');
var nodemailer = require('nodemailer');
var Users = require('../models/users.js');
var payment = require('../routes/stripe.js');
var unirest = require('unirest');
var transporter = nodemailer.createTransport({
  service: 'gmail',

  auth: {
            user: 'gardenhelp100@gmail.com', // generated ethereal user
            pass: 'gardenhelp2018'  // generated ethereal password
          }
        });

function createTaskInTokan(user,job)
{



    var parameters = {
        "customer_email":user.email,
        "order_id":job._id.toString(),
        "customer_username":user.firstname+" "+user.lastname,
        "customer_phone":job.contactnumber,
        "customer_address":job.jobaddress+" "+"Postal Code"+" "+job.postcode,
        //"latitude":job.latitude,
        //"longitude":job.longitude,
        "job_description":"Garden services",
        "job_pickup_datetime":job.jobdate.toString(),
        "job_delivery_datetime":job.jobdate.toString(),
        "has_pickup":"0",
        "has_delivery":"0",
        "layout_type":"1",
        "tracking_link":1,
        "timezone":"-330",
        "custom_field_template":"Home_Services",
        "meta_data": [],
        "api_key":"53666380f80a0c145a556b31411021441fe1c6ff2fd9733a5e18",
        "team_id":"15460",
        "auto_assignment":"0",
        "fleet_id":"",
        "ref_images":job.images,
        "notify":1,
        "tags":"",
        "geofence":0
    };

    unirest.post('https://api.tookanapp.com/v2/create_task')
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
    .send(parameters)
    .end(function (response) {
      console.log("TOOKAN TASK RESPONSE");
      console.log(response.body);
    });
}



function getMailHtml(user,job)
{

  console.log("user ----" +  user);
  var images =  job.images

  var imageHtml = ""
  var selectedServices = ""

  var servicesArray = ["Grass cutting","Power washing","Lawn Care","Strimming","Weeding","Leaf clean up","Planting Services","Pruning Hedge cutting (max 6ft ht) Mulching","Fertilizing","Lawn Edging"];
  var servicesRepeatTYpeArray = ["Once off","Weekly","Bi Weekly","Monthly"];
  for(var i = 0; i < images.length;i++){

   imageHtml += '<img src="https://s3-eu-west-1.amazonaws.com/gardenhelp/property/images/'+images[i]+'" width="200" height="200" alt="" border="0" style="height: auto; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;">'
 }

 for(var i = 0; i < job.services.length;i++){

   selectedServices += servicesArray[job.services[i]-1]+",";
 }

 console.log(job);

 return '<html><head><title>Page Title</title><style>'+
 'html,body { margin: 0 auto !important;padding: 0 !important;height: 100% !important;width: 100% !important;}'+
 '* {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;}'+
 'div[style*="margin: 16px 0"] {margin:0 !important;}table,td {mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;}'+
 'table {border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;}'+
 'table table table {table-layout: auto;}'+
 'img { -ms-interpolation-mode:bicubic;}'+
 ' *[x-apple-data-detectors], .x-gmail-data-detectors, .x-gmail-data-detectors *, .aBn {border-bottom: 0 !important; cursor: default !important; color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }'+
 '.a6S {display: none !important; opacity: 0.01 !important; } img.g-img + div {display:none !important; } .button-link {text-decoration: none !important; }'+
 '@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {.email-container {min-width: 375px !important; } } .button-td, .button-a {transition: all 100ms ease-in; } .button-td:hover, .button-a:hover {background: #555555 !important; border-color: #555555 !important; } @media screen and (max-width: 600px) {.email-container p {font-size: 17px !important; line-height: 22px !important; } }</style>'+
 '</head> <body width="100%" bgcolor="#f2f2f2" style="margin: 0; mso-line-height-rule: exactly;"> <center style="width: 100%; background: #f2f2f2; text-align: left;"> <tr>'+
 '<td bgcolor="#ffffff" align="center" height="100%" valign="top" width="100%" style="padding-bottom: 40px"> <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;"> <tr> <td style="padding: 20px 0; text-align: center"> <img src="http://gardenhelp.ie/wp-content/uploads/2016/05/Garden-Help-Logo.png" width="200" height="50" alt="alt_text" border="0" style="height: auto; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;"> </td> </tr> </table>'+

 '<table role="presentation" border="0" bgcolor="#ffffff" cellpadding="0" cellspacing="0" align="center" width="100%" style="max-width:560px;"> <tr> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> <td style="padding: 40px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555; text-align: center;">  <h1 style="margin: 0 0 25px 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #333333; font-weight: normal;">'+user.firstname+', sent a new enquiry</h1> </td> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> </tr> <tr> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> <td  style="padding: 0 10px; font-family: sans-serif; font-size: 17px; font-weight: bold; line-height: 20px; color: #555555;"> <p style="margin: 0;">Please find the job details below:</p> </td> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> </tr><tr>'+


 '<td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> <td align="center" valign="top" width="90%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"> <br/>'+ 

 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Order ID</p>'+
 '<p style="margin: 0;">'+job._id.toString()+'</p><br/>'+

 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Contact</p>'+
 '<p style="margin: 0;">'+job.contactnumber+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Email</p>'+
 '<p style="margin: 0;">'+user.email+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Address</p>'+
 '<p style="margin: 0;">'+job.jobaddress+'</p><br/><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Postal Code</p>'+
 '<p style="margin: 0;">'+job.postcode+'</p><br/><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Property size</p>'+
 '<p style="margin: 0;">'+job.propertysize+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Selected Services</p>'+
 '<p style="margin: 0;">'+selectedServices+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">How often do your require your service</p>'+
 '<p style="margin: 0;">'+servicesRepeatTYpeArray[job.servicerequied-1]+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Green waste removed?</p>'+
 '<p style="margin: 0;">'+job.greenwasteremoval.toString()+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Access to property?</p>'+
 '<p style="margin: 0;">'+job.accesstoproperty.toString()+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Gate Width</p>'+
 '<p style="margin: 0;">'+job.gatewidth+' feet </p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Are their pets present?</p>'+
 '<p style="margin: 0;">'+job.pets.toString()+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">When your property was last maintained?</p>'+
 '<p style="margin: 0;">'+job.lastmaintained+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Property Description</p>'+
 '<p style="margin: 0;">'+job.propertydetails+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Other Services</p>'+
 '<p style="margin: 0;">'+job.extradetails+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Location</p>'+
 '<p style="margin: 0;">'+job.location+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Work Hours</p>'+
 '<p style="margin: 0;">'+job.workhours+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Cost</p>'+
 '<p style="margin: 0;">'+job.cost+'</p><br/>'+
 '<p style="margin: 0; font-size: 14px; font-weight: bold;">Date of service</p>'+
 '<p style="margin: 0;">'+job.jobdate.toString()+'</p><br/>'+imageHtml+
 '</td> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> </tr> <tr> <td align="center" valign="top" bgcolor="#709f2b" width="100%" colspan="3" height="10"></td> </tr> </table> </td> </tr> </center> </body> </html>'

  /*return '<html><head><title>Page Title</title></head><body><tr>' +
          '<td bgcolor="#ffffff" align="center" height="100%" valign="top" width="100%" style="padding-bottom: 40px">'+
           '<table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="max-width:560px;"><tr>'+
              
                '<td align="center" valign="top" width="70%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"><br/><p style="margin: 0; font-size: 14px; font-weight: bold;">What is your property size?</p>'+
                '<p style="margin: 0;">'+job.propertysize+'</p><br/>'+                                     
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">Number of hours?</p>'+
                                                '<p style="margin: 0;">3</p><br/>'+
                                                                                     
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">Green waste removed?</p>'+
                                                '<p style="margin: 0;">'+job.greenwasteremoval.toString()+'</p><br/>'+
                                                                                     
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">When your property was last maintained?</p>'+
                                                '<p style="margin: 0;">'+job.lastmaintained+'</p><br/>'+
                                                                                     
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">Property Description</p>'+
                                                '<p style="margin: 0;">'+job.propertydetails+'</p>'+
                                                '<br/>'+                                     
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">Location</p>'+
                                                '<p style="margin: 0;">'+job.location+'</p>'+
                                                '<br/>'+ 
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">Work Hours</p>'+
                                                '<p style="margin: 0;">'+job.workhours+'</p>'+
                                                '<br/>'+                                     
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">Date of service (mm/dd/yyyy)</p>'+
                                                '<p style="margin: 0;">'+job.jobdate.toString()+'</p><br/>'+
                         '<p style="margin: 0; font-size: 14px; font-weight: bold;">Contact</p>'+
                                                '<p style="margin: 0;">'+job.contactnumber+'</p><br/>'+
                         '<p style="margin: 0; font-size: 14px; font-weight: bold;">Email</p>'+
                                                '<p style="margin: 0;">'+useremail+'</p><br/>'+
                                                '</td></tr></table></td></tr></body></html>'*/

                                              }


                                              function getUserConformationMailHtml(user,job)
                                              {

                                                console.log("user ----" +  user);
                                                var images =  job.images

                                                var imageHtml = ""
                                                var selectedServices = ""

                                                var servicesArray = ["Grass cutting","Power washing","Lawn Care","Strimming","Weeding","Leaf clean up","Planting Services","Pruning Hedge cutting (max 6ft ht) Mulching","Fertilizing","Lawn Edging"];
                                                var servicesRepeatTYpeArray = ["Once off","Weekly","Bi Weekly","Monthly"];
                                                for(var i = 0; i < images.length;i++){

                                                 imageHtml += '<img src="https://s3-eu-west-1.amazonaws.com/gardenhelp/property/images/'+images[i]+'" width="200" height="200" alt="" border="0" style="height: auto; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;">'
                                               }

                                               for(var i = 0; i < job.services.length;i++){

                                                 selectedServices += servicesArray[job.services[i]-1]+",";
                                               }

                                               console.log(job);

                                               return '<html><head><title>Page Title</title><style>'+
                                               'html,body { margin: 0 auto !important;padding: 0 !important;height: 100% !important;width: 100% !important;}'+
                                               '* {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;}'+
                                               'div[style*="margin: 16px 0"] {margin:0 !important;}table,td {mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;}'+
                                               'table {border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;}'+
                                               'table table table {table-layout: auto;}'+
                                               'img { -ms-interpolation-mode:bicubic;}'+
                                               ' *[x-apple-data-detectors], .x-gmail-data-detectors, .x-gmail-data-detectors *, .aBn {border-bottom: 0 !important; cursor: default !important; color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }'+
                                               '.a6S {display: none !important; opacity: 0.01 !important; } img.g-img + div {display:none !important; } .button-link {text-decoration: none !important; }'+
                                               '@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {.email-container {min-width: 375px !important; } } .button-td, .button-a {transition: all 100ms ease-in; } .button-td:hover, .button-a:hover {background: #555555 !important; border-color: #555555 !important; } @media screen and (max-width: 600px) {.email-container p {font-size: 17px !important; line-height: 22px !important; } }</style>'+
                                               '</head> <body width="100%" bgcolor="#f2f2f2" style="margin: 0; mso-line-height-rule: exactly;"> <center style="width: 100%; background: #f2f2f2; text-align: left;"> <tr>'+
                                               '<td bgcolor="#ffffff" align="center" height="100%" valign="top" width="100%" style="padding-bottom: 40px"> <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;"> <tr> <td style="padding: 20px 0; text-align: center"> <img src="http://gardenhelp.ie/wp-content/uploads/2016/05/Garden-Help-Logo.png" width="200" height="50" alt="alt_text" border="0" style="height: auto; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;"> </td> </tr> </table>'+

                                               '<table role="presentation" border="0" bgcolor="#ffffff" cellpadding="0" cellspacing="0" align="center" width="100%" style="max-width:560px;"> <tr> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> <td style="padding: 40px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555; text-align: center;">  <h1 style="margin: 0 0 25px 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #333333; font-weight: normal;">'+user.firstname+', sent a new enquiry</h1> </td> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> </tr> <tr> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> <td  style="padding: 0 10px; font-family: sans-serif; font-size: 17px; font-weight: bold; line-height: 20px; color: #555555;"> <p style="margin: 0;">Please find the job details below:</p> </td> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> </tr><tr>'+


                                               '<td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> <td align="center" valign="top" width="90%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"> <br/>'+ 

                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Order ID</p>'+
                                               '<p style="margin: 0;">'+job._id.toString()+'</p><br/>'+

                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Contact</p>'+
                                               '<p style="margin: 0;">'+job.contactnumber+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Email</p>'+
                                               '<p style="margin: 0;">'+user.email+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Address</p>'+
                                               '<p style="margin: 0;">'+job.jobaddress+'</p><br/><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Postal Code</p>'+
                                               '<p style="margin: 0;">'+job.postcode+'</p><br/><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Property size</p>'+
                                               '<p style="margin: 0;">'+job.propertysize+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Selected Services</p>'+
                                               '<p style="margin: 0;">'+selectedServices+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">How often do your require your service</p>'+
                                               '<p style="margin: 0;">'+servicesRepeatTYpeArray[job.servicerequied-1]+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Green waste removed?</p>'+
                                               '<p style="margin: 0;">'+job.greenwasteremoval.toString()+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Access to property?</p>'+
                                               '<p style="margin: 0;">'+job.accesstoproperty.toString()+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Gate Width</p>'+
                                               '<p style="margin: 0;">'+job.gatewidth+' feet </p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Are their pets present?</p>'+
                                               '<p style="margin: 0;">'+job.pets.toString()+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">When your property was last maintained?</p>'+
                                               '<p style="margin: 0;">'+job.lastmaintained+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Property Description</p>'+
                                               '<p style="margin: 0;">'+job.propertydetails+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Other Services</p>'+
                                               '<p style="margin: 0;">'+job.extradetails+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Location</p>'+
                                               '<p style="margin: 0;">'+job.location+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Work Hours</p>'+
                                               '<p style="margin: 0;">'+job.workhours+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Cost</p>'+
                                               '<p style="margin: 0;">'+job.cost+'</p><br/>'+
                                               '<p style="margin: 0; font-size: 14px; font-weight: bold;">Date of service</p>'+
                                               '<p style="margin: 0;">'+job.jobdate.toString()+'</p><br/>'+imageHtml+
                                               '</td> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> </tr> <tr> <td align="center" valign="top" bgcolor="#709f2b" width="100%" colspan="3" height="10"></td> </tr> </table> </td> </tr> </center> </body> </html>'

  /*return '<html><head><title>Page Title</title></head><body><tr>' +
          '<td bgcolor="#ffffff" align="center" height="100%" valign="top" width="100%" style="padding-bottom: 40px">'+
           '<table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" width="100%" style="max-width:560px;"><tr>'+
              
                '<td align="center" valign="top" width="70%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"><br/><p style="margin: 0; font-size: 14px; font-weight: bold;">What is your property size?</p>'+
                '<p style="margin: 0;">'+job.propertysize+'</p><br/>'+                                     
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">Number of hours?</p>'+
                                                '<p style="margin: 0;">3</p><br/>'+
                                                                                     
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">Green waste removed?</p>'+
                                                '<p style="margin: 0;">'+job.greenwasteremoval.toString()+'</p><br/>'+
                                                                                     
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">When your property was last maintained?</p>'+
                                                '<p style="margin: 0;">'+job.lastmaintained+'</p><br/>'+
                                                                                     
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">Property Description</p>'+
                                                '<p style="margin: 0;">'+job.propertydetails+'</p>'+
                                                '<br/>'+                                     
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">Location</p>'+
                                                '<p style="margin: 0;">'+job.location+'</p>'+
                                                '<br/>'+ 
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">Work Hours</p>'+
                                                '<p style="margin: 0;">'+job.workhours+'</p>'+
                                                '<br/>'+                                     
                        '<p style="margin: 0; font-size: 14px; font-weight: bold;">Date of service (mm/dd/yyyy)</p>'+
                                                '<p style="margin: 0;">'+job.jobdate.toString()+'</p><br/>'+
                         '<p style="margin: 0; font-size: 14px; font-weight: bold;">Contact</p>'+
                                                '<p style="margin: 0;">'+job.contactnumber+'</p><br/>'+
                         '<p style="margin: 0; font-size: 14px; font-weight: bold;">Email</p>'+
                                                '<p style="margin: 0;">'+useremail+'</p><br/>'+
                                                '</td></tr></table></td></tr></body></html>'*/

                                              }


                                              function getMailOption(user, createdJob) {
                                                var mailOptions = {
                                                  from: 'gardenhelp100@gmail.com',
                                                  to: "gardenhelp100@gmail.com",
                                                  subject: 'Gardenhelp Enquiry',
                                                  html: getMailHtml(user,createdJob)
                                                };

                                                return  mailOptions;
                                              }

                                              function processPayment(token)
                                              {


                                                var stripe = require("stripe")("sk_test_NlfD07tmUQCpMyFCfzx9uE8m");

  var token = "tok_1BoRugAoxEO9v5iRXmNH9Nxj"//token; // Using Express

  console.log("CREATING CHARGE -=------------------- "  );
  stripe.charges.create(
  {
    amount: 1000,
    currency: "usd",
    description: "Example charge",
    receipt_email: "vickypathania@gmail.com",
    source: token,
  }, function(err, charge) {
  // asynchronously called

  console.log("CHARGE----- "  +  charge);
  console.log("ERROR----- "  +  err);

});


}


router.get('/', function(req, res, next) {



  jobs.find(function (err, jobs) {
    if (err)
    {

     res.status(401);
     res.json({
      "status": 401,
      "message": "There was a problem"
    });

   } else
   {
    res.status(200);
    res.json({success: true, data: jobs});
  }
});
});

/* POST /category */
router.post('/', function(req, res, next) {

  console.log('REQUEST BODY: ' +JSON.stringify( req.body.stripetoken.token));


//Fetch the user 
var user;
var job = req.body;
Users.findById(req.body.userid, function (err, user) {
  if (!err) 
  {
   user = user;

   payment.processPayment(req.body.stripetoken.token,user,job,function(_job,err)
   {


console.log("PAYMENT PROCESS RES----- "  +  err);
    if (err){

       console.log("IN ERROR BLOCK----- "  +  err);
      res.status(401);
      res.json({
        "status": 401,
        "message": "Payment unsuccessfull"
      });

    }else
    {

       
      jobs.create(_job, function (err, createdJob) {
        if (err)
        {

          res.status(401);
          res.json({
            "status": 401,
            "message": "There was a problem"
          });

        } else
        {


          createTaskInTokan(user,createdJob);

          transporter.sendMail(getMailOption(user,createdJob), function(error, info){
            if (error) 
            {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          }); 



          res.status(200);
          res.json({success: true, data: job});
        }
      }); 
    }


  });

 }else
 {
  res.status(401);
  res.json({
    "status": 401,
    "message": "Could not fetch user"
  });

}

});



});

/* GET /category/id */
router.get('/:id', function(req, res, next) {
  jobs.findById(req.params.id, function (err, jobs) {
    if (err)
    {

     res.status(401);
     res.json({
      "status": 401,
      "message": "There was a problem"
    });

   } else
   {
    res.status(200);
    res.json({success: true, data: jobs});
  }
});
});

router.get('/foruser/:id', function(req, res, next) {

  jobs.find({ userid:req.params.id }, function(err, job) {
   if (err) 
   {
    res.status(401);
    res.json({
      "status": 401,
      "message": "There was a problem"
    });

  } 
  else
  {
    res.status(200);
    res.json({success: true, data: job});

  }


});


});






/* PUT /category/:id */
router.put('/:id', function(req, res, next) {
  jobs.findByIdAndUpdate(req.params.id, req.body, function (err, job) {
    if (err) 
    {



      res.status(401);
      res.json({
        "status": 401,
        "message": "There was a problem"
      });

    } 
    else
    {
      res.status(200);
      res.json({success: true, data: job});

    }
  });
});



/* DELETE /category/:id */
router.delete('/:id', function(req, res, next) {
  jobs.findByIdAndRemove(req.params.id, req.body, function (err, job) {
    if(err) 
    {



      res.status(401);
      res.json({
        "status": 401,
        "message": "There was a problem"
      });

    } 
    else
    {
      res.status(200);
      res.json({success: true, message: "Entry deleted"});

    }
  });
});









module.exports = router;