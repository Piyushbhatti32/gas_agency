# Gas Agency Management System - Production Setup Guide

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Deployment](#deployment)
5. [Performance Optimization](#performance-optimization)
6. [Security Measures](#security-measures)
7. [Monitoring & Logging](#monitoring--logging)
8. [Backup & Recovery](#backup--recovery)
9. [Troubleshooting](#troubleshooting)

## System Requirements

### Production Server
- Node.js 18+ (LTS version recommended)
- NPM 8+ or Yarn 1.22+
- 1GB RAM minimum
- 2 CPU cores minimum
- 10GB storage minimum

### Database
- SQLite for development
- PostgreSQL recommended for production
- 5GB storage minimum for database

### Network
- HTTPS certificate required
- Static IP recommended
- Domain name recommended

## Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/gas_agency.git
cd gas_agency
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install --production
# or
yarn install --production
\`\`\`

3. Build the application:
\`\`\`bash
npm run build
# or
yarn build
\`\`\`

## Configuration

1. Create production environment file:
\`\`\`bash
cp .env.example .env.production
\`\`\`

2. Configure environment variables:
\`\`\`env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/gas_agency

# JWT
JWT_SECRET=your-secure-jwt-secret-min-32-chars

# Razorpay
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Optional: Email
SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
SMTP_FROM=noreply@your-domain.com
\`\`\`

## Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
\`\`\`bash
npm i -g vercel
\`\`\`

2. Deploy:
\`\`\`bash
vercel --prod
\`\`\`

### Option 2: Manual Deployment

1. Set up process manager:
\`\`\`bash
npm install -g pm2
\`\`\`

2. Create PM2 ecosystem file:
\`\`\`bash
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'gas-agency',
    script: 'npm',
    args: 'start',
    instances: 'max',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOL
\`\`\`

3. Start application:
\`\`\`bash
pm2 start ecosystem.config.js
\`\`\`

## Performance Optimization

1. Enable compression:
\`\`\`js
// next.config.js
module.exports = {
  compress: true,
  // ... other config
}
\`\`\`

2. Configure caching:
\`\`\`js
// src/middleware.js
export function middleware(request) {
  const response = NextResponse.next()
  
  response.headers.set('Cache-Control', 'public, max-age=86400')
  response.headers.set('X-Frame-Options', 'DENY')
  
  return response
}
\`\`\`

3. Optimize images:
- Use WebP format
- Implement lazy loading
- Set appropriate sizes

## Security Measures

1. Enable security headers:
\`\`\`js
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self'" }
        ]
      }
    ]
  }
}
\`\`\`

2. Implement rate limiting:
\`\`\`js
// src/middleware.js
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

export { limiter }
\`\`\`

## Monitoring & Logging

1. Set up monitoring:
\`\`\`bash
# Install monitoring tools
npm install @sentry/nextjs
\`\`\`

2. Configure Sentry:
\`\`\`js
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  // your existing next config
}

module.exports = withSentryConfig(nextConfig)
\`\`\`

## Backup & Recovery

1. Database backups:
\`\`\`bash
# Create backup script
cat > backup.sh << EOL
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump gas_agency > backup_$DATE.sql
EOL

# Make executable
chmod +x backup.sh

# Add to crontab
crontab -e
# Add: 0 0 * * * /path/to/backup.sh
\`\`\`

2. File system backups:
- Back up .env files
- Back up uploaded files
- Back up SSL certificates

## Troubleshooting

Common issues and solutions:

1. Database connection errors:
- Check DATABASE_URL format
- Verify database credentials
- Check network connectivity

2. Payment integration issues:
- Verify Razorpay keys
- Check webhook configuration
- Monitor payment logs

3. Performance issues:
- Monitor CPU/memory usage
- Check database query performance
- Review API response times

4. Authentication problems:
- Verify JWT_SECRET
- Check token expiration
- Monitor auth logs

## Support

For support:
1. Check documentation
2. Review error logs
3. Contact system administrator
4. Open GitHub issue

## License

This project is proprietary. All rights reserved.
