 export const emailTemplate = (firstName, otp, condation) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Account Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 450px;
            margin: 40px auto;
            background: #ffffff;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            border-top: 4px solid #007bff;
        }
        h2 {
            color: #333;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        p {
            color: #555;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 15px;
        }
        .otp-box {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            padding: 12px;
            border: 1px dashed #007bff;
            display: inline-block;
            letter-spacing: 3px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .note {
            font-size: 13px;
            color: #777;
        }
        .footer {
            font-size: 12px;
            color: #aaa;
            margin-top: 20px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h2>${condation}</h2>
        <p>Hello <strong>${firstName}</strong>,</p>
        <p>Use the OTP below to ${condation}:</p>
        <div class="otp-box">${otp}</div>
        <p class="note">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <p class="footer">If you did not request this, please ignore this email or <a href="#">contact support</a>.</p>
    </div>
</body>
</html>
`;
 
export const Application_Accept = (applicantName) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Job Application Status</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    text-align: center;
                    padding: 20px;
                }
                .container {
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                    margin: auto;
                }
                .success {
                    color: green;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Job Application Result</h2>
                <p>Dear <strong>${applicantName}</strong>,</p>
                
                <p class="success">Congratulations! We are pleased to inform you that you have been accepted for the job.</p>
                <p>We will contact you soon with the next steps.</p>
                
                <p>Best regards,</p>
                <p>The Hiring Team</p>
            </div>
        </body>
        </html>
    `;
};


export const Application_Reject = (applicantName) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Job Application Status</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    text-align: center;
                    padding: 20px;
                }
                .container {
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                    margin: auto;
                }
                .failure {
                    color: red;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Job Application Result</h2>
                <p>Dear <strong>${applicantName}</strong>,</p>
                
                <p class="failure">We regret to inform you that your application was not successful.</p>
                <p>We appreciate your interest and encourage you to apply for future opportunities.</p>
                
                <p>We wish you the best in your job search.</p>

                <p>Best regards,</p>
                <p>The Hiring Team</p>
            </div>
        </body>
        </html>
    `;
};



