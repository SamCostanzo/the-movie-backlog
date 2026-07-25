import Container from "@/app/components/Container";
import { Video, Genre } from "@/app/types";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { addMovieToList } from "@/app/lib/actions";
import type { List } from "@/app/generated/prisma/client";
import AddToListForm from "@/app/components/AddToListForm";

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = process.env.TMDB_TOKEN;

  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const movie = await res.json();

  const session = await auth.api.getSession({ headers: await headers() });

  let userLists: List[] = [];
  if (session) {
    userLists = await prisma.list.findMany({
      where: { ownerId: session.user.id },
    });
  }

  const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const videoData = await videoRes.json();

  const trailer = videoData.results.find((video: Video) => video.site === "YouTube" && video.type === "Trailer");

  return (
    <Container>
      <div className="flex flex-col md:flex-row gap-8 pt-16 mb-16">
        {/* LEFT: Poster */}
        <div className="md:w-1/3 shrink-0">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.title} poster`} className="w-full rounded-xl border-2 border-ink" />
        </div>

        {/* RIGHT: Details */}
        <div className="md:w-2/3">
          <h1 className="font-display text-5xl text-ink mb-3">{movie.title}</h1>

          {movie.tagline && <p className="text-brand italic text-lg mb-4">"{movie.tagline}"</p>}

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="flex items-center justify-center bg-ink text-marigold font-bold text-sm px-4 py-1.5 rounded-full">★ {movie.vote_average?.toFixed(1)}</span>
            <span className="flex items-center justify-center border-2 border-ink text-ink text-sm px-4 py-1.5 rounded-full">{movie.release_date?.slice(0, 4)}</span>
            <span className="flex items-center justify-center border-2 border-ink text-ink text-sm px-4 py-1.5 rounded-full">{movie.runtime} min</span>
            {movie.genres?.slice(0, 2).map((genre: Genre) => (
              <span key={genre.id} className="flex items-center justify-center border-2 border-ink text-ink text-sm px-4 py-1.5 rounded-full">
                {genre.name}
              </span>
            ))}
          </div>

          <p className="font-body text-ink my-6 leading-relaxed">{movie.overview}</p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Primary — filled orange */}
            {/* <button className="bg-brand text-background rounded-full px-6 py-2.5 uppercase text-sm tracking-wider font-body hover:opacity-90 transition-opacity cursor-pointer">+ To Watch</button> */}

            {/* Secondary — outlined teal */}
            {/* <button className="border-2 border-ink text-ink rounded-full px-6 py-2.5 uppercase text-sm tracking-wider font-body hover:bg-ink hover:text-background transition-colors cursor-pointer">
              ✓ Watched
            </button> */}

            {session && userLists.length > 0 && <AddToListForm movieId={movie.id} userLists={userLists} />}
          </div>
        </div>
      </div>
      {trailer && (
        <div className="pb-16">
          <p className="text-brand uppercase tracking-[3px] text-sm mb-4">✦ Trailer ✦</p>
          <iframe src={`https://www.youtube.com/embed/${trailer.key}`} title="Trailer" allowFullScreen className="w-full aspect-video rounded-xl border-2 border-ink" />
        </div>
      )}
    </Container>
  );
}
