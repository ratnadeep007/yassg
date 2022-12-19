-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PageData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brand" TEXT NOT NULL,
    "menus" TEXT NOT NULL,
    "path" TEXT NOT NULL DEFAULT '/'
);
INSERT INTO "new_PageData" ("brand", "id", "menus") SELECT "brand", "id", "menus" FROM "PageData";
DROP TABLE "PageData";
ALTER TABLE "new_PageData" RENAME TO "PageData";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
