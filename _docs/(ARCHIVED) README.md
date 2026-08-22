# Comet Cupboard: Inventory Tracking

Welcome to the Comet Cupboard: Inventory Tracking wiki!

## Wiki Navigation

Create a wiki page for your current semester's documentation if you haven't done so.

You can upload files to the wiki repository.

1. Clone the repository
```bash
git clone https://github.com/UTDallasEPICS/Comet-Cupboard.wiki.git
```
2. Make and push your changes.
3. Link the file in whatever page you are editing. [Example Text File](example/example.txt)
```
# Actual implementation
[Example Text File](example/example.txt)
```

## Conceptual Overview

The purpose of the Comet Cupboard Inventory Tracking is to

- Provide a streamlined view of the inventory of the food pantry
- Enhance the student and volunteer checkout experience, integrating a seamless flow for students to checkout items, and volunteers to manage the student's carts
- Facilitate add/removal of inventory items through restocking and cart checkout
- Provide analytics for the admin about useful statistics such as Comet Cupboard weekly usage or most popular items in a week

### Users/Roles

#### User

- Anyone who is able to login through UTD SSO
- Capable of logging in as a student, volunteer, or admin/staff

#### UTD Student

- Must be currently enrolled at UT Dallas
- Check out items at the Comet Cupboard through the shopping page and subpages (up to 6 item counts/week)

#### UTD (Student) Volunteer

- Verify carts through the cart verification page
- Manage inventory through the inventory management page
- Add items through the inventory management subpage
- Edit items through the inventory management subpage
- Manage deals through the inventory management subpage
- Check out items at the Comet Cupboard (up to 6 item counts/week)

#### Comet Cupboard Staff

- Verify carts
- Manage inventory through the inventory management page
- Add items through the inventory management subpage
- Edit items through the inventory management subpage
- Manage deals through the inventory management subpage
- Admin privileges such as adding/removing volunteer roles & items
- Look at data analytics through the data page

## Functional Requirements

### Shopping Functionality

- The page shall display the item picture, item name, and any existing deal associated with each item for all in-stock items.
- The user shall be able to search for items.
- The user shall be able to filter for items by category and deals.
- The student shall be able to add/remove an item to/from cart.
- The student shall be able to denote the expired count for items in cart.
- The student shall be able to view all cart item information.
- The student shall be able submit cart for verification.

### Questionaire Functionality

- The student shall be able to accept/decline the Statement of Understanding and Nondiscrimination clause.

### Cart Verification Functionality

- For a pending cart, the volunteer/staff shall be able to view the cart's owner and the adjusted count breakdown dependent on actual item count, applied deals, and applied expired items.
- For a pending cart, the page shall display a notification for the following conditions.
  - Cart contains expired items.
  - Adjusted cart item count exceeds 6 items.
  - Adjusted cart item count for a category exceeds 1 item.
- The volunteer/staff shall be able to accept/reject a cart.
  - Upon cart acceptance, the system shall record the cart transaction in the database.
- Upon a cart acceptance/rejection, the corresponding cart owner shall be notified of the result of cart verification.

### Queue Functionality

- The volunteer shall see a list of students currently in the queue as well as in the
shopping page, with each entry showing the student’s name/ID, and the amount of
elapsed time they have been waiting
- The shopping list as well as the queue list shall update in real time, reflecting students
who have entered or left the shopping page, to keep volunteers aware of active activity.
- An average wait time will be displayed to students.

### Inventory Functionality

- The page shall display the item picture, item name, and any existing deal associated with each item for all items.
- The volunteer/staff shall be able to search for items.
- The volunteer/staff shall be able to filter for items by category and deals.
- The volunteer/staff shall be able to modify an item's image, name, category, quantity, or deal.
- The volunteer/staff shall be able to select a source (eg. Community Garden) when modifying item counts.
- The volunteer/staff shall be able to add an item entity to the inventory.
- The staff shall be able to delete an item entity from the inventory.

### Data Analytics Functionality

- The system shall restrict the data page to admin users only, ensuring this information isn’t
accessible to volunteers or students.
- The system shall present data in a bar chart format as a way for the admin to visualize data
- The chart shall support multiple data series for comparison where relevant, with clear
legends for easy interpretation.
- The system shall provide a time filter enabling admins to narrow data results by time
periods.
- The system shall provide a view filter allowing admins to select which subset of data is
displayed.
- The system shall provide an aggregation filter to control how data is summarized (e.g., time,
view).
- The system shall provide a filter for the admin to view the number of student visits, number
of items donated, and the number of items distributed over a given time period.

### Other Requirements

- The web application must be supported on various devices such as phone, tablet, and PC.
- The user shall sign into the website via UTD SSO.
- The staff shall be able to add/remove volunteer roles from users.

## Third Party Integrations

- UTD SSO; Enhances website security by allowing students to sign in via NetID and password

## Tech Stack

- Frontend/Backend - Nuxt.js
- Database - SQLite and Prisma
- Testing - Vitest
