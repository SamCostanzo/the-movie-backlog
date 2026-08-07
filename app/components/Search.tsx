"use client";
import { useState } from "react";

export default function Search({ onSearch, initialQuery = "" }: { onSearch: (value: string) => void; initialQuery?: string }) {
  const [draftText, setDraftText] = useState(initialQuery);

  function handleSubmit() {
    onSearch(draftText);
  }

  function handleClear() {
    setDraftText("");
    onSearch("");
  }

  return (
    <div className="flex items-center gap-2 min-w-md bg-white border-2 border-ink rounded-full py-1 pl-5 pr-[.25em]">
      {draftText && (
        <button onClick={handleClear} className="text-mute hover:text-brand cursor-pointer">
          x
        </button>
      )}
      <input
        id="movie-search"
        value={draftText}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        onChange={(e) => setDraftText(e.target.value)}
        placeholder="Find a movie"
        className="flex-1 bg-transparent outline-none text-ink placeholder:text-muted text-sm font-body"
      />

      <button onClick={handleSubmit} className="bg-brand hover:bg-ink duration-300 text-background rounded-full px-5 py-2 uppercase text-xs tracking-wider font-body cursor-pointer">
        Find
      </button>
    </div>
  );
}
