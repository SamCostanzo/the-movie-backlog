import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createList } from "@/app/lib/actions";
import { renameList } from "@/app/lib/actions";
import { deleteList } from "@/app/lib/actions";
import { prisma } from "@/app/lib/prisma";
import Container from "../components/Container";
import ListCard from "@/app/components/ListCard";
import Link from "next/link";
import Breadcrumb from "@/app/components/Breadcrumb";

export default async function ListsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }

  // Fetch THIS users lists!
  const lists = await prisma.list.findMany({
    where: { ownerId: session.user.id },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { items: true },
      },
    },
  });

  return (
    <Container>
      <div className="pt-16 mb-16">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Lists" }]} />

        {/* Flourish header */}
        <div className="text-center my-6">
          <p className="text-brand uppercase tracking-[3px] text-sm mb-2">✦ Your Collection ✦</p>
          <h1 className="font-display text-4xl text-ink">My Lists</h1>
        </div>

        {/* Create form — styled as a pill, like your search bar */}
        <form action={createList} className="flex items-center gap-2 max-w-md mx-auto bg-white border-2 border-ink rounded-full py-2 pl-5 pr-2 mt-14 mb-8">
          <input id="create-list" name="name" placeholder="Make a new list" required className="flex-1 bg-transparent outline-none text-ink placeholder:text-muted font-body" />
          <button type="submit" className="bg-brand text-background rounded-full px-5 py-2 uppercase text-xs tracking-wider cursor-pointer">
            Create
          </button>
        </form>
        <div className="flex flex-col gap-3">{lists.length === 0 ? <p className="text-muted">No lists yet. Create one above!</p> : lists.map((list) => <ListCard key={list.id} list={list} />)}</div>
      </div>
    </Container>
  );
}
