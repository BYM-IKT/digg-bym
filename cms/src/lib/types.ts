export type MetadataProps = {
  title: string;
  slug: string;
  author: string;
  summary?: string;
  publishedAt?: string;
  mainImageUrl?: string;
  mainImageCaption?: string;
  draft?: boolean;
  /*   snippetWithStringArgument: Snippet<[string]>;
  eventHandler: (arg: string) => void;
  [key: string]: unknown; */
};

export type PostDto = {
  key: string;
  base64: string;
};
