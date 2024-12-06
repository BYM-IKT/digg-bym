export enum PostType {
  Artikkel = 1,
  Reisebrev = 2,
  Matspalten = 3,
  Leder = 4,
  Musikkanmeldelse = 5,
}

export interface Frontmatter {
  type: PostType;
  draft?: boolean;
  title: string;
  author: string;
  publishedAt: string;
  summary: string;
  image: {
    url: string;
    alt: string;
    height?: string;
  };
  elementsPerRow?: number;
}

export interface ArtikkelFrontmatter extends Frontmatter {
  severity: "low" | "medium" | "high";
}

export interface ReisebrevFrontmatter extends Frontmatter {
  destination: string;
}

export interface MatspaltenFrontmatter extends Frontmatter {}

export interface LederFrontmatter extends Frontmatter {}

export interface MusikkanmeldelseFrontmatter extends Frontmatter {}
