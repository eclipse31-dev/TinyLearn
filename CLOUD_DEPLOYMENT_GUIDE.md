# TinyLearn LMS - Cloud Deployment Guide

## Overview
This guide covers deploying TinyLearn LMS to major cloud providers with full database integration.

## Cloud Provider Options

### 1. **Vercel + Railway** (Recommended for Beginners)
- Frontend: Vercel (Free tier available)
- Backend: Railway (Paid, ~$5/month)
- Database: Railway PostgreSQL

### 2. **AWS** (Enterprise)
- Frontend: CloudFront + S3
- Backend: EC2 or Elastic Beanstalk
- Database: RDS (MySQL/PostgreSQL)

### 3. **Google Cloud** (Scalable)
- Frontend: Cloud Storage + CDN
- Backend: Cloud Run or App Engine
- Database: Cloud SQL

### 4. **DigitalOcean** (Developer-Friendly)
- Frontend: Spaces + CDN
- Backend: Droplet or App Platform
- Database: Managed Database

### 5. **Heroku + Heroku Postgres** (Simple)
- Frontend: Heroku
- Backend: Heroku
- Database: Heroku Postgres

---

## Option 1: Vercel + Railway (RECOMMENDED)

### Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free tier)

### Step 1: Prepare Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: TinyLearn LMS"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/tinylearn.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Database to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Provision PostgreSQL"
4. Wait for database to be created
5. Copy connection string from "Connect" tab

### Step 3: Deploy Backend to Railway

1. In Railway, click "New Service"
2. Select "GitHub Repo"
3. Connect your GitHub account
4. Select `tinylearn` repository
5. Configure environment variables:

```env
APP_NAME=TinyLearn
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-domain.railway.app

DB_CONNECTION=pgsql
DB_HOST=your-railway-db-host
DB_PORT=5432
DB_DATABASE=railway
DB_USERNAME=postgres
DB_PASSWORD=your-password

BROADCAST_CONNECTION=reverb
REVERB_HOST=your-backend-domain.railway.app
REVERB_PORT=443
REVERB_SCHEME=https

SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.vercel.app
SESSION_DOMAIN=.railway.app

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_FROM_ADDRESS=noreply@tinylearn.app
```

6. Add build command:
```bash
composer install && php artisan migrate --force
```

7. Add start command:
```bash
php artisan serve --host=0.0.0.0 --port=$PORT
```

### Step 4: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - Framework: Vite
   - Build Command: `cd react && npm run build`
   - Output Directory: `react/dist`
   - Root Directory: `.`

5. Add environment variables:
```env
VITE_API_URL=https://your-backend-domain.railway.app
VITE_REVERB_APP_KEY=zuonhgpz9bawpswpcnhp
VITE_REVERB_HOST=your-backend-domain.railway.app
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
```

6. Deploy

### Step 5: Update CORS Configuration

Update `config/cors.php`:
```php
'allowed_origins' => [
    'https://your-frontend-domain.vercel.app',
    'https://your-backend-domain.railway.app',
],
```

---

## Option 2: AWS Deployment

### Prerequisites
- AWS Account
- AWS CLI installed
- Docker installed

### Step 1: Create RDS Database

1. Go to AWS RDS Console
2. Click "Create database"
3. Select MySQL 8.0
4. Choose "Free tier" template
5. Configure:
   - DB instance identifier: `tinylearn-db`
   - Master username: `admin`
   - Master password: (generate strong password)
   - DB name: `tinylearn`
6. Create database (takes 5-10 minutes)

### Step 2: Create EC2 Instance

1. Go to EC2 Console
2. Click "Launch Instance"
3. Select Ubuntu 22.04 LTS
4. Choose `t3.micro` (free tier eligible)
5. Configure security group:
   - Allow HTTP (80)
   - Allow HTTPS (443)
   - Allow SSH (22)
   - Allow MySQL (3306) from RDS security group
6. Launch instance

