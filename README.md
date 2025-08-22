This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication Setup

This project uses NextAuth.js with Google OAuth for authentication. The current setup uses JWT strategy (no database required).

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

### 3. Update Environment Variables

Update your `.env` file with your Google OAuth credentials:

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Test Authentication

Once configured, you can:

- Visit the main page and click "Sign in with Google"
- See your profile picture and email when signed in
- Sign out using the dropdown menu

## Features

- **Dark Mode** - Toggle between light, dark, and system themes
- **Authentication** - Google OAuth sign-in with NextAuth.js (JWT strategy)
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
└── lib/
    └── utils.ts                        # Utility functions
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
