// frontend/src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './user/pages/auth/Login';
import Register from './user/pages/auth/Register';
import Dashboard from './user/pages/Dashboard';
import AddContent from './user/pages/content/Addcontent';
import ShowContent from './user/pages/content/Showcontent';
import EditContent from './user/pages/content/Editcontent';
import DeleteContent from './user/pages/content/Deletecontent';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contents" element={<ShowContent />} />
                <Route path="/addcontent" element={<AddContent />} />
                <Route path="/editcontent/:id" element={<EditContent />} />
                <Route path="/deletecontent/:id" element={<DeleteContent />} />
            </Routes>
        </Router>
    );
}

export default App;
