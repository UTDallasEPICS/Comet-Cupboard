-- CreateTable
CREATE TABLE "user" (
    "userID" TEXT NOT NULL PRIMARY KEY,
    "display_name" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "user_session" (
    "userID" TEXT NOT NULL PRIMARY KEY,
    "public_code" TEXT NOT NULL,
    "public_icon" TEXT NOT NULL,
    CONSTRAINT "user_session_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user" ("userID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "img_name" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "item" (
    "item_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "img_name" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "item_category_name_fkey" FOREIGN KEY ("category_name") REFERENCES "category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "item_count_change" (
    "count_change_id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount_changed" INTEGER NOT NULL,
    "item_id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "field_map" JSONB,
    CONSTRAINT "item_count_change_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "item_count_change_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "source" ("source_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "field" (
    "field_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    CONSTRAINT "field_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "source" ("source_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "source" (
    "source_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "inventory_change_session" (
    "public_code" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "inventory_change_session_public_code_fkey" FOREIGN KEY ("public_code") REFERENCES "user_session" ("public_code") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inventory_change_session_item" (
    "public_code" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    PRIMARY KEY ("public_code", "item_id"),
    CONSTRAINT "inventory_change_session_item_public_code_fkey" FOREIGN KEY ("public_code") REFERENCES "inventory_change_session" ("public_code") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "inventory_change_session_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cart" (
    "public_code" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pending" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "cart_public_code_fkey" FOREIGN KEY ("public_code") REFERENCES "user_session" ("public_code") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cart_item" (
    "public_code" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "count_adjustment" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("item_id", "public_code"),
    CONSTRAINT "cart_item_public_code_fkey" FOREIGN KEY ("public_code") REFERENCES "cart" ("public_code") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cart_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order" (
    "order_id" TEXT NOT NULL PRIMARY KEY,
    "userID" TEXT NOT NULL,
    "cart_created_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_userID_fkey" FOREIGN KEY ("userID") REFERENCES "user" ("userID") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order_item" (
    "item_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    PRIMARY KEY ("item_id", "order_id"),
    CONSTRAINT "order_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order" ("order_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "deal" (
    "item_id" TEXT NOT NULL PRIMARY KEY,
    "actual_count" INTEGER NOT NULL,
    "adjusted_count" INTEGER NOT NULL,
    CONSTRAINT "deal_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "queue_entry" (
    "public_code" TEXT NOT NULL PRIMARY KEY,
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "position" INTEGER NOT NULL,
    CONSTRAINT "queue_entry_public_code_fkey" FOREIGN KEY ("public_code") REFERENCES "user_session" ("public_code") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "location" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "img_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "emergency_bag" (
    "bag_id" TEXT NOT NULL PRIMARY KEY,
    "locationName" TEXT,
    "is_vegetarian" BOOLEAN NOT NULL DEFAULT false,
    "has_peanut_butter" BOOLEAN NOT NULL DEFAULT false,
    "privacy" TEXT NOT NULL DEFAULT 'PUBLIC',
    "bag_description" TEXT DEFAULT '',
    "expiry_date" DATETIME NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "emergency_bag_locationName_fkey" FOREIGN KEY ("locationName") REFERENCES "location" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "emergency_bag_item" (
    "item_id" TEXT NOT NULL,
    "bag_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    PRIMARY KEY ("item_id", "bag_id"),
    CONSTRAINT "emergency_bag_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "emergency_bag_item_bag_id_fkey" FOREIGN KEY ("bag_id") REFERENCES "emergency_bag" ("bag_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "issued_emergency_bag" (
    "bag_id" TEXT NOT NULL PRIMARY KEY,
    "location" TEXT NOT NULL,
    "bag_description" TEXT DEFAULT '',
    "expiry_date" DATETIME NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "issued_emergency_bag_location_fkey" FOREIGN KEY ("location") REFERENCES "location" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "issued_emergency_bag_item" (
    "item_id" TEXT NOT NULL,
    "bag_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    PRIMARY KEY ("item_id", "bag_id"),
    CONSTRAINT "issued_emergency_bag_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "issued_emergency_bag_item_bag_id_fkey" FOREIGN KEY ("bag_id") REFERENCES "issued_emergency_bag" ("bag_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_session_public_code_key" ON "user_session"("public_code");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "item_name_key" ON "item"("name");

-- CreateIndex
CREATE UNIQUE INDEX "source_name_key" ON "source"("name");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_bag_label_key" ON "emergency_bag"("label");
