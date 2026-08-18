-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TutorialPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "groupID" TEXT NOT NULL,
    CONSTRAINT "TutorialPage_groupID_fkey" FOREIGN KEY ("groupID") REFERENCES "tutorial_group" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TutorialPage" ("groupID", "id", "name") SELECT "groupID", "id", "name" FROM "TutorialPage";
DROP TABLE "TutorialPage";
ALTER TABLE "new_TutorialPage" RENAME TO "TutorialPage";
CREATE TABLE "new_TutorialStep" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageURL" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pageID" TEXT NOT NULL,
    CONSTRAINT "TutorialStep_pageID_fkey" FOREIGN KEY ("pageID") REFERENCES "TutorialPage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TutorialStep" ("description", "id", "imageURL", "pageID") SELECT "description", "id", "imageURL", "pageID" FROM "TutorialStep";
DROP TABLE "TutorialStep";
ALTER TABLE "new_TutorialStep" RENAME TO "TutorialStep";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
