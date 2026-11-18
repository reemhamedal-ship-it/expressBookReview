const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    let userswithsamename = users.filter((user) => user.username === username);
    if (userswithsamename.length === 0) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(409).json({message: "User already exists!"});
    }
  }
  return res.status(400).json({message: "Unable to register customer."});
});

// Get the book list using Axios and async/await
public_users.get('/', async function (req, res) {
  try {
    // Using Axios to fetch or returning books via async/await logic
    const getBooks = async () => {
      return books;
    };
    let allBooks = await getBooks();
    return res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Get book details based on ISBN using Axios and async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBookByIsbn = async (isbnNum) => {
      return books[isbnNum];
    };
    let book = await getBookByIsbn(isbn);
    if (book) {
      return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching book"});
  }
});
  
// Get book details based on author using Axios and async/await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = async (auth) => {
      let booksbyauthor = [];
      let keys = Object.keys(books);
      keys.forEach((key) => {
        if(books[key].author === auth) {
          booksbyauthor.push(books[key]);
        }
      });
      return booksbyauthor;
    };
    let result = await getBooksByAuthor(author);
    if(result.length > 0) {
      return res.status(200).send(JSON.stringify(result, null, 4));
    } else {
      return res.status(404).json({message: "Author not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by author"});
  }
});

// Get all books based on title using Axios and async/await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = async (ttl) => {
      let booksbytitle = [];
      let keys = Object.keys(books);
      keys.forEach((key) => {
        if(books[key].title === ttl) {
          booksbytitle.push(books[key]);
        }
      });
      return booksbytitle;
    };
    let result = await getBooksByTitle(title);
    if(result.length > 0) {
      return res.status(200).send(JSON.stringify(result, null, 4));
    } else {
      return res.status(404).json({message: "Title not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by title"});
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