### Step 3: Connect to EC2 and Install Dependencies

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP and dependencies
sudo apt install -y php8.2 php8.2-cli php8.2-fpm php8.2-mysql php8.2-curl php8.2-mbstring php8.2-xml php8.2-zip

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### Step 4: Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/YOUR_USERNAME/tinylearn.git
cd tinylearn

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Install Node dependencies
cd react && npm install && npm run build && cd ..

# Create .env file
cp .env.example .env

# Configure .env with RDS credentials
nano .env
```

Update `.env`:
```env
APP_URL=https://your-domain.com
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_DATABASE=tinylearn
DB_USERNAME=admin
DB_PASSWORD=your-password
```

```bash
# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Set permissions
sudo chown -R www-data:www-data /var/www/tinylearn
sudo chmod -R 755 /var/www/tinylearn/storage
```

### Step 5: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/tinylearn
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/tinylearn/public;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/tinylearn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Option 3: Google Cloud Deployment

### Prerequisites
- Google Cloud Account
- gcloud CLI installed

### Step 1: Create Cloud SQL Database

```bash
# Create MySQL instance
gcloud sql instances create tinylearn-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create tinylearn \
  --instance=tinylearn-db

# Create user
gcloud sql users create admin \
  --instance=tinylearn-db \
  --password=your-password
```

### Step 2: Deploy Backend to Cloud Run

```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libjpeg-dev libfreetype6-dev \
    libzip-dev mysql-client

RUN docker-php-ext-install pdo_mysql zip gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN php artisan key:generate

EXPOSE 8080

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
EOF

# Build and push to Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/tinylearn-api

# Deploy to Cloud Run
gcloud run deploy tinylearn-api \
  --image gcr.io/YOUR_PROJECT_ID/tinylearn-api \
  --platform managed \
  --region us-central1 \
  --set-env-vars DB_HOST=CLOUD_SQL_IP,DB_DATABASE=tinylearn,DB_USERNAME=admin,DB_PASSWORD=your-password
```

### Step 3: Deploy Frontend to Cloud Storage

```bash
# Build React app
cd react && npm run build && cd ..

# Create storage bucket
gsutil mb gs://tinylearn-frontend

