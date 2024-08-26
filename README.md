# AIDesign

AIDesign is an AI-powered image generation website built with Next.js and React. Users can create unique images from text descriptions using the Ideogram API.

[中文说明](./README_CN.md)

## Features

- AI-powered image generation from text prompts
- User authentication with Google login
- Credit system for image generation
- Public gallery of generated images
- Responsive design for various devices

## Tech Stack

- Frontend: Next.js, React
- Backend: Next.js API routes
- Database: PostgreSQL with Prisma ORM
- Authentication: NextAuth.js
- Payment: Stripe
- API Integration: Ideogram API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables (see `.env.example`)
4. Run the development server:
   ```
   npm run dev
   ```

## Project Structure

- `/src/app`: Next.js app router and page components
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and configurations
- `/public`: Static assets

## API Routes

- `/api/generate`: Image generation endpoint
- `/api/user/credits`: User credit management
- `/api/purchase-credits`: Credit purchase endpoint

## Deployment

This project is set up for deployment on Vercel. Configure your Vercel project with the necessary environment variables.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).