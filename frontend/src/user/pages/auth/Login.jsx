// src\user\auth\Login.jsx
import { useState } from 'react';
import axios from 'axios';
import '../../static/styles.css'; 

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        axios.post('http://localhost:8080/api/login', { username, password })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                window.location.href = "/dashboard";
            })
            .catch(error => alert("Login failed"));
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
