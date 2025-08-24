This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Quick Start

1. **Clone and install dependencies:**

   ```bash
   git clone <your-repo-url>
   cd freebox
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Set up the database:**

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** with your browser to see the result.

## Getting Started

For detailed setup instructions, see the sections below.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication Setup

This project uses NextAuth.js with Google OAuth for authentication, backed by Prisma PostgreSQL for persistent user data.

### 1. Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add `http://localhost:3000/api/auth/callback/google` to the authorized redirect URIs
6. Copy the Client ID and Client Secret

### 2. Generate NEXTAUTH_SECRET

Generate a secure secret key for NextAuth.js:

```bash
openssl rand -base64 32
```

### 3. Set up Environment Variables

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update your `.env` file with your actual credentials:
   - Generate a secure NEXTAUTH_SECRET: `openssl rand -base64 32`
   - Add your Google OAuth credentials
   - Add your Cloudinary credentials
   - Add your PostgreSQL database URL

See `.env.example` for detailed descriptions of each variable.

### 4. Set up Cloudinary (for Image Uploads)

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard and copy your credentials:
   - Cloud Name
   - API Key
   - API Secret
3. Add these to your `.env` file (see step 3 above)

### 5. Set up Database

The project uses Prisma PostgreSQL for user data persistence:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate --no-engine

# Run database migrations
npx prisma migrate dev
```

### 6. Test Authentication

Once configured, you can:

- Visit the main page and click "Sign in with Google"
- See your profile picture and email when signed in
- Sign out using the dropdown menu

### 7. Test Image Upload

Once Cloudinary is configured:

- Go to "Post an Item" page
- Drag and drop images or click to select files
- Images will be automatically uploaded and optimized
- View uploaded images in the item grid and detail pages

## Features

- **Dark Mode** - Toggle between light, dark, and system themes
- **Authentication** - Google OAuth sign-in with NextAuth.js and Prisma PostgreSQL
- **Image Upload** - Drag-and-drop image uploads with Cloudinary optimization
- **Item Management** - Create, edit, and delete items with images
- **Interest System** - Express interest in items and manage recipients
- **UI Components** - Built with shadcn/ui
- **Responsive Design** - Works on all screen sizes

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth.js API routes
│   ├── globals.css                      # Global styles
│   ├── layout.tsx                       # Root layout with providers
│   └── page.tsx                         # Homepage
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── auth-provider.tsx               # NextAuth SessionProvider
│   ├── login-btn.tsx                   # Login/logout button
│   └── mode-toggle.tsx                 # Dark mode toggle
├── lib/
│   ├── prisma.ts                       # Prisma client with Accelerate
│   └── utils.ts                        # Utility functions
└── prisma/
    └── schema.prisma                   # Database schema
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
