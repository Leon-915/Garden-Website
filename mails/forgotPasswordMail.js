var email = {
    subject: 'Reset Password Link',
    from: 'test@mailgun.org',
    htmlContent: function(url) {
        return '<html><head><title>GardenHelp</title><style>' +
            'html,body { margin: 0 auto !important;padding: 0 !important;height: 100% !important;width: 100% !important;}' +
            '* {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;}' +
            'div[style*="margin: 16px 0"] {margin:0 !important;}table,td {mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;}' +
            'table {border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;}' +
            'table table table {table-layout: auto;}' +
            'img { -ms-interpolation-mode:bicubic;}' +
            ' *[x-apple-data-detectors], .x-gmail-data-detectors, .x-gmail-data-detectors *, .aBn {border-bottom: 0 !important; cursor: default !important; color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }' +
            '.a6S {display: none !important; opacity: 0.01 !important; } img.g-img + div {display:none !important; } .button-link {text-decoration: none !important; }' +
            '@media only screen and (min-device-width: 375px) and (max-device-width: 413px) {.email-container {min-width: 375px !important; } } .button-td, .button-a {transition: all 100ms ease-in; } .button-td:hover, .button-a:hover {background: #555555 !important; border-color: #555555 !important; } @media screen and (max-width: 600px) {.email-container p {font-size: 17px !important; line-height: 22px !important; } }</style>' +
            '</head> <body width="100%" bgcolor="#f2f2f2" style="margin: 0; mso-line-height-rule: exactly;"> <center style="width: 100%; background: #f2f2f2; text-align: left;"> <tr>' +
            '<td bgcolor="#ffffff" align="center" height="100%" valign="top" width="100%" style="padding-bottom: 40px"> <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;"> <tr> <td style="padding: 20px 0; text-align: center"> <img src="http://gardenhelp.ie/wp-content/uploads/2016/05/Garden-Help-Logo.png" width="200" height="50" alt="alt_text" border="0" style="height: auto; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555;"> </td> </tr> </table>' +

            '<table role="presentation" border="0" bgcolor="#ffffff" cellpadding="0" cellspacing="0" align="center" width="100%" style="max-width:560px;"> <tr> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> <td style="padding: 40px; font-family: sans-serif; font-size: 15px; line-height: 20px; color: #555555; text-align: center;">  <h1 style="margin: 0 0 25px 0; font-family: sans-serif; font-size: 24px; line-height: 27px; color: #333333; font-weight: normal;"> Forgot Password </h1> </td> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> </tr> <tr> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> <td  style="padding: 0 10px; font-family: sans-serif; font-size: 17px; font-weight: bold; line-height: 20px; color: #555555;"> <p style="margin: 0;">Someone requested for new password. Click below to reset your password.</p> </td> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> </tr><tr>' +


            '<td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> <td align="center" valign="top" width="90%" style="text-align: center;font-family: sans-serif; font-size: 13px; line-height: 53px; color: #555555; padding: 10px 10px 0;"> <br/>' +

            '<a href="' + url + '" class="btn-primary" itemprop="url" style="    text-align: center;background: #15c; padding: 10px 20px; color: #fff; margin: 5px 10px;">Reset Password</a>' +
            '</td> <td align="center" valign="top" width="5%" style="text-align: left;font-family: sans-serif; font-size: 13px; line-height: 20px; color: #555555; padding: 10px 10px 0;"></td> </tr> <tr> <td align="center" valign="top" bgcolor="#709f2b" width="100%" colspan="3" height="10"></td> </tr> </table> </td> </tr> </center> </body> </html>';
    },
    getMail: function(url, to) {
      console.log(url);
        var mailOptions = {
            from: 'gardenhelp100@gmail.com',
            to: to,
            subject: 'Reset Password - GardenHelp',
            html: this.htmlContent(url)
        };

        return mailOptions;
    }
};

module.exports = email;