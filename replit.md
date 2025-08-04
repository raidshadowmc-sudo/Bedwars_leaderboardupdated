# Overview

This is a Minecraft Bedwars-themed leaderboard web application built with Flask. The application allows users to view, add, and manage player scores in a gaming leaderboard with a distinctive Minecraft aesthetic. It features a responsive web interface with custom CSS styling that mimics the Minecraft game's visual design, complete with team colors, rank displays, and animated effects.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a traditional server-side rendered architecture with Flask's Jinja2 templating engine. The frontend consists of a single main page (`index.html`) that displays the leaderboard and includes forms for adding players and clearing the board. The interface is heavily styled with custom CSS (`minecraft.css`) that creates a Minecraft Bedwars theme using pixel fonts, team colors, and game-inspired visual elements. JavaScript animations (`animations.js`) provide interactive effects like click animations, form validation, and visual feedback.

## Backend Architecture
The backend follows a simple Flask MVC pattern with clear separation of concerns:
- `app.py` serves as the application factory and configuration center
- `models.py` defines the database schema using SQLAlchemy ORM
- `routes.py` handles HTTP requests and business logic
- The application uses Flask-SQLAlchemy for database operations with a single `Player` model

## Data Storage
The application uses SQLAlchemy with support for multiple database backends through environment configuration. By default, it uses SQLite for local development (`bedwars_leaderboard.db`) but automatically switches to PostgreSQL when deployed on Render.com via the `DATABASE_URL` environment variable. The database includes connection pooling and health checks for production reliability. The application also includes automatic URL fixing for PostgreSQL connections that use the older `postgres://` protocol.

## Authentication and Authorization
Currently, the application has no authentication system - it's designed as an open leaderboard where anyone can add players or clear the board. All operations are public and require no user accounts or permissions.

## Form Handling and Validation
The application handles form submissions through standard HTML forms with server-side validation. Input validation includes checking for empty names, ensuring scores are non-negative integers, and providing user feedback through Flask's flash messaging system. Client-side JavaScript provides additional real-time validation and visual feedback.

# External Dependencies

## Core Framework Dependencies
- **Flask**: Web framework for handling HTTP requests and responses
- **Flask-SQLAlchemy**: ORM integration for database operations
- **SQLAlchemy**: Database abstraction layer with support for multiple database engines
- **Werkzeug**: WSGI utilities including ProxyFix for deployment behind reverse proxies

## Frontend Dependencies
- **Google Fonts**: External font loading for 'Orbitron' and 'Press Start 2P' fonts to achieve the Minecraft aesthetic
- **Font Awesome**: Icon library (version 6.0.0) for user interface icons like trophies, users, and various UI elements

## Database Support
The application is configured to work with SQLite by default but supports PostgreSQL and other SQLAlchemy-compatible databases through environment variable configuration. No external database service is required for basic operation.

## Development and Deployment
The application includes proxy fix middleware for deployment behind reverse proxies (common in cloud hosting environments) and comprehensive logging configuration for debugging and monitoring.

### Render.com Deployment
The application is fully configured for deployment on Render.com with the following files:
- `render.yaml`: Infrastructure as Code configuration for automatic deployment
- `build.sh`: Build script that installs dependencies and initializes the database
- `render_requirements.txt`: Python dependencies optimized for Render
- `init_db.py`: Database initialization script with sample data
- `RENDER_DEPLOYMENT.md`: Complete deployment guide

The application automatically detects Render environment and switches from SQLite to PostgreSQL, handles dynamic port assignment, and includes proper Gunicorn configuration with multiple workers for production performance.