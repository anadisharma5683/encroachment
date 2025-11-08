# Deployment Guide for Nirmaan Vigil AI

## Deploying to Vercel

This project is configured for deployment to Vercel with both frontend and backend API endpoints.

### Prerequisites

1. A Vercel account (free at [vercel.com](https://vercel.com))
2. This repository cloned locally
3. Node.js installed (version 18 or higher)

### Deployment Steps

1. **Install Vercel CLI (optional but recommended)**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy the project**
   ```bash
   # If using Vercel CLI
   vercel
   
   # Or deploy with production settings
   vercel --prod
   ```

   Alternatively, you can deploy directly from GitHub:
   1. Go to [vercel.com](https://vercel.com)
   2. Click "New Project"
   3. Import your repository
   4. Configure the project with these settings:
      - Framework: Vite
      - Build Command: `npm run build`
      - Output Directory: `dist`
      - Install Command: `npm install`

### Environment Variables

Set these environment variables in your Vercel project settings:

1. `MONGODB_URI` - Your MongoDB connection string
   Example: `mongodb+srv://username:password@cluster.mongodb.net/encroachment_db`

### Project Structure for Vercel

- Frontend: Built with Vite and deployed as a static site
- Backend API: Serverless functions in the `/api` directory
  - `/api/login.js` - Handles user authentication
  - `/api/register.js` - Handles user registration
- Separate `package.json` in `/api` directory for API dependencies

### Custom Domain (Optional)

To use a custom domain:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Domains
3. Add your custom domain
4. Follow the DNS configuration instructions

### Troubleshooting

1. **Build Failures**: Ensure all dependencies are correctly listed in package.json
2. **API Errors**: Verify environment variables are set correctly in Vercel
3. **MongoDB Connection**: Check that your MongoDB URI is correct and the database is accessible

### Local Development

To run the project locally:

```bash
# Install dependencies
npm install

# Run frontend and backend together
npm run dev:full

# Or run frontend only
npm run dev

# Or run backend only
npm run server
```

The application will be available at `http://localhost:8080`