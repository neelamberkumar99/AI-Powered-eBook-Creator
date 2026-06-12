import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Book } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import BookCard from "../components/BookCard";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const DashboardPages = () => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axiosInstance.get(
                    API_PATHS.BOOKS.GET_BOOKS
                );
                setBooks(response.data);
            } catch (error) {
                toast.error("Failed to fetch books");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleDeleteBook = async () => {
        // TODO
    };

    const handleCreateBook = async () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = (bookId) => {
        setIsCreateModalOpen(false);

        if (bookId) {
            navigate(`/editor/${bookId}`);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold">All ebooks</h1>
                    <p>
                        Create, edit and manage your ebooks all in one place
                    </p>
                </div>

                <Button
                    onClick={handleCreateBook}
                    icon={Plus}
                >
                    Create New Book
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-64 bg-gray-100 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            ) : books.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-xl mt-20">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Book className="w-8 h-8 text-gray-400" />
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No ebooks found
                    </h3>

                    <p className="text-gray-500 mb-6 max-w-md">
                        You haven't created any ebooks yet. Start by creating a
                        new book and bring your ideas to life!
                    </p>

                    <Button
                        onClick={handleCreateBook}
                        icon={Plus}
                    >
                        Create Your First Ebook
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <BookCard
                            key={book._id}
                            book={book}
                            onDelete={() => setBookToDelete(book._id)}
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default DashboardPages;