export type Movie = {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
};

export type Video = {
  site: string;
  type: string;
  key: string;
};

export type Genre = {
  id: number;
  name: string;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};
