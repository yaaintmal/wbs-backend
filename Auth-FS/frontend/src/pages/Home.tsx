import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getPosts } from '@/data';
import { PostCard, PostsSkeleton } from '@/components';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  const refetch = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  useEffect(() => {
    refetch().finally(() => setLoading(false));
  }, []);

  if (loading) return <PostsSkeleton />;
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 '>
      {posts.map((post) => (
        <PostCard key={post._id} _id={post._id} content={post.content} image={post.image} title={post.title} author={post.author} onUpdate={refetch} />
      ))}
    </div>
  );
};

export default Home;
