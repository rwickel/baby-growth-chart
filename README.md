# Baby Growth Chart (Android / Web App)

A modern, responsive web and mobile application for tracking and visualizing baby growth data (weight, height, head circumference). Built with React, TypeScript, and shadcn/ui, and powered by Capacitor for mobile.
<img width="803" height="962" alt="image" src="https://github.com/user-attachments/assets/93d57bf4-bd3f-4e10-a3e6-4df3fdaa77c6" />


## Features

- 👶 **Multi-Child Support**: Manage growth records for multiple babies.
- 🎨 **Dynamic Themes**: Gender-based themes (Blue for boys, Pink for girls).
- ⚙️ **Quick Setup**: Configure language and units directly from the start screen.
- 📈 **Interactive Charts**: Visualize growth trends over time using Recharts.
- 📝 **Detailed Entries**: Log weight, length/height, and head circumference with dates.
- 🔄 **Unit Conversion**: Support for different unit systems (metric/imperial).
- 📤 **Data Export**: Export records to CSV and PDF for sharing with healthcare providers.
- 📱 **Mobile Ready**: Native Android support via Capacitor with immersive full-screen design.
- 🌙 **Dark Mode**: Built-in support for light and dark themes.

## Tech Stack

- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Mobile**: [Capacitor](https://capacitorjs.com/) (Android)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- Android Studio (for mobile development)

### Web Development

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
   The application will be available at `http://localhost:5173`.

### Mobile Development (Android)

1. Build the web application:
   ```bash
   npm run build
   ```

2. Sync with Android project:
   ```bash
   npx cap sync
   ```

3. Open in Android Studio:
   ```bash
   npx cap open android
   ```

4. Run the app on an emulator or physical device.

### Generating Assets

To regenerate app icons and splash screens (requires `@capacitor/assets`):
```bash
npx capacitor-assets generate --android
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
├── components/     # Reusable UI components
│   ├── ui/         # primitive shadcn/ui components
│   └── ...         # Feature components (e.g., GrowthChart, SettingsControls)
├── data/           # Static data
├── hooks/          # Custom React hooks (useBabyData, useTranslation)
├── lib/            # Utility functions (conversions, export)
├── pages/          # Route-level pages
├── types/          # TypeScript definitions
└── test/           # Unit tests
android/            # Native Android project files
assets/             # Source assets for icons/splash
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
