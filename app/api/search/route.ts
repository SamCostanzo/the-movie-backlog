export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const year = searchParams.get("year");
  const genre = searchParams.get("genre");

  const token = process.env.TMDB_TOKEN;

  if (!query && !year && !genre) {
    return Response.json([]);
  }

  if (query) {
    const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    let results = data.results;

    if (year) {
      results = results.filter((movie: { release_date?: string }) => movie.release_date?.slice(0, 4) === year);
    }
    if (genre) {
      results = results.filter((movie: { genre_ids?: number[] }) => movie.genre_ids?.includes(Number(genre)));
    }

    return Response.json(results);
  }

  const discoverUrl = new URL("https://api.themoviedb.org/3/discover/movie");
  if (year) discoverUrl.searchParams.set("primary_release_year", year);
  if (genre) discoverUrl.searchParams.set("with_genres", genre);

  const res = await fetch(discoverUrl.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return Response.json(data.results);
}
