import { useState } from 'react';
import axios from 'axios';

function AddContent() {
    const [title, setTitle] = useState('');
    const [images, setImages] = useState('');
    const [description, setDescription] = useState('');
    const [summary, setSummary] = useState('');

    const handleSubmit = () => {
        axios.post('http://localhost:8080/api/contents', { title, images, description, summary })
            .then(() => {
                alert("Content added successfully");
                window.location.href = "/contents";
            })
            .catch(error => alert("Failed to add content"));
    };

    return (
        <div>
            <h2>Add Content</h2>
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <input type="text" placeholder="Images URL" value={images} onChange={e => setImages(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            <textarea placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)}></textarea>
            <button onClick={handleSubmit}>Add Content</button>
        </div>
    );
}

export default AddContent;
