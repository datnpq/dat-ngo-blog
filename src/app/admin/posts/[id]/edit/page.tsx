import { getPostById } from "@/db/posts";
import { PostEditor } from "@/components/admin/PostEditor";
import { notFound } from "next/navigation";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) notFound();

  return <PostEditor post={post} />;
}
