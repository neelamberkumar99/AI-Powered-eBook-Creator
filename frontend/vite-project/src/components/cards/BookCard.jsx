import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/apiPaths";
import { Edit, Trash2 } from "lucide-react";

const BookCard = ({ book, onDelete }) => {
    const navigate = useNavigate();

    const coverImageUrl = book.coverImage
        ? `${BASE_URL}/backends${book.coverImage}`.replace(/\\/g, "/")
        : "";

    return (
        <div
            className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(`/editor/${book._id}`)}
        >
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                    src={coverImageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = ''; }}
                />
                <div className="p-4 flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/editor/${book._id}`);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(book._id);
                        }}
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                        {book.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {book.author}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookCard;