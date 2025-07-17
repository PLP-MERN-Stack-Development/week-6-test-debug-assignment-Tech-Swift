import { useState } from 'react';
import { createPost } from '../utils/api';

const CATEGORY_OPTIONS = ['tech', 'news', 'tutorial', 'opinion', 'random'];

export default function CreatePost({ token, onCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createPost({ title, content, category }, token);
      setTitle('');
      setContent('');
      setCategory(CATEGORY_OPTIONS[0]);
      onCreated();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Post</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        {CATEGORY_OPTIONS.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <button type="submit">Create</button>
    </form>
  );
}
