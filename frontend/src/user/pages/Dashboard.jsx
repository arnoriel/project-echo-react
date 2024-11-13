import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../static/styles.css'; 

function Dashboard() {
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:8080/api/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setMessage(response.data.message))
        .catch(error => {
            alert("Access denied");
            navigate("/login");
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate("/login");
    };

    return (
        <div className="container">
            <h2>Dashboard</h2>
            <p>{message}</p>
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
}

export default Dashboard;