# Upload files
gsutil -m cp -r react/dist/* gs://tinylearn-frontend/

# Make public
gsutil iam ch serviceAccount:YOUR_SERVICE_ACCOUNT@appspot.gserviceaccount.com:objectViewer gs://tinylearn-frontend

# Setup CDN
gcloud compute backend-buckets create tinylearn-backend \
  --gcs-uri-prefix=gs://tinylearn-frontend
```

---

## Option 4: DigitalOcean Deployment

### Prerequisites
- DigitalOcean Account
- doctl CLI installed

### Step 1: Create Managed Database

```bash
# Create MySQL database
doctl databases create tinylearn \
  --engine mysql \
  --region nyc3 \
  --num-nodes 1
```

### Step 2: Create App Platform

```bash
# Create app.yaml
cat > app.yaml << 'EOF'
name: tinylearn
services:
- name: api
  github:
    repo: YOUR_USERNAME/tinylearn
    branch: main
  build_command: composer install && php artisan migrate --force
  run_command: php artisan serve --host=0.0.0.0 --port=8080
  envs:
  - key: APP_ENV
    value: production
  - key: DB_HOST
    value: ${db.hostname}
  - key: DB_DATABASE
    value: tinylearn
  - key: DB_USERNAME
    value: doadmin
  - key: DB_PASSWORD
    value: ${db.password}
  http_port: 8080

- name: web
  github:
    repo: YOUR_USERNAME/tinylearn
    branch: main
  build_command: cd react && npm install && npm run build
  source_dir: react/dist
  http_port: 3000

databases:
- name: db
  engine: MYSQL
  version: "8"
EOF

# Deploy
doctl apps create --spec app.yaml
```

---

## Option 5: Heroku Deployment (Deprecated but still available)

### Prerequisites
- Heroku Account
- Heroku CLI installed

### Step 1: Create Procfile

```bash
cat > Procfile << 'EOF'
web: vendor/bin/heroku-php-apache2 public/
release: php artisan migrate --force
EOF
```

### Step 2: Deploy

```bash
# Login to Heroku
heroku login

# Create app
heroku create tinylearn-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set APP_ENV=production
heroku config:set APP_DEBUG=false

# Deploy
git push heroku main

# Run migrations
heroku run php artisan migrate
```

---

## Post-Deployment Configuration

### 1. Update CORS Settings

Edit `config/cors.php`:
```php
'allowed_origins' => [
    env('FRONTEND_URL', 'http://localhost:5173'),
],
```

### 2. Configure Email

Update `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=noreply@tinylearn.app
```

### 3. Setup SSL/TLS

- Use Let's Encrypt for free SSL
- Or use cloud provider's managed SSL

### 4. Configure CDN

- CloudFront (AWS)
- Cloud CDN (Google Cloud)
- Spaces CDN (DigitalOcean)

### 5. Setup Monitoring

- CloudWatch (AWS)
- Cloud Monitoring (Google Cloud)
- Datadog (Multi-cloud)

---

## Database Migration

### Export Local Database

```bash
# MySQL
mysqldump -u root -p tinylearn > tinylearn_backup.sql

# PostgreSQL
pg_dump -U postgres tinylearn > tinylearn_backup.sql
```

### Import to Cloud Database

```bash
# MySQL (AWS RDS)
mysql -h your-rds-endpoint.rds.amazonaws.com -u admin -p tinylearn < tinylearn_backup.sql

# PostgreSQL (Railway)
psql postgresql://user:password@host:port/database < tinylearn_backup.sql
```

---

## Environment Variables Template

```env
# App
APP_NAME=TinyLearn
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
APP_KEY=base64:YOUR_KEY_HERE

# Database
DB_CONNECTION=mysql
DB_HOST=your-cloud-db-host
DB_PORT=3306
DB_DATABASE=tinylearn
DB_USERNAME=admin
DB_PASSWORD=your-secure-password

# Frontend
FRONTEND_URL=https://your-frontend-domain.com

# Broadcasting
BROADCAST_CONNECTION=reverb
REVERB_HOST=your-backend-domain.com
REVERB_PORT=443
REVERB_SCHEME=https

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=465
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_FROM_ADDRESS=noreply@tinylearn.app

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Cache
CACHE_DRIVER=redis
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
REDIS_PORT=6379

# Session
SESSION_DRIVER=cookie
SESSION_DOMAIN=.your-domain.com

# Sanctum
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.com
```

---

## Deployment Checklist

- [ ] Database created and accessible
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL/TLS certificates installed
- [ ] CORS configured correctly
- [ ] Email service configured
- [ ] Monitoring and logging setup
- [ ] Backups configured
- [ ] Domain DNS configured
- [ ] CDN configured (optional)
- [ ] Load balancer configured (optional)

---

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
mysql -h your-host -u username -p -e "SELECT 1"

# Check credentials in .env
cat .env | grep DB_
```

### Frontend Not Loading
```bash
# Check build output
npm run build

# Verify API URL in .env
cat react/.env
```

### API Not Responding
```bash
# Check logs
tail -f storage/logs/laravel.log

# Restart service
systemctl restart php-fpm
```

### SSL Certificate Issues
```bash
# Renew certificate
certbot renew

# Check certificate
openssl s_client -connect your-domain.com:443
```

---

## Cost Estimation

| Provider | Frontend | Backend | Database | Total/Month |
|----------|----------|---------|----------|------------|
| Vercel + Railway | Free | $5 | $5 | $10 |
| AWS | Free (S3) | $10-50 | $10-50 | $20-100 |
| Google Cloud | Free (Storage) | $10-50 | $10-50 | $20-100 |
| DigitalOcean | $5 | $5 | $15 | $25 |
| Heroku | $7 | $7 | $9 | $23 |

---

## Support & Resources

- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [AWS Documentation](https://docs.aws.amazon.com)
- [Google Cloud Docs](https://cloud.google.com/docs)
- [DigitalOcean Docs](https://docs.digitalocean.com)

---

## Next Steps

1. Choose a cloud provider
2. Follow the deployment steps
3. Test all features
4. Setup monitoring
5. Configure backups
6. Document your setup
