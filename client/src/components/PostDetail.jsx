import { useEffect, useState } from 'react';
import { getPost } from "../utils/api";
import { useParams } from 'react-router-dom';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPost(id)
      .then(setPost)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p><b>Category:</b> {post.category}</p>
      <p>{post.content}</p>
      <p style={{ color: '#888' }}>By: {post.author}</p>
    </div>
  );
}
