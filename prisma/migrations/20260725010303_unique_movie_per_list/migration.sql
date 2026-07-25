/*
  Warnings:

  - A unique constraint covering the columns `[listId,movieId]` on the table `ListItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ListItem_listId_movieId_key" ON "ListItem"("listId", "movieId");
