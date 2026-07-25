"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

// CREATE LIST
export async function createList(formData: FormData) {
  // 1. Who's logged in?
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Not logged in");
  }

  // 2. Get the list name from the form
  const name = formData.get("name") as string;
  if (!name?.trim()) return;

  // 3. Create the list, owned by this user
  await prisma.list.create({
    data: {
      name: name.trim(),
      ownerId: session.user.id,
    },
  });

  // 4. Refresh the page so the new list shows
  revalidatePath("/lists");
}

// ADD MOVIE TO LIST
export async function addMovieToList(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Not logged in");
  }

  const listId = formData.get("listId") as string;
  const movieId = Number(formData.get("movieId"));

  if (!listId || !movieId) return;

  // Security: verify this list belongs to the logged-in user
  const list = await prisma.list.findUnique({
    where: { id: listId },
  });
  if (!list || list.ownerId !== session.user.id) {
    throw new Error("Not your list");
  }

  const existing = await prisma.listItem.findUnique({
    where: {
      listId_movieId: { listId, movieId }, // Prisma's name for the composite unique
    },
  });

  if (existing) {
    return { error: "Already in this list" };
  }

  await prisma.listItem.create({ data: { listId, movieId } });
  revalidatePath(`/movie/${movieId}`);
  return { success: true };
}

export async function renameList(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Not logged in");
  }

  const listId = formData.get("listId") as string;
  const name = formData.get("name") as string;

  if (!listId || !name?.trim()) return;

  // Verify ownership
  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list || list.ownerId !== session.user.id) {
    throw new Error("Not your list");
  }

  await prisma.list.update({
    where: { id: listId },
    data: { name: name.trim() },
  });

  revalidatePath("/lists");
}

export async function removeMovieFromList(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Not logged in");

  const itemId = formData.get("itemId") as string;

  // Verify ownership via the item's list
  const item = await prisma.listItem.findUnique({
    where: { id: itemId },
    include: { list: true },
  });
  if (!item || item.list.ownerId !== session.user.id) {
    throw new Error("Not allowed");
  }

  await prisma.listItem.delete({ where: { id: itemId } });
  revalidatePath(`/lists/${item.list.id}`);
}

export async function deleteList(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Not logged in");
  }

  const listId = formData.get("listId") as string;
  if (!listId) return;

  // Verify ownership
  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list || list.ownerId !== session.user.id) {
    throw new Error("Not your list");
  }

  await prisma.list.delete({
    where: { id: listId },
  });

  revalidatePath("/lists");
}
