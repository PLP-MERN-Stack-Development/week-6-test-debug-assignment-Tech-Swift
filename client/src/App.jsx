import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from "./context/AuthContext";
import ErrorBoundary from './components/ErrorBoundary';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import './index.css';

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav style={{ marginBottom: 20 }}>
      <Link to="/">Posts</Link>
      {user ? (
        <>
          {' '}| <Link to="/create">Create Post</Link>
          {' '}| <span style={{ color: '#666', marginRight: 8 }}>Hi, {user.username}</span>
          <button onClick={() => { logout(); navigate('/'); }} style={{ cursor: 'pointer', marginLeft: 8 }}>Logout</button>
        </>
      ) : (
        <>
          {' '}| <Link to="/login">Login</Link>
          {' '}| <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

function AppRoutes() {
  const { token } = useAuth();
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login onLogin={() => window.location = '/'} />} />
        <Route path="/register" element={<Register onRegister={() => window.location = '/login'} />} />
        <Route path="/create" element={token ? <CreatePost token={token} onCreated={() => window.location = '/'} /> : <Navigate to="/login" />} />
        <Route path="*" element={<p>Not found</p>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
