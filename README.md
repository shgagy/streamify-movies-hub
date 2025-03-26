
# Streamify - Streaming Platform Demo

Streamify is a Netflix-inspired streaming platform demo built with modern web technologies. It features a sleek interface for browsing movies and TV shows, with functionalities like user authentication, watchlists, and content playback.

![Streamify Screenshot](https://i.imgur.com/placeholder.jpg)

## Features

- 🎬 Browse movies and TV shows catalog
- 📺 Watch content in the built-in video player
- 🔍 Search for titles
- 🏷️ Filter by genre
- 👤 User authentication (demo mode)
- 📋 Personal watchlist management
- 🌗 Light/dark theme support
- 📱 Fully responsive design

## Tech Stack

This project is built with:

- **React** - Frontend library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **React Router** - Navigation and routing
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - UI component library
- **Tanstack Query** - Data fetching and state management
- **Lucide Icons** - SVG icon set

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```sh
git clone <repository-url>
cd streamify
```

2. Install dependencies:
```sh
npm install
# or with yarn
yarn
```

3. Start the development server:
```sh
npm run dev
# or with yarn
yarn dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Project Structure

```
src/
├── components/     # UI components
├── contexts/       # React contexts for state management
├── hooks/          # Custom React hooks
├── lib/            # Utilities and helper functions
├── pages/          # Page components
├── services/       # API services
└── main.tsx        # Application entry point
```

## Authentication

This demo uses a simplified mock authentication system:

- Default demo account: demo@example.com / password123
- You can also "sign up" with any email/password (data stored in localStorage)

## Development Notes

- The application uses mock data for movies and TV shows stored in `src/lib/mockData.ts`
- User preferences, watchlists, and authentication are stored in localStorage

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
