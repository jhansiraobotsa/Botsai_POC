# BOTSAi

## Overview

BOTSAi is a comprehensive AI chatbot creation platform that enables users to build intelligent, customizable chatbots for any industry. The application allows users to upload documents, scrape website content, and create embeddable chatbot widgets that can be deployed anywhere. Built with a modern full-stack architecture, it provides a complete solution from chatbot creation to deployment with real-time chat interfaces and detailed analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built with React 18 and TypeScript, utilizing a component-based architecture with shadcn/ui for consistent design systems. The application uses Wouter for lightweight client-side routing and TanStack Query for efficient server state management and caching. The UI is styled with Tailwind CSS and follows a modern design system with support for light/dark themes. Key architectural decisions include:

- **Component Library**: shadcn/ui provides a comprehensive set of accessible, customizable components built on Radix UI primitives
- **State Management**: TanStack Query handles all server state, eliminating the need for additional client-side state management libraries
- **Routing**: Wouter provides a minimal routing solution that's lighter than React Router while maintaining essential functionality
- **Styling**: Tailwind CSS with CSS variables enables consistent theming and responsive design

### Backend Architecture
The server is built with Express.js and TypeScript, following a RESTful API design pattern. The architecture emphasizes simplicity and maintainability with clear separation of concerns:

- **API Layer**: Express routes handle HTTP requests and responses with proper error handling middleware
- **Storage Layer**: Abstracted storage interface allows for flexible database implementations (currently using in-memory storage with plans for PostgreSQL)
- **File Handling**: Multer middleware manages document uploads with size limits and proper validation
- **Development Tools**: Vite integration provides hot module replacement and efficient development workflow

### Data Storage Design
The application uses Drizzle ORM with PostgreSQL as the primary database solution, designed for scalability and type safety:

- **Schema Definition**: Centralized schema definitions in shared directory ensure consistency between client and server
- **Database Tables**: Core entities include users, chatbots, documents, conversations, and subscriptions
- **Session Management**: PostgreSQL session storage supports user authentication and session persistence
- **File Storage**: Document uploads are handled through the application layer with database metadata tracking

### Authentication System
The application implements a mock authentication system for MVP development with provisions for production authentication:

- **Session-Based Auth**: Uses express-session with PostgreSQL session store for secure session management
- **User Management**: Automatic user creation and profile management with support for external auth providers
- **Authorization**: Route-level middleware ensures proper access control for user-specific resources

### Real-Time Chat Architecture
The chat system is designed for real-time communication between users and AI chatbots:

- **Session Management**: Each chat session is tracked with unique identifiers for conversation continuity
- **Message Handling**: RESTful endpoints handle message sending and retrieval with proper error handling
- **Widget Integration**: Embeddable chat widgets can be deployed on any website with customizable styling and positioning

## External Dependencies

### UI and Styling
- **shadcn/ui**: Complete UI component library built on Radix UI primitives for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development and consistent design systems
- **Radix UI**: Headless component primitives providing accessibility and behavior without styling constraints
- **Class Variance Authority**: Type-safe component variant management for consistent component APIs

### Frontend State and Routing
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **Wouter**: Lightweight routing library for single-page application navigation
- **React Hook Form**: Performant form library with validation and error handling
- **Zod**: TypeScript-first schema validation for runtime type checking

### Backend and Database
- **Express.js**: Web application framework for building RESTful APIs and handling HTTP requests
- **Drizzle ORM**: Type-safe ORM with excellent TypeScript integration and database migration support
- **Neon Database**: PostgreSQL-compatible serverless database for scalable data storage
- **Multer**: Middleware for handling multipart/form-data file uploads

### Development and Build Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **TypeScript**: Static type checking for improved developer experience and code reliability
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing tool for autoprefixing and optimization
