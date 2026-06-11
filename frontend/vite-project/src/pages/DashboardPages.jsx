import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Book } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const DashboardPages = () => {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axiosInstance.get(
                    API_PATHS.BOOKS.GET_Books
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
        navigate(`/editor/${bookId}`);
    };

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div>
                        <h1 className="text-2xl font-bold">All ebooks</h1>
                        <p>
                            create, edit and manage your ebooks all in one place
                        </p>
                    </div>

                    <Button
                        className=""
                        onClick={handleCreateBook}
                        icon={Plus}
                    >
                        Create new Book
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i}>Loading...</div>
                    ))}
                </div>
            ) : books.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-state-200 rounded-xl mt-20">
                    <div className="w-16 h-16 bg-state-100 rounded-full flex items-center justify-center mb-4">
                        <Book className="w-8 h-8 text-state-400" />
                    </div>

                    <h3 className="text-lg font-medium text-state-900 mb-2">
                        No ebooks found
                    </h3>

                    <p className="text-state-500 mb-6 max-w-md">
                        you haven't created any ebooks yet. Start by creating a
                        new book and bring your ideas to life!
                    </p>

                    <Button onClick={handleCreateBook} icon={Plus}>
                        Create your first ebook
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <BookCard
                            key={book._id}
                            book={book}
                            onDelete=setBookToDelete(book._id)}


                        />
                    ))}
                </div>
            )}
            
        </DashboardLayout>
    );
};

export default DashboardPages;