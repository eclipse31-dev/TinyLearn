# Supabase Connection - Complete Setup

**Status**: ✅ Connection String Updated  
**Date**: March 12, 2026

---

## ✅ Your Connection String

```
postgresql://postgres.wlcguodooyitrecgcauu:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

---

## ✅ .env Updated

Your `.env` file now has the correct Supabase connection:

```env
DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-south-1.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.wlcguodooyitrecgcauu
DB_PASSWORD=YOUR-PASSWORD  ← Replace with your actual password
```

---

## 🔑 Complete Your Setup

### Step 1: Add Your Password

Replace `YOUR-PASSWORD` in `.env` with your actual Supabase password.

**Example**:
```env
DB_PASSWORD=abc123xyz789def456ghi
```

### Step 2: Import Database

1. Go to Supabase SQL Editor
2. Create new query
3. Copy all from `create_database_postgresql.sql`
4. Paste into editor
5. Click "Run"
6. Wait for success ✅

### Step 3: Test Connection

```bash
php artisan tinker
DB::connection()->getPdo();
```

Should return: `PDOStatement object` (success!)

### Step 4: Run Migrations

```bash
php artisan migrate --force
```

### Step 5: Start Local Server

```bash
# Terminal 1: Backend
php artisan serve

# Terminal 2: Real-time
php artisan reverb:start

# Terminal 3: Frontend
cd react && npm run dev
```

### Step 6: Test Login

1. Go to: http://localhost:5173
2. Email: admin@example.com
3. Password: password
4. Login successful ✅

---

## 📝 Your Database Details

| Setting | Value |
|---------|-------|
| **Host** | aws-1-ap-south-1.pooler.supabase.com |
| **Port** | 5432 |
| **Database** | postgres |
| **Username** | postgres.wlcguodooyitrecgcauu |
| **Password** | [Your password] |
| **Connection Type** | PostgreSQL |

---

## 🚀 Frontend Configuration

Create `react/.env.local`:

```env
VITE_SUPABASE_URL=https://wlcguodooyitrecgcauu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsY2d1b2Rvb3lpdHJlY2djYXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNzE3ODQsImV4cCI6MjA4ODg0Nzc4NH0.c1UyD2kjnaU6QpyokQWQzDs9w7VmdcXRqQhuGawtGG4
VITE_API_URL=http://localhost:8000
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
```

---

## ✅ Quick Checklist

- [ ] Add your password to `.env` (DB_PASSWORD)
- [ ] Import database using `create_database_postgresql.sql`
- [ ] Test connection: `php artisan tinker` → `DB::connection()->getPdo();`
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Create `react/.env.local`
- [ ] Start backend: `php artisan serve`
- [ ] Start Reverb: `php artisan reverb:start`
- [ ] Start frontend: `cd react && npm run dev`
- [ ] Test login: admin@example.com / password
- [ ] Test features (create course, invite, etc.)

---

## 🔧 Troubleshooting

### "Connection refused"
- Check DB_HOST is correct: `aws-1-ap-south-1.pooler.supabase.com`
- Check DB_PORT is 5432
- Check internet connection

### "FATAL: password authentication failed"
- Verify DB_PASSWORD is correct
- Check DB_USERNAME is: `postgres.wlcguodooyitrecgcauu`
- Try again

### "relation does not exist"
- Import database: `create_database_postgresql.sql`
- Run migrations: `php artisan migrate --force`

### "SQLSTATE[HY000]: General error"
- Check database password
- Verify connection string format
- Test with: `psql postgresql://postgres.wlcguodooyitrecgcauu:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:5432/postgres`

---

## 📚 Files You Need

- `.env` - Updated with connection string ✅
- `create_database_postgresql.sql` - Database schema
- `react/.env.local` - Frontend config (create this)

---

## 🎯 Next Steps

1. ✅ Add password to `.env`
2. ✅ Import database
3. ✅ Test locally
4. ✅ Deploy to production (see SUPABASE_DEPLOYMENT_FINAL.md)

---

## 📖 Documentation

- **SUPABASE_FINAL_SETUP.md** - Complete setup guide
- **SUPABASE_DEPLOYMENT_FINAL.md** - Production deployment
- **create_database_postgresql.sql** - Database schema

---

**Your Supabase connection is ready!** 🚀

Just add your password and you're good to go!
