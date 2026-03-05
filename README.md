# Comet Cupboard: Inventory Tracking

## Project Overview

The purpose of the Comet Cupboard Inventory Tracking is to

- Provide a streamlined view of the inventory of the food pantry
- Facilitate add/removal of inventory items through restocking and cart checkout
- Provide analytics for the admin about useful statistics such as Comet Cupboard weekly usage or most popular items in a week

## Documentation

Refer to overall and semester documentation in [GitHub Wiki](../../wiki)

## Setting Up Development Environment

Ensure Node.js, npm, Visual Studio Code, Git are installed. Ensure that everyone is working on the latest Long-Term-Support (LTS) Node.js version.

Usually, you can get away with using Git Bash (on its own or within VS Code) as your terminal.

### Install the repo

```bash
git clone https://github.com/UTDallasEPICS/Comet-Cupboard.git
cd Comet-Cupboard
npm install
```

### Set up environment variables

```bash
# Fill out the environment variables accordingly
cp .env.example .env
```

### Database Setup

```bash
# Initialize the database and test data seeding
npm run dev-prisma
```

### Running the Application

```bash
# Pick your favorite way to run (-o flag will automatically open a new tab)
npx nuxt dev -o
npm run dev
npm run dev -- -o
```

### Useful Dev Tips

#### Prettier Formatting

```bash
npm run format
```

#### Prisma

```bash
# Prisma GUI to view database
npx prisma studio
```

#### Postman

Use Postman to test HTTP, SSE, and WebSockets. Keep in mind that some features like SSE do not work on the Postman extension for VSCode, so have the Postman desktop app for full functionality.

## Deployment Notes

N/A

## Migration Scripts

N/A
