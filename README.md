# web-pos-frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Firebase Hosting Deployment

This project is configured for Firebase Hosting with GitHub Actions CI/CD.

### Prerequisites

1. **Firebase Project Setup**:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firebase Hosting in your project
   - Note your Firebase project ID

2. **Update Configuration**:
   - Replace `your-firebase-project-id` in `.firebaserc` with your actual Firebase project ID
   - Replace `your-firebase-project-id` in `.github/workflows/deploy.yml` with your actual Firebase project ID

3. **GitHub Secrets Setup**:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add a new secret named `FIREBASE_SERVICE_ACCOUNT`
   - Generate a service account key from Firebase Console → Project Settings → Service Accounts
   - Copy the entire JSON content and paste it as the secret value

### Local Development with Firebase

```sh
# Install dependencies (includes Firebase CLI)
npm install

# Build the project
npm run build

# Serve locally with Firebase emulator
npm run serve

# Deploy to Firebase Hosting
npm run deploy
```

### Automatic Deployment

The GitHub Actions workflow will automatically:
- Run on every push to `main` or `master` branch
- Install dependencies
- Run linting
- Build the project
- Deploy to Firebase Hosting (only on main/master branches)

### Manual Deployment

```sh
# Build and deploy manually
npm run build
npm run deploy
```

### Firebase Configuration

The project includes:
- `firebase.json`: Firebase hosting configuration
- `.firebaserc`: Firebase project configuration
- `.github/workflows/deploy.yml`: GitHub Actions CI/CD workflow
- Optimized caching headers for static assets
- SPA routing support with fallback to `index.html`
