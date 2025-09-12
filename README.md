# Conectar Frontend

A modern client management system built with React, TypeScript, and cutting-edge frontend technologies.

## 🌐 Live URLs

- **Frontend Application**: [https://conectar-test.pages.dev](https://conectar-test.pages.dev)
- **Backend Repository**: [https://github.com/guibais/conectar-backend](https://github.com/guibais/conectar-backend)

## 🔐 Admin Access

For testing and demonstration purposes, use the following admin credentials:

- **Email**: `admin@conectar.com`
- **Password**: `123456`

> ⚠️ **Note**: These are demo credentials for testing purposes only.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Run tests
yarn test

# Run linting
yarn lint
```

## 🏗️ Architecture & Design Decisions

### State Management
- **Zustand**: Lightweight, scalable state management without boilerplate
- **TanStack Query**: Server state management with caching, synchronization, and background updates
- **React Secure Storage**: Encrypted token storage for enhanced security

### Component Architecture
- **Scalable Componentization**: Modular component structure following atomic design principles
- **Service Layer Separation**: Clean separation between UI components and API logic in `/services`
- **Custom Hooks**: Reusable business logic abstraction
- **Form Management**: React Hook Form + Zod for type-safe form validation

### Styling & Theming
- **Custom Tailwind Theme**: Extended Tailwind configuration with project-specific design tokens
- **CSS Custom Properties**: Dynamic theming support with CSS variables
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Internationalization (i18n)
- **React i18next**: Complete translation system with language detection
- **Dynamic Language Switching**: Runtime language changes without page reload
- **Namespace Organization**: Structured translation keys by feature

### Accessibility (a11y)
- **Semantic HTML**: Proper use of semantic elements and ARIA attributes
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Optimization**: Comprehensive screen reader compatibility

### Testing Strategy
- **Accessibility-First Testing**: Tests use semantic queries (`getByRole`, `getByLabelText`) instead of `data-testid`
- **Test Pyramid Approach**: Focus on unit tests with selective integration and E2E tests
- **Coverage Goals**: Comprehensive coverage for critical business logic and components

## 🛠️ Tech Stack

- **React 19** + **TypeScript** - Modern React with type safety
- **TanStack Router** - Type-safe file-based routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** + **Zod** - Form handling and validation
- **Tailwind CSS** - Utility-first styling
- **React Secure Storage** - Encrypted local storage
- **Vitest** - Fast unit testing
- **React i18next** - Internationalization

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components
│   ├── forms/          # Form-specific components
│   └── ui/             # Base UI components
├── services/           # API layer and data fetching
├── stores/             # Zustand stores
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── routes/             # File-based routing
└── i18n/               # Translation files
```

## 🔒 Security Features

- **Encrypted Token Storage**: React Secure Storage for sensitive data
- **Role-Based Access Control**: Protected routes based on user permissions
- **Input Validation**: Client-side validation with Zod schemas
- **XSS Protection**: Sanitized inputs and secure rendering

## 🌐 Features

- **Client Management**: Full CRUD operations for client data
- **User Authentication**: Secure login with role-based access
- **Responsive Design**: Mobile-first responsive interface
- **Real-time Validation**: Instant form feedback and validation
- **Address Autocomplete**: ViaCEP integration for Brazilian addresses
- **Multi-language Support**: Portuguese and English localization

## 🧪 Testing

The project follows accessibility-first testing principles:

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Watch mode for development
yarn test:watch
```

Tests prioritize semantic queries over implementation details, ensuring components are accessible and maintainable.
