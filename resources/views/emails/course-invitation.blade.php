<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Invitation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #3b82f6;
            margin: 0;
            font-size: 28px;
        }
        .content {
            margin-bottom: 30px;
        }
        .course-info {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .course-info h2 {
            margin: 0 0 10px 0;
            font-size: 24px;
        }
        .course-info p {
            margin: 5px 0;
            opacity: 0.95;
        }
        .class-code {
            background: rgba(255, 255, 255, 0.2);
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 3px;
            text-align: center;
            margin: 15px 0;
            font-family: monospace;
        }
        .btn {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
        }
        .btn:hover {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        }
        .footer {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .steps {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .steps h3 {
            margin-top: 0;
            color: #374151;
        }
        .steps ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        .steps li {
            margin: 8px 0;
            color: #4b5563;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 TinyLearn</h1>
            <p style="color: #6b7280; margin: 5px 0;">Course Invitation</p>
        </div>

        <div class="content">
            <p>Hello!</p>
            
            <p><strong>{{ $teacher->FName }} {{ $teacher->LName }}</strong> has invited you to join their course on TinyLearn.</p>

            <div class="course-info">
                <h2>{{ $course->title }}</h2>
                @if($course->description)
                    <p>{{ $course->description }}</p>
                @endif
                
                <div class="class-code">
                    {{ $course->course_code }}
                </div>
                <p style="text-align: center; font-size: 14px; margin-top: 10px;">
                    Use this class code to join
                </p>
            </div>

            <div class="steps">
                <h3>How to Join:</h3>
                <ol>
                    <li>Click the button below or visit <a href="{{ $inviteUrl }}">{{ $inviteUrl }}</a></li>
                    <li>Sign in to your TinyLearn account (or create one if you don't have it)</li>
                    <li>Click "Join Class" and enter the class code: <strong>{{ $course->course_code }}</strong></li>
                    <li>Start learning!</li>
                </ol>
            </div>

            <div style="text-align: center;">
                <a href="{{ $inviteUrl }}" class="btn">Join Course Now</a>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                If you have any questions, please contact your teacher or visit our help center.
            </p>
        </div>

        <div class="footer">
            <p>© {{ date('Y') }} TinyLearn. All rights reserved.</p>
            <p>This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
