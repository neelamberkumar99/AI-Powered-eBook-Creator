const express = require("express");
const riutes = express.Router();
const{
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
    updateBookCover,
} = require("../controllers/bookcontroller");
const { protect } = require("../middleware/authMiddleware");
const upload= require("../middleware/uploadMiddleware");
const { route } = require("./authRoutes");
//apply protect middleware to all routes
routes.use(protect);
router.route("/").post(createBook).get(getBooks);
router.route("/:id").get(getBookById).put(updateBook).delete(deleteBook);
router.route("/cover/:id").post(upload.single("cover"), updateBookCover);
 
module.exports = routes;