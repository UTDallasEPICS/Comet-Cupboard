-- CreateTable
CREATE TABLE "user" (
    "net_id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "volunteer" (
    "net_id" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "volunteer_net_id_fkey" FOREIGN KEY ("net_id") REFERENCES "user" ("net_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "volunteer_shift" (
    "net_id" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,

    PRIMARY KEY ("net_id", "start_time"),
    CONSTRAINT "volunteer_shift_net_id_fkey" FOREIGN KEY ("net_id") REFERENCES "volunteer" ("net_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "admin" (
    "net_id" TEXT NOT NULL PRIMARY KEY,
    CONSTRAINT "admin_net_id_fkey" FOREIGN KEY ("net_id") REFERENCES "user" ("net_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "category" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "item" (
    "item_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "img_url" TEXT NOT NULL,
    CONSTRAINT "item_category_name_fkey" FOREIGN KEY ("category_name") REFERENCES "category" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cart" (
    "cart_id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "pending" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "cart_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "user" ("net_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cart_item" (
    "item_id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    PRIMARY KEY ("item_id", "cart_id"),
    CONSTRAINT "cart_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart" ("cart_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order" (
    "order_id" TEXT NOT NULL PRIMARY KEY,
    "net_id" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "accept_reason" TEXT NOT NULL,
    CONSTRAINT "order_net_id_fkey" FOREIGN KEY ("net_id") REFERENCES "user" ("net_id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "deal_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "item_id" TEXT NOT NULL,
    "actual_count" INTEGER NOT NULL,
    "adjusted_count" INTEGER NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    CONSTRAINT "deal_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
