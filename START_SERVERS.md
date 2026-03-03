# Start All Servers

You need to run these commands in **4 SEPARATE TERMINALS**:

## Terminal 1: Laravel Backend
```bash
php artisan serve
```
This starts the API server on http://localhost:8000

## Terminal 2: Laravel Reverb (WebSocket)
```bash
php artisan reverb:start
```
This starts the real-time WebSocket server on ws://localhost:8080

## Terminal 3: Queue Worker
```bash
php artisan queue:work
```
This processes background jobs and broadcasts events

## Terminal 4: React Frontend
```bash
cd react
npm run dev
```
This starts the frontend on http://localhost:5173

---

## Quick Test After Starting

Once all servers are running, test the login:

**Test Accounts:**
- admin@example.com / password
- teacher@example.com / password
- student@example.com / password

**Or run this test:**
```bash
php test_login_api.php
```

---

## Troubleshooting

### "Invalid credentials" error
- Make sure Laravel backend is running (Terminal 1)
- Check that database has users: `php test_users.php`

### "Connection refused" error
- Start Laravel: `php artisan serve`
- Check it's running on port 8000

### Real-time features not working
- Start Reverb: `php artisan reverb:start`
- Start Queue Worker: `php artisan queue:work`

### Frontend not loading
- Go to react folder: `cd react`
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
