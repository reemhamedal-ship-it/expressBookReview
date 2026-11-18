const express = require('express');
let books = require('./booksdb.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register customer."});
});

// Get the book list available in the shop using Promise / async-await
public_users.get('/',async function (req, res) {
  try {
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Get book details based on ISBN using Promise / async-await
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  try {
    let book = books[isbn];
    if (book) {
      return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching book details"});
  }
 });
  
// Get book details based on author using Promise / async-await
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  try {
    let booksbyauthor = [];
    let keys = Object.keys(books);
    keys.forEach((key) => {
      if(books[key].author === author) {
        booksbyauthor.push(books[key]);
      }
    });
    if(booksbyauthor.length > 0) {
      return res.status(200).send(JSON.stringify(booksbyauthor, null, 4));
    } else {
      return res.status(404).json({message: "Author not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by author"});
  }
});

// Get all books based on title using Promise / async-await
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
  try {
    let booksbytitle = [];
    let keys = Object.keys(books);
    keys.forEach((key) => {
      if(books[key].title === title) {
        booksbytitle.push(books[key]);
      }
    });
    if(booksbytitle.length > 0) {
      return res.status(200).send(JSON.stringify(booksbytitle, null, 4));
    } else {
      return res.status(404).json({message: "Title not found"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
