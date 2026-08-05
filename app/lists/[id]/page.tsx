import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import Container from "@/app/components/Container";
import MovieCard from "@/app/components/MovieCard";
import { removeMovieFromList } from "@/app/lib/actions";
import Breadcrumb from "@/app/components/Breadcrumb";

export default async function SingleListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  // Fetch the list AND its items in one query
  const list = await prisma.list.findUnique({
    where: { id },
    include: { items: true },
  });

  // Not found, or not yours
  if (!list || list.ownerId !== session.user.id) {
    notFound();
  }

  // Fetch each movie's details from TMDB
  const token = process.env.TMDB_TOKEN;
  const movies = await Promise.all(
    list.items.map(async (item) => {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${item.movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const movie = await res.json();
      return { ...movie, watched: item.watched, itemId: item.id };
    }),
  );

  return (
    <Container>
      <div className="pt-16 mb-16">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Lists", href: "/lists" }, { label: list.name }]} />
        <h1 className="font-display text-3xl mb-6">{list.name}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <div key={movie.itemId} className="flex flex-col gap-2">
              <MovieCard key={movie.id} movie={movie} />
              <form action={removeMovieFromList} className="text-center">
                <input type="hidden" name="itemId" value={movie.itemId} />
                <button type="submit" className="text-brand text-xs uppercase tracking-wide hover:opacity-70 cursor-pointer">
                  Remove
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
