ALTER TABLE "posts" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
CREATE OR REPLACE FUNCTION increment_post_views(p_slug text)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE posts SET views = views + 1 WHERE slug = p_slug AND status = 'published';
$$;