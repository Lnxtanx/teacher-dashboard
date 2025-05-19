# Deployment Guide

## Prerequisites
1. AWS EC2 instance running Ubuntu/Amazon Linux
2. Node.js 18+ installed
3. PM2 installed globally (`npm install -g pm2`)
4. PostgreSQL database (can be RDS or installed on EC2)
5. AWS S3 bucket configured

## Deployment Steps

1. Clone the repository to the EC2 instance:
\`\`\`bash
git clone <your-repo-url>
cd teacher-panel
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a .env file with the following variables:
\`\`\`
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-jwt-secret"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="your-aws-region"
AWS_BUCKET_NAME="your-s3-bucket-name"
\`\`\`

4. Build the application:
\`\`\`bash
npm run build
\`\`\`

5. Start the application with PM2:
\`\`\`bash
pm2 start ecosystem.config.js
\`\`\`

6. Set up Nginx as reverse proxy:
\`\`\`bash
sudo apt-get install nginx
\`\`\`

Create Nginx configuration:
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

7. Enable and start Nginx:
\`\`\`bash
sudo ln -s /etc/nginx/sites-available/teacher-panel /etc/nginx/sites-enabled
sudo systemctl restart nginx
\`\`\`

## SSL Configuration (Optional)
To secure your application with SSL:

1. Install Certbot:
\`\`\`bash
sudo apt-get install certbot python3-certbot-nginx
\`\`\`

2. Obtain SSL certificate:
\`\`\`bash
sudo certbot --nginx -d your-domain.com
\`\`\`

## Monitoring
- Monitor application: \`pm2 monit\`
- View logs: \`pm2 logs\`
- Restart application: \`pm2 restart teacher-panel\`

## Updating the Application
1. Pull latest changes: \`git pull origin main\`
2. Install dependencies: \`npm install\`
3. Rebuild: \`npm run build\`
4. Restart PM2: \`pm2 restart teacher-panel\`
