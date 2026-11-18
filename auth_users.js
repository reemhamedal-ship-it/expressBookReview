const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Returns true if the username is not already taken
const isValid = (username) => {
  return !users.some((user) => user.username === username);
};

// Returns true if username/password match a registered user
const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

// Login (registered users only)
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("Customer successfully logged in");
  }
  return res.status(208).json({ message: "Invalid Login. Check username and password" });
});

// Add or modify a book review (the review comes as a query parameter)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({
    message: `The review for the book with ISBN ${isbn} has been added/updated.`,
    reviews: books[isbn].reviews,
  });
});

// Delete the logged-in user's own review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review by this user for this book" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({
    message: `Review for the ISBN ${isbn} posted by the user ${username} deleted.`,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
