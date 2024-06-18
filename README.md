# Comet Cupboard: Inventory Tracking

<!-- markdownlint-disable-next-line MD033 -->
<details><summary><h2>Table of Contents</h2></summary>

- [Comet Cupboard: Inventory Tracking](#comet-cupboard-inventory-tracking)
  - [Conceptual Overview](#conceptual-overview)
    - [Users/Roles](#usersroles)
      - [UTD Student](#utd-student)
      - [UTD Student Volunteer](#utd-student-volunteer)
      - [Comet Cupboard Staff](#comet-cupboard-staff)
  - [Functional Requirements](#functional-requirements)
    - [Single-Sign-On (SSO) Page](#single-sign-on-sso-page)
    - [Catalog Page](#catalog-page)
    - [Cart Checkout Page](#cart-checkout-page)
    - [Questionaire Page](#questionaire-page)
    - [Cart Verification Page](#cart-verification-page)
    - [Inventory Page](#inventory-page)
    - [Data Analytics Page](#data-analytics-page)
    - [Donors Page](#donors-page)
    - [Other Requirements](#other-requirements)
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

### Users/Roles

#### UTD Student

- Must be currently enrolled at UT Dallas
- Check out items at the Comet Cupboard (up to 6 item counts/week)

#### UTD Student Volunteer

- Verify carts
- Manage inventory
- Check out items at the Comet Cupboard (up to 6 item counts/week)

#### Comet Cupboard Staff

- Verify carts
- Manage inventory
- Look at data analytics

## Functional Requirements

### Single-Sign-On (SSO) Page

- SSO must be used to access the Comet Cupboard website (to be changed for a public view possibly?).

### Catalog Page

- The page must contain a search bar for users to lookup items by name.
- The page must contain sorting and filter options.
  - Sorting options include alphabetical and popularity.
  - Filter options include categories such as pantry staples, snacks, grains, breakfast grains, soup, protein, household items, personal care, fruits, and vegetables.
- The page must display all items that are in stock with an item card.
  - The item card includes the item image, name, category, amount in stock, and a button to add the item to cart.
- The page must display a cart icon that shows the number of items that are currently in the user's cart.
- The user must be able to navigate to the Cart Checkout Page through clicking on the cart icon.

### Cart Checkout Page

- The page must display the list of items that the user has added to their cart.
  - Each item shall have a delete button to quickly remove it from the cart.
- The page must have a BACK button to allow users to navigate back to the Catalog Page.
- The page must have a CONTINUE button to allow users to continue to the Questionaire Page.

### Questionaire Page

- The page must display a list of questions that the user can answer.
  - The set of questions will be determined through relevant question data for the North Texas Food Bank as well as specific items in the user's cart.
- The page must have a BACK button to allow users to navigate back to the Cart Checkout Page.
- The page must have a FINALIZE CHECKOUT button to allow users to continue to the Cart Verification Page.

### Cart Verification Page

- The page must display a message to the user that their cart is being verified. by student volunteers/staff. Additionally, there must be a message to warn users not to exit the page.
- Student volunteers/Staff must be able to see a list of pending carts and verify them.
  - Each cart must have an associated temporary ID and cart item information for workers to verify the contents easier.
- When a cart is verified, the user must be able to see an indicator that their cart is verifed and the cart must be removed from the pending cart list.
- Send the data!!!

### Inventory Page

- The page must display all items (whether in or out of stock) in the Comet Cupboard.
- To add an item, volunteers/staff must be able to upload an image and set the name, description, category, and count of the item.
- The page must allow volunteer/staff to be able to modify an item. This includes...
  - Changing the image, name, description, category, and count of the item.
  - Changing count must include an option to add/remove X items from the total count in addition to setting the total count manually.
- The page must allow volunteer/staff to be able to delete an item.
  - There shall be a two-factor confirmation with an additional message "Are you sure you want to delete item X?".

### Data Analytics Page

data and graphs goes crazy here

### Donors Page

??? This still needs clarification. This is aggregate data that shows how donation money is being spent at Comet Cupboard.

### Other Requirements

- The web application must be supported on various devices such as phone, tablet, and PC
- Maybe show the progress during checkout (review -> questions -> wait -> done)

## Third Party Integrations

SSO? idk

## Tech Stack

- React + Vite
- TypeScript
- Material UI
- Node.js and Express.js
- Prisma ORM and SQLite
- Postman

## Deployment Notes

N/A

## Migration Scripts

N/A

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
