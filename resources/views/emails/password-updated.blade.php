<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Updated</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f6f6f6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            background-image: url('https://apps.eui.eu/EUI_API/EVENTSV2/Images/Image?id=8958');
            background-size: cover;
            background-repeat: no-repeat;
            border: 2px solid #007bff;
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
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .button {
            display: block;
            width: 100%;
            text-align: center;
            margin-top: 30px;
        }
        .button a {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
        .note {
            color: #888;
            font-size: 14px;
            text-align: center;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <img src="{{ $logoUrl }}" alt="Company Logo">
        </div>
        <div class="content">
            <h2>Your Password Has Been Updated</h2>
            <p>Hello {{ $notifiable->name }},</p>
            <p>We wanted to let you know that your password has been updated successfully.</p>
            <p>If you didn't make this change, please contact us immediately.</p>
        </div>
        <div class="button">
            <a href="{{ url('http://localhost:3000/') }}" style="color: #ffffff; text-decoration: none;">Visit Our Website</a>
        </div>
        <p class="note">For security reasons, please remember to keep your password confidential.</p>
        <p class="footer">&copy; {{ date('Y') }}  BC Skills Group. All rights reserved.</p>
    </div>
</body>
</html>
