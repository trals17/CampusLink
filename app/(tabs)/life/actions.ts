import db from '@/lib/db';
import { unstable_cache as nextCache, revalidateTag } from 'next/cache';

export async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      created_at: true,
      _count: {
        select: {
          Comments: true,
          Like: true,
        },
      },
    },
  });
  return posts;
}

export const getCachedPosts = nextCache(getPosts, ['posts-list'], {
  tags: ['posts-list'],
});
