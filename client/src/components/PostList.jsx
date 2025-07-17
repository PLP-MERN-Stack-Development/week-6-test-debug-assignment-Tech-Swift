import { useEffect, useState } from 'react';
import { getPosts } from "../utils/api";
import { Link } from 'react-router-dom';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>All Posts</h2>
      <ul>
        {posts.length === 0 && <li>No posts found.</li>}
        {posts.map(post => (
          <li key={post._id}>
            <Link to={`/posts/${post._id}`} data-testid="post-title">{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
