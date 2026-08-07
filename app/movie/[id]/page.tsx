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
      orderBy: { name: "asc" },
    });
  }

  // Trailer fetch
  const videoRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const videoData = await videoRes.json();
  const trailer = videoData.results.find((video: Video) => video.site === "YouTube" && video.type === "Trailer");

  // Credits fetch
  const creditsRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const creditsData = await creditsRes.json();

  const director = creditsData.crew.find((person: { job: string }) => person.job === "Director");
  const topCast = creditsData.cast.slice(0, 6);
  const studio = movie.production_companies?.[0];

  return (
    <>
      {movie.backdrop_path && (
        <div className="relative w-full h-[40vh] md:h-[40vh] mb-[-6rem]">
          <img src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      )}
      <Container>
        <div className={`relative flex flex-col md:flex-row gap-8 mb-16 ${movie.backdrop_path ? "" : "pt-16"}`}>
          {/* LEFT: Poster */}
          <div className="md:w-1/3 shrink-0">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.title} poster`} className="w-full rounded-xl border-2 border-ink" />
          </div>

          {/* RIGHT: Details */}
          <div className="md:w-2/3">
            <h1 className="font-display text-5xl text-ink mb-3">{movie.title}</h1>

            {movie.tagline && <p className="text-brand italic text-lg mb-4">"{movie.tagline}"</p>}

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="flex items-center justify-center bg-ink text-marigold font-bold text-xs px-4 py-1.5 rounded-full">★ {movie.vote_average?.toFixed(1)}</span>
              <span className="flex items-center justify-center border-2 border-ink text-ink text-xs px-4 py-1.5 rounded-full">{movie.release_date?.slice(0, 4)}</span>
              <span className="flex items-center justify-center border-2 border-ink text-ink text-xs px-4 py-1.5 rounded-full">{movie.runtime} min</span>
              {movie.genres?.slice(0, 2).map((genre: Genre) => (
                <span key={genre.id} className="flex items-center justify-center border-2 border-ink text-ink text-xs px-4 py-1.5 rounded-full">
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="font-body text-ink my-6 leading-relaxed">{movie.overview}</p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 items-center">
              {session && userLists.length > 0 && <AddToListForm movieId={movie.id} userLists={userLists} />}

              <div className="mt-8 space-y-3 text-sm">
                {director && (
                  <p>
                    <span className="text-muted font-body uppercase tracking-wide text-xs">Director</span> <span className="text-ink font-body">{director.name}</span>
                  </p>
                )}

                {studio && (
                  <p>
                    <span className="text-muted font-body uppercase tracking-wide text-xs">Studio</span> <span className="text-ink font-body">{studio.name}</span>
                  </p>
                )}

                {topCast.length > 0 && (
                  <p>
                    <span className="text-muted font-body uppercase tracking-wide text-xs">Cast</span>{" "}
                    <span className="text-ink font-body">{topCast.map((actor: { name: string }) => actor.name).join(", ")}</span>
                  </p>
                )}
              </div>
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
    </>
  );
}
