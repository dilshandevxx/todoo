import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const API_URL = 'http://localhost:5001/api';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
        <button type="submit">Sign In</button>
      </form>
      <p className="switch-auth">Don't have an account? <span onClick={() => navigate('/register')}>Register</span></p>
    </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/register`, { username, password });
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'var(--accent)', marginBottom: '1rem' }}>{success}</p>}
        <button type="submit">Register</button>
      </form>
      <p className="switch-auth">Already have an account? <span onClick={() => navigate('/login')}>Sign In</span></p>
    </div>
  );
};

const Dashboard = ({ token, setToken }) => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!task) return;
    try {
      const res = await axios.post(`${API_URL}/todos`, { task }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos([res.data, ...todos]);
      setTask('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/todos/${id}`, { completed: !completed }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.map(t => t.id === id ? { ...t, completed: !completed } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="todo-container">
      <div className="header-actions">
        <h1>{user.username}'s Tasks</h1>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
      
      <form onSubmit={addTask} className="todo-input-group">
        <input 
          type="text" 
          placeholder="What needs to be done?" 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
        />
        <button type="submit" style={{ width: 'auto', padding: '0 1.5rem' }}>Add</button>
      </form>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <button 
              className={`check-btn ${todo.completed ? 'completed' : ''}`} 
              onClick={() => toggleComplete(todo.id, todo.completed)}
            >
              {todo.completed && '✓'}
            </button>
            <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
              {todo.task}
            </span>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={token ? <Dashboard token={token} setToken={setToken} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
