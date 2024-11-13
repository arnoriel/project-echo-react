import { useState, useEffect } from 'react';
import axios from 'axios';

function EditContent({ match }) {
    const contentId = match.params.id;
    const [title, setTitle] = useState('');
    const [images, setImages] = useState('');
    const [description, setDescription] = useState('');
    const [summary, setSummary] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:8080/api/contents/${contentId}`)
            .then(response => {
                const content = response.data;
                setTitle(content.title);
                setImages(content.images);
                setDescription(content.description);
                setSummary(content.summary);
            })
            .catch(error => alert("Failed to fetch content"));
    }, [contentId]);

    const handleUpdate = () => {
        axios.put(`http://localhost:8080/api/contents/${contentId}`, { title, images, description, summary })
            .then(() => alert("Content updated successfully"))
            .catch(error => alert("Failed to update content"));
    };

    return (
        <div>
            <h2>Edit Content</h2>
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <input type="text" placeholder="Images URL" value={images} onChange={e => setImages(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            <textarea placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)}></textarea>
            <button onClick={handleUpdate}>Update Content</button>
        </div>
    );
}

export default EditContent;
