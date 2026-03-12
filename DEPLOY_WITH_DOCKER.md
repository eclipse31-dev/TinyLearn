# Deploy TinyLearn LMS with Docker

## Quick Start (Local Testing)

### Prerequisites
- Docker installed
- Docker Compose installed
- Git installed

### Step 1: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/tinylearn.git
cd tinylearn
```

### Step 2: Start Services

```bash
# Build and start all services
docker-compose up -d

# Wait for services to be ready (30 seconds)
sleep 30

# Run migrations
docker-compose exec api php artisan migrate --force

# Seed database (optional)
docker-compose exec api php artisan db:seed
```

### Step 3: Access Application

- **Frontend**: http://localhost:5173
- **API**: http://localhost:8000
- **WebSocket**: ws://localhost:8080
- **Email Testing**: http://localhost:8025 (Mailhog)
- **Database**: localhost:5432 (PostgreSQL)

### Test Credentials

```
Email: admin@example.com
Password: password
```

### Step 4: Stop Services

```bash
docker-compose down

# Remove volumes (delete data)
docker-compose down -v
```

---

## Deploy to Cloud

### Option 1: Deploy to AWS ECR + ECS

#### Prerequisites
- AWS Account
- AWS CLI configured
- Docker installed

#### Step 1: Create ECR Repository

```bash
# Create repository
aws ecr create-repository --repository-name tinylearn-api --region us-east-1

# Get login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

#### Step 2: Build and Push Image

```bash
# Build image
docker build -t tinylearn-api .

# Tag image
docker tag tinylearn-api:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/tinylearn-api:latest

# Push to ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/tinylearn-api:latest
```

#### Step 3: Create RDS Database

```bash
# Create PostgreSQL database
aws rds create-db-instance \
  --db-instance-identifier tinylearn-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20 \
  --region us-east-1
```

#### Step 4: Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster --cluster-name tinylearn --region us-east-1

# Create task definition (see task-definition.json below)
aws ecs register-task-definition --cli-input-json file://task-definition.json --region us-east-1

# Create service
aws ecs create-service \
  --cluster tinylearn \
  --service-name tinylearn-api \
  --task-definition tinylearn-api \
  --desired-count 1 \
  --region us-east-1
```

### Option 2: Deploy to Google Cloud Run

#### Prerequisites
- Google Cloud Account
- gcloud CLI installed
- Docker installed

#### Step 1: Configure gcloud

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

#### Step 2: Create Cloud SQL Database

```bash
# Create PostgreSQL instance
gcloud sql instances create tinylearn-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Create database
gcloud sql databases create tinylearn --instance=tinylearn-db

# Create user
gcloud sql users create postgres \
  --instance=tinylearn-db \
  --password=YOUR_PASSWORD
```

#### Step 3: Build and Push to Container Registry

```bash
# Build image
docker build -t gcr.io/YOUR_PROJECT_ID/tinylearn-api .

# Push to Container Registry
docker push gcr.io/YOUR_PROJECT_ID/tinylearn-api
```

#### Step 4: Deploy to Cloud Run

```bash
gcloud run deploy tinylearn-api \
  --image gcr.io/YOUR_PROJECT_ID/tinylearn-api \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars DB_HOST=YOUR_CLOUD_SQL_IP,DB_DATABASE=tinylearn,DB_USERNAME=postgres,DB_PASSWORD=YOUR_PASSWORD
```

### Option 3: Deploy to DigitalOcean App Platform

#### Prerequisites
- DigitalOcean Account
- doctl CLI installed

#### Step 1: Create app.yaml

```yaml
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

databases:
- name: db
  engine: POSTGRES
  version: "15"
```

#### Step 2: Deploy

```bash
doctl apps create --spec app.yaml
```

### Option 4: Deploy to Heroku

#### Prerequisites
- Heroku Account
- Heroku CLI installed

#### Step 1: Create Procfile

```
web: vendor/bin/heroku-php-apache2 public/
release: php artisan migrate --force
```

#### Step 2: Deploy

```bash
# Login
heroku login

# Create app
heroku create tinylearn-app

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set APP_ENV=production

# Deploy
git push heroku main

