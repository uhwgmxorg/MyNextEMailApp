# MyNextEMailApp

A demonstration Next.js application showcasing different methods of sending emails from a web application.

## Features

- **SMTP Integration**: Send emails using traditional SMTP servers
- **Resend API**: Modern email delivery using the Resend service
- **Interactive UI**: Simple interface to test both email sending methods
- **Production Ready**: Deployed with standalone mode and systemd integration

## Live Demo

Try it out here: [MyNextEMailApp](https://uhwgmxorg.online/MyNextEMailApp/)

## Tech Stack

- Next.js 16.1.1 (App Router)
- TypeScript
- Tailwind CSS
- Nodemailer (SMTP)
- Resend SDK

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (see `.env-template`)

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file with the following variables:

```env
# SMTP Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=Your Name <your-email@example.com>

# Resend Configuration
RESEND_API_KEY=re_your_api_key
RESEND_FROM=Your Name <your-email@resend.dev>
```

## Deployment

This application is designed to be deployed as a Next.js standalone build with systemd integration.

## Licence

MIT
