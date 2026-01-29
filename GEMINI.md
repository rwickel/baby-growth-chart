# Project Context: Baby Growth Chart

## Project Overview

**Baby Growth Chart** is a modern, responsive web and mobile application designed to track and visualize baby growth data (weight, height, head circumference). It allows parents to manage records for multiple children, visualize growth trends with interactive charts, and export data.

The project is built as a Single Page Application (SPA) using React and TypeScript, bundled with Vite. It utilizes Capacitor to wrap the web application into a native Android app.

### Key Technologies

*   **Frontend Framework:** React (v18) with TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS with `shadcn/ui` components (Radix UI based)
*   **Charts:** Recharts
*   **State Management:** TanStack Query (React Query)
*   **Form Handling:** React Hook Form + Zod validation
*   **Mobile Runtime:** Capacitor (Android platform)
*   **Testing:** Vitest + React Testing Library

## Architecture & Structure

The codebase follows a standard React application structure:

*   **`src/components/`**: Reusable UI components.
    *   `ui/`: Primitive components from `shadcn/ui`.
    *   Feature components: `GrowthChart.tsx`, `EntryForm.tsx`, `BabySelector.tsx`, `SettingsDialog.tsx`, etc.
*   **`src/pages/`**: Route-level components (`Index.tsx`, `NotFound.tsx`).
*   **`src/hooks/`**: Custom React hooks (e.g., `useBabyData` for local storage state management, `useTranslation`).
*   **`src/lib/`**: Utility functions (`unitConversions.ts`, `exportData.ts`, `utils.ts`).
*   **`src/data/`**: Static data files (e.g., growth reference standards).
*   **`android/`**: Native Android project files generated and managed by Capacitor.
*   **`assets/`**: Source assets for generating app icons and splash screens (used by `@capacitor/assets`).

## Building and Running

### Web Development

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Start Development Server:**
    ```bash
    npm run dev
    ```
3.  **Run Tests:**
    ```bash
    npm run test
    ```
4.  **Build for Production:**
    ```bash
    npm run build
    ```

### Mobile Development (Android)

The Android app relies on the web build (`dist` folder).

1.  **Sync Web Assets:**
    After making changes to the React code, build and sync to the native project:
    ```bash
    npm run build
    npx cap sync
    ```
2.  **Open in Android Studio:**
    ```bash
    npx cap open android
    ```
    From Android Studio, you can run the app on an emulator or physical device.

3.  **Generate Assets (Icons/Splash):**
    ```bash
    npx capacitor-assets generate --android
    ```

## Development Conventions

*   **State Persistence:** The application currently persists data primarily via `localStorage` (managed in `useBabyData`), making it offline-first but device-local.
*   **Mobile styling:** Mobile-specific adjustments (like Safe Area insets) are handled in `src/index.css` and via Capacitor plugins (`StatusBar`).
*   **Testing:** Unit tests are located alongside feature logic (e.g., `src/hooks/useBabyData.test.tsx`) or in `src/lib/`.
*   **Theming:** Supports light/dark mode and dynamic gender-based themes (Blue/Pink backgrounds).
