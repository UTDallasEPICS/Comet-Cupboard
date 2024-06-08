# Comet Cupboard: Inventory Tracking

<!-- markdownlint-disable-next-line MD033 -->
<details><summary><h2>Table of Contents</h2></summary>

- [Comet Cupboard: Inventory Tracking](#comet-cupboard-inventory-tracking)
  - [Conceptual Overview](#conceptual-overview)
    - [Users/Roles](#usersroles)
  - [Functional Requirements](#functional-requirements)
  - [Third Party Integrations](#third-party-integrations)
  - [Tech Stack](#tech-stack)
  - [Deployment Notes](#deployment-notes)
  - [Migration Scripts](#migration-scripts)
  - [Setting Up Development Environment](#setting-up-development-environment)
    - [Install the repo](#install-the-repo)
    - [Set up Dependencies](#set-up-dependencies)
    - [Running Express Server](#running-express-server)
    - [Previewing Frontend Only](#previewing-frontend-only)
    - [Testing API Calls with Postman](#testing-api-calls-with-postman)

</details>

## Conceptual Overview

The purpose of the Comet Cupboard Inventory is to

- Provide a streamline view of the inventory of the food pantry
- Faciliate Add/Removal of inventory items through transactions (Catalogue and Cart page) and restocking (Inventory)
- Provide analytics for the admin about: (North Bank Student Form)
  - Student demographics (major, age, grade and activity at Comet Cupboard (how many times a week? Last visit?))
  - Item statistics (popularity, amount/wk, expired on shelve if any)

Three views: Faculty, Staff, Student
Pages: Checkout Page (Cashier), Inventory Page, Catologue Page, and Cart Page.
Faculty: Sees Inventory Page, Checkout Page, Catologue Page, Donors Page, North Bank Form Page, and Student Information Page
Staff: Sees Inventory Page, Checkout Page, Catologue Page, Cart Page, and North Bank Form Page
Student: Sees Catlogue Page, North Bank Form Page, and Cart Page

### Users/Roles

## Functional Requirements

Checkout Page:
Always querying the database's "carts table" and displays a row of `netID | itemsList` for carts that have been finalized. There is a green checkout button at the end of the row.

Inventory Page:
Query the database's "item table" and prints a view of all items throughout the history. Has a CREATE button at the top that creates a new row in the item table. Create is going to be hard because we also have to allow staff to upload an image for the item.
 Also each row displayed on the frontend would have a "MODIFY" option that modifies the database. There is also a "DELETE" option which would delete the corresponding row in the database. Looks like "Modify | Delete" per every row displayed.

Catologue Page:
For every item that has stock > 0, display their card. Card is the square graphic that has the image, name of the item, category of the item, and a +/- quantity slider.
Sort by ABC or ZYX.
The same logic is applied when they click a specific category but with the extra condition that they match the category.

Cart Page:
Fullscreen view of the current cart, which is queried from the carts db for a cart that belongs to the studentID of the student. Should have an "empty cart" option which would delete the cart from the carts and the cart table in the database. Deleting or updating the quantity will also be operations done on the cart table. There should be a big green "CHECKOUT" button, which once clicked, sends the cart to the Checkout Page which the staff sees. While the student is waiting for someone to verify their stuff, there should be a screen of "Waiting...." and then "All set" once the staff signs on their end.

## Third Party Integrations

## Tech Stack

- React + Vite
- TypeScript
- Material UI
- Express.js
- Prisma ORM and PostgreSQL (on Neon DB)
- Postman

## Deployment Notes

## Migration Scripts

## Setting Up Development Environment

Ensure Node.js, npm, Visual Studio Code, Git, WSL2 (windows only) are installed.

Credentials and database URL for the Neon database are in the Final Report of Spring 2024 (MUST READ). (maybe lol)

### Install the repo

```bash
git clone https://github.com/UTDallasEPICS/Comet-Cupboard.git
cd Comet-Cupboard
```

### Set up Dependencies

Setting Up Frontend Environment

```bash
# Assume current directory is /Comet-Cupboard
cd ui
npm install
```

Setting Up Backend Environment

```bash
# Assume current directory is /Comet-Cupboard
cd server
npm install
npx prisma generate
```

### Running Express Server

```bash
# Assume current directory is /Comet-Cupboard/server
npm run build
npm run start # use this to start running
npm run dev - nodemon watchmode # use this to dynamically update changed backend files while running
```

### Previewing Frontend Only

```bash
# Assume current directory is /Comet-Cupboard/ui
npm run dev
```

### Testing API Calls with Postman

Download Postman. There is a VSCode extension. :)
Tutorial? maybe later
