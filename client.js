// Client calls using axios (Promises and async/await) against the running server.
// Run the server first (node index.js), then: node client.js
const axios = require('axios');
const BASE = 'http://localhost:5000';

// Task 10: get all books (async/await)
async function getAllBooks() {
  const response = await axios.get(`${BASE}/`);
  console.log('All books:', response.data);
}

// Task 11: get book by ISBN (Promise callbacks)
function getBookByISBN(isbn) {
  return axios.get(`${BASE}/isbn/${isbn}`)
    .then((response) => console.log(`Book ${isbn}:`, response.data))
    .catch((err) => console.error('Error:', err.response ? err.response.data : err.message));
}

// Task 12: get books by author
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`${BASE}/author/${encodeURIComponent(author)}`);
    console.log(`Books by ${author}:`, response.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

// Task 13: get books by title
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`${BASE}/title/${encodeURIComponent(title)}`);
    console.log(`Books titled ${title}:`, response.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

(async () => {
  await getAllBooks();
  await getBookByISBN(1);
  await getBooksByAuthor('Jane Austen');
  await getBooksByTitle('Pride and Prejudice');
})();
