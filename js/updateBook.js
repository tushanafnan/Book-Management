document.addEventListener('DOMContentLoaded', function() {
    const firebaseConfig = {
        apiKey: "AIzaSyCAsZtIPC6nO-Xrz5_KY2Po9TLjxcJWzz4",
        authDomain: "book-db1db.firebaseapp.com",
        databaseURL: "https://book-db1db-default-rtdb.firebaseio.com",
        projectId: "book-db1db",
        storageBucket: "book-db1db.appspot.com",
        messagingSenderId: "515452822298",
        appId: "1:515452822298:web:339fb7ccaae03e027442a3"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    // Get bookId from the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('bookId');

    // Fetch book details based on the bookId
    if (bookId) {
        const bookRef = db.ref('books').child(bookId);
        bookRef.once('value').then(snapshot => {
            const data = snapshot.val();
            if (data) {
                // Populate form fields with existing details
                document.getElementById('title').value = data.title || '';
                document.getElementById('author').value = data.author || '';
                document.getElementById('description').value = data.description || '';
                document.getElementById('image').value = data.img || '';
            }
        });
    }

    // Handle form submission for updating the book
    document.getElementById('updateBookForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Retrieve updated details from the form fields
        const updatedTitle = document.getElementById('title').value;
        const updatedAuthor = document.getElementById('author').value;
        const updatedDescription = document.getElementById('description').value;
        const updatedImage = document.getElementById('image').value;

        // Update the book details in the database
        db.ref('books').child(bookId).update({
            title: updatedTitle,
            author: updatedAuthor,
            description: updatedDescription,
            img: updatedImage
        });

        // Show alert
        alert('Book updated successfully!');

        // Redirect back to dashboard.html
        window.location.href = 'https://bookstoremanagements.netlify.app/component/dashboard.html';
    });
});