# Run migrations
heroku run php artisan migrate
```

---

## Docker Compose Services

### Services Included

1. **PostgreSQL** - Primary database
2. **MySQL** - Alternative database
3. **Redis** - Cache and session storage
4. **Laravel API** - Backend application
5. **Reverb** - WebSocket server
6. **React Frontend** - Frontend application
7. **Mailhog** - Email testing
8. **Nginx** - Reverse proxy

### Environment Variables

Edit `.env` file:

```env
APP_NAME=TinyLearn
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=tinylearn
DB_USERNAME=postgres
DB_PASSWORD=postgres

CACHE_DRIVER=redis
REDIS_HOST=redis
REDIS_PORT=6379

BROADCAST_CONNECTION=reverb
REVERB_HOST=localhost
REVERB_PORT=8080

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
```

---

## Common Docker Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api

# Last 100 lines
docker-compose logs --tail=100 api
```

### Execute Commands

```bash
# Run artisan command
docker-compose exec api php artisan tinker

# Run npm command
docker-compose exec frontend npm run build

# Access database
docker-compose exec postgres psql -U postgres -d tinylearn
```

### Rebuild Services

```bash
# Rebuild specific service
docker-compose build api

# Rebuild all services
docker-compose build

# Rebuild and restart
docker-compose up -d --build
```

### Database Management

```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres tinylearn > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres tinylearn < backup.sql

# Connect to database
docker-compose exec postgres psql -U postgres -d tinylearn
```

---

## Production Deployment Checklist

- [ ] Update `.env` with production values
- [ ] Set `APP_DEBUG=false`
- [ ] Set `APP_ENV=production`
- [ ] Configure database credentials
- [ ] Setup SSL/TLS certificates
- [ ] Configure CORS for production domain
- [ ] Setup email service (not Mailhog)
- [ ] Configure backups
- [ ] Setup monitoring and logging
- [ ] Configure CDN
- [ ] Setup load balancer (if needed)
- [ ] Configure auto-scaling (if needed)

---

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Rebuild images
docker-compose build --no-cache

# Remove and restart
docker-compose down -v
docker-compose up -d
```

### Database Connection Error

```bash
# Check database is running
docker-compose ps postgres

# Check credentials in .env
docker-compose exec api php artisan tinker
>>> DB::connection()->getPdo()
```

### Frontend Not Loading

```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

### Port Already in Use

```bash
# Change port in docker-compose.yml
# Or kill process using port
lsof -i :5173
kill -9 <PID>
```

---

## Performance Optimization

### Enable Caching

```bash
# Cache configuration
docker-compose exec api php artisan config:cache

# Cache routes
docker-compose exec api php artisan route:cache

# Cache views
docker-compose exec api php artisan view:cache
```

### Database Optimization

```bash
# Create indexes
docker-compose exec api php artisan migrate

# Optimize autoloader
docker-compose exec api composer dump-autoload --optimize
```

### Frontend Optimization

```bash
# Build for production
docker-compose exec frontend npm run build

# Analyze bundle
docker-compose exec frontend npm run build -- --analyze
```

---

## Scaling

### Horizontal Scaling

```bash
# Scale API service
docker-compose up -d --scale api=3

# Scale frontend service
docker-compose up -d --scale frontend=2
```

### Load Balancing

Use Nginx configuration in `nginx.conf` for load balancing across multiple instances.

---

## Monitoring

### Health Checks

```bash
# Check API health
curl http://localhost:8000/health

# Check database
docker-compose exec postgres pg_isready

# Check Redis
docker-compose exec redis redis-cli ping
```

### Logs

```bash
# View all logs
docker-compose logs -f

# Filter by service
docker-compose logs -f api

# Follow specific container
docker logs -f tinylearn_api
```

---

## Cleanup

```bash
# Stop all services
docker-compose down

# Remove volumes (delete data)
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Remove unused resources
docker system prune -a
```

---

## Support

- Docker Docs: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- AWS ECS: https://docs.aws.amazon.com/ecs
- Google Cloud Run: https://cloud.google.com/run/docs
- DigitalOcean: https://docs.digitalocean.com

---

## Next Steps

1. ✅ Test locally with Docker Compose
2. ✅ Push to GitHub
3. ✅ Deploy to cloud provider
4. ✅ Configure custom domain
5. ✅ Setup SSL certificate
6. ✅ Configure monitoring
7. ✅ Setup backups
8. ✅ Monitor performance

Enjoy your containerized TinyLearn LMS! 🐳🚀
