const bookService = require("../services/bookservice");

exports.createBook = async (req, res) => {
    try {
        const { title, author, description } = req.body;
        if (!title || !author) {
            return res.status(400).json({ message: "Title and author are required" });
        }
        const book = await bookService.createBook({
            userId: req.user._id,
            title,
            author,
            subtitle,
            chapters,
        });
        res.status(201).json(book);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
// @route GET /api/books
//  @desc Get all books
// @access Private
const getBooks = async (req, res) => {
    try {
        const books = await bookService.getBooks({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

}
// @route GET /api/books/:id
//  @desc Get book by id
// @access Private
const getBookById = async (req, res) => {
    try {
        const book = await bookService.getBookById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (book.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to access this book" });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

}   
// @route PUT /api/books/:id
//  @desc Update book by id
// @access Private
const updateBook = async (req, res) => {   
    try {
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    } 
}
// @route DELETE /api/books/:id
//  @desc Delete book by id
// @access Private
const deleteBook = async (req, res) => {
    try {
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

}
// @route POST /api/books/:id/cover
//  @desc Update book cover image
// @access Private
const updateBookCover = async (req, res) => {
    try {
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

}
module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    updateBookCover,
};

    
