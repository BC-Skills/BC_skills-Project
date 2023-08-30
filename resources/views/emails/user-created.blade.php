<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Created</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background: url('https://apps.eui.eu/EUI_API/EVENTSV2/Images/Image?id=8958') no-repeat center center;
            background-size: cover;
            filter: brightness(0.9); /* Adjust the brightness as needed */
            position: relative;
            border-radius: 10px;
            border: 2px solid #333; /* Added border styling */
            overflow: hidden; /* Ensure border doesn't expand the container */
        }
        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Adjust the opacity as needed */
            border-radius: 10px; /* Match the container's border radius */
        }
        .logo {
            text-align: center;
            margin-top: 20px;
        }
        .logo img {
            max-width: 150px;
        }
        .content {
            font-size: 16px;
            line-height: 1.6;
            color: #333; /* Dark text color to match the background */
            padding: 20px;
        }
        .button-container {
            text-align: center;
            margin-top: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
        .note {
            color: #ff5757;
            font-weight: bold;
            text-align: center;
            margin-top: 20px;
        }
        .note2 {
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
        <div class="overlay"></div>
        <div class="logo">
            <img src="{{ $logoUrl }}" alt="Company Logo">
        </div>
        <div class="content">
            <h2>Welcome to Our Company!</h2>
            <p>Your account has been successfully created.</p>
            <p><strong>Email:</strong> {{ $notifiable->email }}</p>
            <p><strong>Password:</strong> {{ $password }}</p>
            <p>Thank you for joining our team. We're excited to have you on board.</p>
        </div>
        <div class="button-container">
            <a class="button" href="{{ url('http://localhost:3000/') }}">Visit Our Website</a>
        </div>
        <p class="note">Please remember to update your password after logging in.</p>
        <p class="note2">For security reasons, please remember to keep your password confidential.</p>
        <p class="footer">&copy; {{ date('Y') }}  BC Skills Group. All rights reserved.</p>
    </div>
</body>
</html>
