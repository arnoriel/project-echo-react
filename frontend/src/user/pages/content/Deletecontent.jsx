import axios from 'axios';

function DeleteContent({ match }) {
    const contentId = match.params.id;

    const handleDelete = () => {
        axios.delete(`http://localhost:8080/api/contents/${contentId}`)
            .then(() => {
                alert("Content deleted successfully");
                window.location.href = "/contents";
            })
            .catch(error => alert("Failed to delete content"));
    };

    return (
        <div>
            <h2>Are you sure you want to delete this content?</h2>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={() => window.location.href = "/contents"}>Cancel</button>
        </div>
    );
}

export default DeleteContent;
