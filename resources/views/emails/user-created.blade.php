<!DOCTYPE html>
<html>
<head>
    <title>Account Created</title>
</head>
<body>
    <div>
        <img src="{{ $logoUrl }}" alt="Company Logo" style="max-width: 150px;">
    </div>
    <div>
        <h2>Account Created</h2>
        <p>Your account has been created successfully.</p>
        <p>Email: {{ $notifiable->email }}</p>
        <p>Password: {{ $password }}</p>
        <p>Welcome to our company!</p>
        <p>Make sure to update your password after logging in.</p>
        <p>
            <a href="{{ url('http://localhost:3000/') }}">Visit our website</a>
        </p>
    </div>
</body>
</html>
