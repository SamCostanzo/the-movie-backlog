import Container from "./components/Container";
import MovieList from "./components/MovieList";
import { Movie } from "./types";

export default async function Home() {
  const res = await fetch("https://api.themoviedb.org/3/movie/popular", {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  const data = await res.json();
  const movies = data.results;

  return (
    <Container>
      <div className="text-center my-6">
        <p className="text-brand uppercase tracking-[3px] text-sm mb-2">✦ Now Showing ✦</p>
        <h2 className="font-display text-4xl text-ink">Popular This Week</h2>
      </div>
      <MovieList movies={movies} />
    </Container>
  );
}
