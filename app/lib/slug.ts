export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[':]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildMovieSlug(id: number, title: string, releaseDate?: string | null): string {
  const year = releaseDate?.slice(0, 4);
  const slug = slugify(title);
  return year ? `${id}-${slug}-${year}` : `${id}-${slug}`;
}
