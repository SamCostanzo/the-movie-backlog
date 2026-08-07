"use client";
import { useState, useEffect } from "react";
import { Movie } from "../types";
import Search from "./Search";
import MovieCard from "./MovieCard";
import { useSearchParams, useRouter } from "next/navigation";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

type Genre = { id: number; name: string };

export default function MovieList({ movies, genres }: { movies: Movie[]; genres: Genre[] }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("title") ?? "";
  const year = searchParams.get("year") ?? "";
  const genre = searchParams.get("genre") ?? "";
  const router = useRouter();

  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim() && !year && !genre) {
      setResults([]);
      return;
    }

    let cancelled = false;

    async function runSearch() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (year) params.set("year", year);
        if (genre) params.set("genre", genre);

        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        if (!cancelled) setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [query, year, genre]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  }

  const hasSearched = query.trim().length > 0 || year.length > 0 || genre.length > 0;
  const moviesToShow = hasSearched ? results : movies;

  return (
    <div className="py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Search onSearch={(value) => updateParam("title", value)} initialQuery={query} />

        <select
          id="select-year"
          value={year}
          onChange={(e) => updateParam("year", e.target.value)}
          className="bg-white border-2 border-ink rounded-full py-[0.72em] px-5 text-sm text-ink font-body outline-none cursor-pointer"
        >
          <option value="">Any year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <select
          id="select-genre"
          value={genre}
          onChange={(e) => updateParam("genre", e.target.value)}
          className="bg-white border-2 border-ink rounded-full py-[0.72em] px-5 text-sm text-ink font-body outline-none cursor-pointer"
        >
          <option value="">Any genre</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-muted font-body">Searching...</p>
      ) : hasSearched && moviesToShow.length === 0 ? (
        <p className="text-center text-muted font-body">No movies found. Try another search.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {moviesToShow.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
