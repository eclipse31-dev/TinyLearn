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
            border-radius: 16px;
            padding: 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 40px 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0 0 8px 0;
            font-size: 32px;
            font-weight: 700;
        }
        .header .tagline {
            font-size: 16px;
            opacity: 0.95;
            margin: 0;
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .invitation-text {
            font-size: 16px;
            color: #4b5563;
            line-height: 1.8;
            margin-bottom: 24px;
        }
        .teacher-name {
            color: #3b82f6;
            font-weight: 600;
        }
        .course-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 32px;
            border-radius: 12px;
            margin: 24px 0;
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
        }
        .course-card h2 {
            margin: 0 0 12px 0;
            font-size: 26px;
            font-weight: 700;
        }
        .course-card .description {
            font-size: 15px;
            opacity: 0.95;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .class-code-section {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-top: 20px;
        }
        .class-code-label {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.9;
            margin-bottom: 8px;
        }
        .class-code {
            font-size: 36px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            letter-spacing: 6px;
            margin: 8px 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .class-code-hint {
            font-size: 13px;
            opacity: 0.85;
            margin-top: 8px;
        }
        .steps-section {
            background: #f9fafb;
            padding: 28px;
            border-radius: 12px;
            margin: 28px 0;
            border-left: 4px solid #3b82f6;
        }
        .steps-section h3 {
            margin: 0 0 16px 0;
            color: #1f2937;
            font-size: 18px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .steps-section ol {
            margin: 0;
            padding-left: 24px;
        }
        .steps-section li {
            margin: 12px 0;
            color: #4b5563;
            font-size: 15px;
            line-height: 1.6;
        }
        .steps-section li strong {
            color: #1f2937;
            font-weight: 600;
        }
        .cta-section {
            text-align: center;
            margin: 32px 0;
        }
        .btn {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
        }
        .benefits {
            background: #eff6ff;
            padding: 24px;
            border-radius: 12px;
            margin: 24px 0;
        }
        .benefits h4 {
            margin: 0 0 12px 0;
            color: #1e40af;
            font-size: 16px;
        }
        .benefits ul {
            margin: 0;
            padding-left: 20px;
        }
        .benefits li {
            margin: 8px 0;
            color: #1e40af;
            font-size: 14px;
        }
        .help-section {
            background: #fef3c7;
            padding: 20px;
            border-radius: 10px;
            margin: 24px 0;
            border-left: 4px solid #f59e0b;
        }
        .help-section p {
            margin: 0;
            color: #92400e;
            font-size: 14px;
            line-height: 1.6;
        }
        .footer {
            background: #f9fafb;
            padding: 32px 40px;
            text-align: center;
            color: #6b7280;
            font-size: 13px;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 8px 0;
        }
        .footer .social-links {
            margin: 16px 0;
        }
        .footer .social-links a {
            color: #3b82f6;
            text-decoration: none;
            margin: 0 8px;
        }
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e5e7eb, transparent);
            margin: 24px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 TinyLearn</h1>
            <p class="tagline">Your Gateway to Knowledge</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hello there! 👋
            </div>

            <p class="invitation-text">
                Great news! <span class="teacher-name">{{ $teacher->FName }} {{ $teacher->LName }}</span> has invited you to join an exciting learning journey on TinyLearn. 
                This is your opportunity to expand your knowledge and connect with fellow learners!
            </p>

            <div class="course-card">
                <h2>{{ $course->title }}</h2>
                @if($course->description)
                    <p class="description">{{ $course->description }}</p>
                @else
                    <p class="description">Get ready to dive into an engaging learning experience designed to help you succeed!</p>
                @endif
                
                <div class="class-code-section">
                    <div class="class-code-label">Your Class Code</div>
                    <div class="class-code">{{ $course->course_code }}</div>
                    <div class="class-code-hint">Keep this code handy - you'll need it to join!</div>
                </div>
            </div>

            <div class="benefits">
                <h4>🎯 What You'll Get:</h4>
                <ul>
                    <li>Access to comprehensive course materials and resources</li>
                    <li>Interactive assignments and real-time feedback</li>
                    <li>Engage in discussions with classmates and instructors</li>
                    <li>Track your progress and achievements</li>
                    <li>Learn at your own pace, anytime, anywhere</li>
                </ul>
            </div>

            <div class="steps-section">
                <h3>🚀 Getting Started is Easy:</h3>
                <ol>
                    <li>Click the <strong>"Join Course Now"</strong> button below</li>
                    <li>Sign in to your TinyLearn account (or create a free account if you're new)</li>
                    <li>Click the <strong>"Join Class"</strong> button on your dashboard</li>
                    <li>Enter your class code: <strong>{{ $course->course_code }}</strong></li>
                    <li>That's it! You're ready to start learning 🎉</li>
                </ol>
            </div>

            <div class="cta-section">
                <a href="{{ $inviteUrl }}" class="btn">Join Course Now →</a>
                <p style="margin-top: 16px; color: #6b7280; font-size: 14px;">
                    Or copy this link: <a href="{{ $inviteUrl }}" style="color: #3b82f6;">{{ $inviteUrl }}</a>
                </p>
            </div>

            <div class="divider"></div>

            <div class="help-section">
                <p>
                    <strong>💡 Need Help?</strong><br>
                    If you have any questions or encounter any issues joining the course, don't hesitate to reach out to your instructor 
                    <strong>{{ $teacher->FName }} {{ $teacher->LName }}</strong> or visit our help center.
                </p>
            </div>

            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 32px;">
                We're excited to have you join us on this learning adventure! 🌟
            </p>
        </div>

        <div class="footer">
            <p style="font-weight: 600; color: #374151; margin-bottom: 12px;">TinyLearn - Empowering Education</p>
            <p>© {{ date('Y') }} TinyLearn. All rights reserved.</p>
            <p style="margin-top: 16px;">
                This invitation was sent by {{ $teacher->FName }} {{ $teacher->LName }} via TinyLearn.<br>
                This is an automated message. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
