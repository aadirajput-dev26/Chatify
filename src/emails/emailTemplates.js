export function createWelcomeEmailTemplate(name){
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to Chatify</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f7f9fc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header {
      background: #4a90e2;
      color: #ffffff;
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .content {
      padding: 30px 20px;
      color: #333333;
      line-height: 1.6;
    }
    .content h2 {
      color: #4a90e2;
      margin-top: 0;
    }
    .button {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 24px;
      background: #4a90e2;
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .footer {
      background: #f0f0f0;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #777777;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Hi ${name}, Welcome to Chatify</h1>
    </div>
    <div class="content">
      <h2>Your real-time chat application</h2>
      <p>
        We’re excited to have you on board! With Chatify, conversations flow seamlessly and everything goes smooth. 
        Connect instantly, share freely, and enjoy a modern chat experience designed just for you.
      </p>
      <a href="#" class="button">Get Started</a>
    </div>
    <div class="footer">
      &copy; 2026 Chatify. All rights reserved.
    </div>
  </div>
</body>
</html>
    `
}