import Link from "next/link";
import { Movie } from "../types";
import { buildMovieSlug } from "../lib/slug";

export default function MovieCard({ movie }: { movie: Movie }) {
  const slug = buildMovieSlug(movie.id, movie.title, movie.release_date);
  return (
    <Link href={`/movie/${slug}`}>
      <article key={movie.id} className="h-full bg-ink rounded-lg overflow-hidden group">
        <div className="relative overflow-hidden aspect-[2/3]">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} poster`}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-teal flex items-center justify-center">
              <img src="/icon.png" alt={`${movie.title} poster unavailable`} className="w-1/3 h-1/3 object-contain opacity-90" />
            </div>
          )}
          <span className="absolute top-2 right-2 bg-marigold text-ink text-xs font-bold px-2 py-0.5 rounded-full">{movie.vote_average.toFixed(1)}</span>
        </div>

        <div className="p-3">
          <h3 className="font-display text-text-invert text-base leading-tight">{movie.title}</h3>
          <p className="font-body text-muted-invert text-sm mt-1">{movie.release_date?.slice(0, 4)}</p>
        </div>
      </article>
    </Link>
  );
}
