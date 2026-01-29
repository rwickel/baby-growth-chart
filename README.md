# Baby Growth Chart

A modern, responsive web application for tracking and visualizing baby growth data (weight, height, head circumference). Built with React, TypeScript, and shadcn/ui.

## Features

- 👶 **Multi-Child Support**: Manage growth records for multiple babies.
- 📈 **Interactive Charts**: Visualize growth trends over time using Recharts.
- 📝 **Detailed Entries**: Log weight, length/height, and head circumference with dates.
- 🔄 **Unit Conversion**: Support for different unit systems (metric/imperial).
- 📤 **Data Export**: Export records to PDF for sharing with healthcare providers.
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices.
- 🌙 **Dark Mode**: Built-in support for light and dark themes.

## Tech Stack

- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (based on Radix UI)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd baby-growth-chart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:8080` (or the port shown in your terminal).

4. 
```bash
   npm install
   npm install @capacitor/android
   npm run build
   npx cap add android
   npx cap sync android
   npx cap open android   
 ```
   

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run test`: Runs the test suite using Vitest.

## Project Structure

```
src/
├── components/     # Reusable UI components and feature-specific widgets
│   ├── ui/         # primitive shadcn/ui components
│   └── ...         # Feature components (e.g., GrowthChart, EntryForm)
├── data/           # Static data (e.g., growth references)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and configurations
├── pages/          # Application pages/routes
├── types/          # TypeScript type definitions
└── test/           # Test setup and utilities
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT