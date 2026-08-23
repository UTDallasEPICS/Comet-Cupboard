-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "display_name" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "user_session" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "public_code" TEXT NOT NULL,
    "public_icon" TEXT NOT NULL,
    CONSTRAINT "user_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "queue_entry" (
    "public_code" TEXT NOT NULL PRIMARY KEY,
    "joined_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "position" INTEGER NOT NULL,
    "queue_ping_sent_at" DATETIME,
    "queue_ping_ack_at" DATETIME,
    "queue_ping_ack_message" TEXT,
    CONSTRAINT "queue_entry_public_code_fkey" FOREIGN KEY ("public_code") REFERENCES "user_session" ("public_code") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "category" (
    "category_id" TEXT NOT NULL PRIMARY KEY,
    "category_name" TEXT NOT NULL,
    "img_name" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "deal" (
    "item_id" TEXT NOT NULL PRIMARY KEY,
    "actual_count" INTEGER NOT NULL,
    "adjusted_count" INTEGER NOT NULL,
    CONSTRAINT "deal_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item" ("item_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "item" (
    "item_id" TEXT NOT NULL PRIMARY KEY,
    "item_name" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "item_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category" ("category_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "item_label" (
    "item_label_id" TEXT NOT NULL PRIMARY KEY,
    "item_label_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "specific_item" (
    "specific_item_id" TEXT NOT NULL PRIMARY KEY,
    "product_name" TEXT NOT NULL,
    "img_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "item_id" TEXT NOT NULL,
    CONSTRAINT "specific_item_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "item" ("item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "source" (
    "source_id" TEXT NOT NULL PRIMARY KEY,
    "source_name" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "field" (
    "field_id" TEXT NOT NULL PRIMARY KEY,
    "field_name" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "choices" JSONB,
    "optional" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "field_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "source" ("source_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inventory_intake_session" (
    "inventory_intake_session_id" TEXT NOT NULL PRIMARY KEY,
    "inventory_intake_session_name" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "intake_date" DATETIME NOT NULL,
    "source_id" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "source_metadata" JSONB,
    CONSTRAINT "inventory_intake_session_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "source" ("source_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inventory_intake_session_item_change" (
    "inventory_intake_session_id" TEXT NOT NULL,
    "specific_item_id" TEXT NOT NULL,
    "amount_changed" INTEGER NOT NULL,

    PRIMARY KEY ("inventory_intake_session_id", "specific_item_id"),
    CONSTRAINT "inventory_intake_session_item_change_inventory_intake_session_id_fkey" FOREIGN KEY ("inventory_intake_session_id") REFERENCES "inventory_intake_session" ("inventory_intake_session_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "inventory_intake_session_item_change_specific_item_id_fkey" FOREIGN KEY ("specific_item_id") REFERENCES "specific_item" ("specific_item_id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "specific_item_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "count_adjustment" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("specific_item_id", "public_code"),
    CONSTRAINT "cart_item_public_code_fkey" FOREIGN KEY ("public_code") REFERENCES "cart" ("public_code") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cart_item_specific_item_id_fkey" FOREIGN KEY ("specific_item_id") REFERENCES "specific_item" ("specific_item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "location" (
    "location_id" TEXT NOT NULL PRIMARY KEY,
    "location_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "img_name" TEXT NOT NULL,
    "map_embed_url" TEXT
);

-- CreateTable
CREATE TABLE "emergency_bag_label" (
    "emergency_bag_label_id" TEXT NOT NULL PRIMARY KEY,
    "emergency_bag_label_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "emergency_bag" (
    "emergency_bag_id" TEXT NOT NULL PRIMARY KEY,
    "location_id" TEXT,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "bag_description" TEXT NOT NULL DEFAULT '',
    "expiry_date" DATETIME NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "emergency_bag_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location" ("location_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "emergency_bag_item" (
    "emergency_bag_id" TEXT NOT NULL,
    "specific_item_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    PRIMARY KEY ("specific_item_id", "emergency_bag_id"),
    CONSTRAINT "emergency_bag_item_emergency_bag_id_fkey" FOREIGN KEY ("emergency_bag_id") REFERENCES "emergency_bag" ("emergency_bag_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "emergency_bag_item_specific_item_id_fkey" FOREIGN KEY ("specific_item_id") REFERENCES "specific_item" ("specific_item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tutorial_group" (
    "tutorial_group_id" TEXT NOT NULL PRIMARY KEY,
    "tutorial_group_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "tutorial" (
    "tutorial_id" TEXT NOT NULL PRIMARY KEY,
    "tutorial_name" TEXT NOT NULL,
    "tutorial_group_id" TEXT NOT NULL,
    CONSTRAINT "tutorial_tutorial_group_id_fkey" FOREIGN KEY ("tutorial_group_id") REFERENCES "tutorial_group" ("tutorial_group_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tutorial_step" (
    "tutorial_step_id" TEXT NOT NULL PRIMARY KEY,
    "image_url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "step_ordering" INTEGER NOT NULL,
    "tutorial_id" TEXT NOT NULL,
    CONSTRAINT "tutorial_step_tutorial_id_fkey" FOREIGN KEY ("tutorial_id") REFERENCES "tutorial" ("tutorial_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "announcement" (
    "announcement_id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dashboard_link" (
    "dashboard_link_id" TEXT NOT NULL PRIMARY KEY,
    "display_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "dashboard_role_page" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "audit_log" (
    "audit_log_id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "user_id" TEXT,
    CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("user_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "completed_inventory_intake_session" (
    "completed_inventory_intake_session_id" TEXT NOT NULL PRIMARY KEY,
    "inventory_intake_session_name" TEXT NOT NULL,
    "intake_date" DATETIME NOT NULL,
    "completed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT NOT NULL DEFAULT '',
    "source_id" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "source_metadata" JSONB,
    CONSTRAINT "completed_inventory_intake_session_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "source" ("source_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "completed_inventory_intake_session_item" (
    "completed_inventory_intake_session_id" TEXT NOT NULL,
    "specific_item_id" TEXT NOT NULL,
    "amount_changed" INTEGER NOT NULL,

    PRIMARY KEY ("completed_inventory_intake_session_id", "specific_item_id"),
    CONSTRAINT "completed_inventory_intake_session_item_completed_inventory_intake_session_id_fkey" FOREIGN KEY ("completed_inventory_intake_session_id") REFERENCES "completed_inventory_intake_session" ("completed_inventory_intake_session_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "completed_inventory_intake_session_item_specific_item_id_fkey" FOREIGN KEY ("specific_item_id") REFERENCES "specific_item" ("specific_item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order" (
    "order_id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "cart_created_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order_item" (
    "order_id" TEXT NOT NULL,
    "specific_item_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    PRIMARY KEY ("specific_item_id", "order_id"),
    CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order" ("order_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_item_specific_item_id_fkey" FOREIGN KEY ("specific_item_id") REFERENCES "specific_item" ("specific_item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "issued_emergency_bag" (
    "issued_emergency_bag_id" TEXT NOT NULL PRIMARY KEY,
    "location_id" TEXT,
    "private" BOOLEAN NOT NULL,
    "bag_description" TEXT NOT NULL DEFAULT '',
    "expiry_date" DATETIME NOT NULL,
    "label" TEXT NOT NULL,
    "issued_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "issued_emergency_bag_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location" ("location_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "issued_emergency_bag_item" (
    "issued_emergency_bag_id" TEXT NOT NULL,
    "specific_item_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    PRIMARY KEY ("specific_item_id", "issued_emergency_bag_id"),
    CONSTRAINT "issued_emergency_bag_item_issued_emergency_bag_id_fkey" FOREIGN KEY ("issued_emergency_bag_id") REFERENCES "issued_emergency_bag" ("issued_emergency_bag_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "issued_emergency_bag_item_specific_item_id_fkey" FOREIGN KEY ("specific_item_id") REFERENCES "specific_item" ("specific_item_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ItemLabelToSpecificItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_ItemLabelToSpecificItem_A_fkey" FOREIGN KEY ("A") REFERENCES "item_label" ("item_label_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ItemLabelToSpecificItem_B_fkey" FOREIGN KEY ("B") REFERENCES "specific_item" ("specific_item_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EmergencyBagLabelToIssuedEmergencyBag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EmergencyBagLabelToIssuedEmergencyBag_A_fkey" FOREIGN KEY ("A") REFERENCES "emergency_bag_label" ("emergency_bag_label_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EmergencyBagLabelToIssuedEmergencyBag_B_fkey" FOREIGN KEY ("B") REFERENCES "issued_emergency_bag" ("issued_emergency_bag_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EmergencyBagToEmergencyBagLabel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EmergencyBagToEmergencyBagLabel_A_fkey" FOREIGN KEY ("A") REFERENCES "emergency_bag" ("emergency_bag_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EmergencyBagToEmergencyBagLabel_B_fkey" FOREIGN KEY ("B") REFERENCES "emergency_bag_label" ("emergency_bag_label_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_session_public_code_key" ON "user_session"("public_code");

-- CreateIndex
CREATE UNIQUE INDEX "category_category_name_key" ON "category"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "item_item_name_key" ON "item"("item_name");

-- CreateIndex
CREATE UNIQUE INDEX "item_label_item_label_name_key" ON "item_label"("item_label_name");

-- CreateIndex
CREATE UNIQUE INDEX "source_source_name_key" ON "source"("source_name");

-- CreateIndex
CREATE UNIQUE INDEX "location_location_name_key" ON "location"("location_name");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_bag_label_emergency_bag_label_name_key" ON "emergency_bag_label"("emergency_bag_label_name");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_bag_label_key" ON "emergency_bag"("label");

-- CreateIndex
CREATE UNIQUE INDEX "tutorial_group_tutorial_group_name_key" ON "tutorial_group"("tutorial_group_name");

-- CreateIndex
CREATE UNIQUE INDEX "_ItemLabelToSpecificItem_AB_unique" ON "_ItemLabelToSpecificItem"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemLabelToSpecificItem_B_index" ON "_ItemLabelToSpecificItem"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmergencyBagLabelToIssuedEmergencyBag_AB_unique" ON "_EmergencyBagLabelToIssuedEmergencyBag"("A", "B");

-- CreateIndex
CREATE INDEX "_EmergencyBagLabelToIssuedEmergencyBag_B_index" ON "_EmergencyBagLabelToIssuedEmergencyBag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmergencyBagToEmergencyBagLabel_AB_unique" ON "_EmergencyBagToEmergencyBagLabel"("A", "B");

-- CreateIndex
CREATE INDEX "_EmergencyBagToEmergencyBagLabel_B_index" ON "_EmergencyBagToEmergencyBagLabel"("B");
