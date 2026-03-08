# Run TinyLearn with XAMPP

Your app is already using XAMPP's MySQL database! Here's how to fully integrate with XAMPP:

## Current Setup ✅

- **Database**: XAMPP MySQL (already connected)
- **Backend**: Running with `php artisan serve` (port 8000)
- **Frontend**: Running with `npm run dev` (port 3000)

## Option 1: Keep Current Setup (Easiest)

This is what you're doing now - it works perfectly!

1. **Start XAMPP MySQL:**
   - Open XAMPP Control Panel
   - Click "Start" for MySQL

2. **Start Backend:**
   ```bash
   php artisan serve --host=0.0.0.0 --port=8000
   ```

3. **Start Frontend:**
   ```bash
   cd react
   npm run dev -- --host
   ```

4. **Access:**
   - Computer: `http://localhost:3000`
   - Phone: `http://192.168.1.9:3000`

## Option 2: Run Backend Through XAMPP Apache

If you want to use XAMPP's Apache server instead:

### Step 1: Create Symbolic Link to htdocs

```bash
# Run as Administrator
New-Item -ItemType SymbolicLink -Path "C:\xampp\htdocs\tinylearn" -Target "C:\Users\Ken\Documents\laravel-react-bladerz"
```

### Step 2: Configure Apache Virtual Host

Add to `C:\xampp\apache\conf\extra\httpd-vhosts.conf`:

```apache
<VirtualHost *:80>
    DocumentRoot "C:/xampp/htdocs/tinylearn/public"
    ServerName tinylearn.local
    
    <Directory "C:/xampp/htdocs/tinylearn/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### Step 3: Update hosts file

Add to `C:\Windows\System32\drivers\etc\hosts`:

```
127.0.0.1 tinylearn.local
```

### Step 4: Restart Apache

In XAMPP Control Panel, restart Apache.

### Step 5: Access

- Backend: `http://tinylearn.local/api/login`
- Frontend: Still use `npm run dev` on port 3000

## Option 3: Use XAMPP for Everything

### Step 1: Build React Frontend

```bash
cd react
npm run build
```

### Step 2: Copy build to Laravel public

```bash
Copy-Item -Path "react/dist/*" -Destination "public/react" -Recurse -Force
```

### Step 3: Update Laravel routes

Serve React from Laravel (single server setup).

### Step 4: Access

Everything runs on: `http://tinylearn.local`

---

## Current Database Info

- **Host**: 127.0.0.1 (localhost)
- **Port**: 3306
- **Database**: tinylearn
- **Username**: root
- **Password**: (empty)

## Access phpMyAdmin

Open XAMPP and click "Admin" next to MySQL, or visit:
```
http://localhost/phpmyadmin
```

You can view and manage your database there!

---

## Recommendation

**Keep your current setup (Option 1)** - it's working perfectly and is easier to develop with. XAMPP is already providing the MySQL database, which is the most important part!
