import { useState } from 'react';
import axios from 'axios';
import '../../static/styles.css'; 

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        axios.post('http://localhost:8080/api/register', { username, password })
            .then(response => alert("Registration successful"))
            .catch(error => alert("Registration failed"));
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}

export default Register;
