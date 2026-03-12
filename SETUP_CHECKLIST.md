# TinyLearn Setup Checklist

## Pre-Installation Requirements

- [ ] PHP 8.2+ installed (`php -v`)
- [ ] Node.js 18+ installed (`node -v`)
- [ ] Composer installed (`composer -v`)
- [ ] Git installed (`git -v`)

## Installation Steps

### 1. Clone/Setup Project
- [ ] Project files downloaded/cloned
- [ ] Navigate to project directory

### 2. Install Dependencies
- [ ] Run `composer install`
- [ ] Run `cd react && npm install && cd ..`

### 3. Environment Setup
- [ ] `.env` file exists in root
- [ ] `react/.env` file exists
- [ ] `BROADCAST_CONNECTION=reverb` in `.env`
- [ ] `REVERB_*` variables configured

### 4. Database Setup
- [ ] Run `php artisan migrate:fresh --seed`
- [ ] Verify `database/database.sqlite` created
- [ ] Check test users created

### 5. Verify Installation
- [ ] Run `php artisan tinker --execute="echo 'Backend OK';"`
- [ ] Run `cd react && npm run build && cd ..`
- [ ] No build errors

## Starting the Application

### Option 1: Quick Start (Recommended)
- [ ] Windows: Run `start-dev.bat`
- [ ] Mac/Linux: Run `./start-dev.sh`
- [ ] Wait for all services to start

### Option 2: Manual Start
- [ ] Terminal 1: `php artisan serve`
- [ ] Terminal 2: `php artisan reverb:start`
- [ ] Terminal 3: `php artisan queue:work`
- [ ] Terminal 4: `cd react && npm run dev`

## Verification

### Backend Services
- [ ] Laravel API running on http://localhost:8000
- [ ] Reverb WebSocket running on ws://localhost:8080
- [ ] Queue worker running
- [ ] No errors in console

### Frontend
- [ ] React app running on http://localhost:3000
- [ ] Page loads without errors
- [ ] No console errors

### Authentication
- [ ] Can login with admin@example.com / password
- [ ] Can login with teacher@example.com / password
- [ ] Can login with student@example.com / password
- [ ] Dashboard loads correctly

### Real-Time Features
- [ ] WebSocket connection established
- [ ] Real-time dashboard shows online users
- [ ] Events appear in real-time
- [ ] No connection errors in console

## Common Issues & Solutions

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Mac/Linux

# Kill process or use different port
php artisan serve --port=8001
```

### Database Locked
```bash
# Reset database
php artisan migrate:fresh --seed
```

### Node Modules Issues
```bash
cd react
rm -rf node_modules package-lock.json
npm install
cd ..
```

### WebSocket Connection Failed
- [ ] Reverb server is running
- [ ] Port 8080 is not blocked by firewall
- [ ] Check browser console for errors
- [ ] Verify .env REVERB settings

## First Steps After Setup

1. [ ] Log in with test credentials
2. [ ] Explore the dashboard
3. [ ] Create a test course
4. [ ] Post an announcement
5. [ ] Create an assignment
6. [ ] Test real-time updates (open in 2 windows)
7. [ ] Check online users in real-time dashboard

## Development Tips

- [ ] Keep browser DevTools open for debugging
- [ ] Check Laravel logs: `tail -f storage/logs/laravel.log`
- [ ] Use `php artisan tinker` for quick testing
- [ ] Use React DevTools browser extension
- [ ] Enable dark mode for better development experience

## Documentation to Read

- [ ] `GETTING_STARTED.md` - Complete setup guide
- [ ] `REALTIME_SETUP.md` - Real-time features guide
- [ ] `PROJECT_SUMMARY.md` - Project overview
- [ ] `routes/api.php` - API endpoints
- [ ] `routes/channels.php` - WebSocket channels

## Performance Optimization (Optional)

- [ ] Set up Redis for caching
- [ ] Configure database connection pooling
- [ ] Enable query caching
- [ ] Optimize images and assets
- [ ] Set up CDN for static files

## Production Preparation (When Ready)

- [ ] Switch to MySQL/PostgreSQL database
- [ ] Set up Pusher or Ably for WebSockets
- [ ] Configure HTTPS/WSS
- [ ] Set up proper logging
- [ ] Configure environment variables
- [ ] Set up monitoring and alerts
- [ ] Create backup strategy
- [ ] Set up CI/CD pipeline

## Support Resources

- **Laravel Docs:** https://laravel.com/docs
- **React Docs:** https://react.dev
- **Reverb Docs:** https://laravel.com/docs/reverb
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Project Issues:** Check GitHub issues

## Troubleshooting Contacts

If you encounter issues:
1. Check the documentation files
2. Review error messages carefully
3. Check browser console (F12)
4. Check Laravel logs in `storage/logs/`
5. Try restarting services
6. Clear cache: `php artisan cache:clear`

---

## ✅ Setup Complete!

Once all items are checked, your TinyLearn LMS is ready to use!

**Next:** Open http://localhost:3000 and start exploring!

For questions, refer to the documentation files or check the code comments.

Happy Learning! 🚀
