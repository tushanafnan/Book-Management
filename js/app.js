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
    console.log(db);
    const bookList = document.getElementById('bookList');
    db.ref('books').on('value', snapshot => {
        bookList.innerHTML = '';
        snapshot.forEach(childSnapshot => {
            const data = childSnapshot.val();
            if (data) {
                const bookKey = childSnapshot.key;
                const imageStyle = "width: 100%; height: auto; max-height: 200px;";
                bookList.innerHTML += `
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="${data.img || ''}" alt="${data.title || ''}" class="img-fluid custom-image" style="${imageStyle}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${data.title || ''}</h5>
                                    <p class="card-text"><strong>Author:</strong> ${data.author || ''}</p>
                                    <p class="card-text"><strong>Description:</strong> ${data.description || ''}</p>
                                    
                                    <div class="d-flex justify-content-between align-items-center">
                                        <a href="/component/updateBook.html?bookId=${bookKey}" class="btn btn-warning btn-sm">Update</a>
                                        <button class="btn btn-danger btn-sm" data-book-id="${bookKey}">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }









        });

        // Add event listeners for dynamically created delete buttons
        const deleteButtons = document.querySelectorAll('.btn-danger');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookId = this.getAttribute('data-book-id');
                deleteBook(bookId);
            });
        });
    });

    function deleteBook(bookId) {
        if (confirm("Are you sure you want to delete this book?")) {
            // Use the bookId to delete the book from the database
            db.ref('books').child(bookId).remove();

            // Show alert
            alert('Book deleted successfully!');
        }
    }

    // Form submission for adding a new book
    document.getElementById('addBookForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const description = document.getElementById('description').value;
        const image = document.getElementById('image').value;

        // Get the latest book ID from the database
        db.ref('latestBookId').once('value').then(snapshot => {
            let latestBookId = snapshot.val() || 0;

            // Increment the book ID for the new book
            const newBookId = ++latestBookId;

            // Add the book to the Realtime Database with the incremented ID
            db.ref('books').child(newBookId).set({
                title: title,
                author: author,
                description: description,
                image: image
            });

            // Update the latest book ID in the database
            db.ref('latestBookId').set(newBookId);

            // Clear the form fields
            document.getElementById('addBookForm').reset();

            // Show alert
            alert('Book added successfully!');

            // Redirect to dashboard.html// Redirect to dashboard.html in the root folder
            window.location.href = 'https://bookstoremanagements.netlify.app/component/dashboard.html';

        });
    });



});