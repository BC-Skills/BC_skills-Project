<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Created</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 6px;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo img {
            max-width: 150px;
        }
        .content {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            margin-left: 12%
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="{{ $logoUrl }}" alt="Company Logo">
        </div>
        <div class="content">
            <h2>Account Created</h2>
            <p>Your account has been created successfully.</p>
            <p><strong>Email:</strong> {{ $notifiable->email }}</p>
            <p><strong>Password:</strong> {{ $password }}</p>
            <p>Welcome to our company!</p>
            <p style="color: red;"><strong>Make sure to update your password after logging in.</strong></p>   
             </div>
        <div class="button">
            <a href="{{ url('http://localhost:3000/') }}" style="color: #ffffff; text-decoration: none;">Visit our website</a>
        </div>
    </div>
</body>
</html>
