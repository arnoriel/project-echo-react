import { useEffect, useState } from 'react';
import axios from 'axios';

function ShowContent() {
    const [contents, setContents] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/contents')
            .then(response => setContents(response.data))
            .catch(error => alert("Failed to fetch contents"));
    }, []);

    return (
        <div>
            <h2>Content List</h2>
            {contents.map(content => (
                <div key={content.id}>
                    <h3>{content.title}</h3>
                    <p>{content.description}</p>
                    <button onClick={() => window.location.href = `/editcontent/${content.id}`}>Edit</button>
                    <button onClick={() => window.location.href = `/deletecontent/${content.id}`}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default ShowContent;
