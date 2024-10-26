# KeyFlow: Open-Source API Key Management System

KeyFlow is an open-source API key generation and management system built with Next.js and Convex. It provides a simple and efficient way to create, verify, and manage API keys for your applications.

## Features

- Create and verify API keys
- Real-time logs of API requests
- Built with Next.js and Convex
- Easy to integrate and customize
- Rate limiting support
- Customizable API key prefixes and expiration

## Tech Stack

- Next.js
- Convex
- Cloudflare Workers
- Hono
- Upstash Redis
- Tailwind CSS
- TypeScript

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/evansso-bit/keyflow.git
   ```

2. Install dependencies:
   ```
   cd keyflow/www
   npm install
   ```

3. Set up environment variables:
   Copy the `.env.example` file to `.env.local` and fill in the required values.

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `www/`: Next.js frontend application
- `keyflow-api/`: API server built with Hono and Cloudflare Workers
- `keyflow-api-with-convex/`: API server with Convex integration

## Deployment

The project is set up for deployment on Vercel and Cloudflare Workers. Refer to the deployment documentation for each platform for detailed instructions.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

## Links

- [Live Demo](https://keyflow.mpesaflow.com/)
- [GitHub Repository](https://github.com/evansso-bit/keyflow)

## Acknowledgements

Built with ❤️ by the MpesaFlow team.