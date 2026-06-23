export type PostStatus = "draft" | "published";
export type PostLanguage = "vi" | "en";

export interface Post {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  tags: string[];
  featuredImageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  language: PostLanguage;
  status: PostStatus;
  views: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  tags: string[];
  featuredImageUrl: string | null;
  language: PostLanguage;
  publishedAt: Date;
  readingTimeMinutes: number;
  views: number;
}

export interface CreatePostInput {
  title: string;
  slug: string;
  body: string;
  excerpt?: string;
  tags?: string[];
  featuredImageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  language?: PostLanguage;
  status?: PostStatus;
  publishedAt?: Date | null;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {}
