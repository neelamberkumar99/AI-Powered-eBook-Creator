import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {plus,Book} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import {useAuth} from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import {API_PATHS} from "../utils/apiPaths";
const DashboardPages = () => {
    const[books,setBooks] = useState([]);
    const [isLoading,setIsLoading] = useState(true);
    const [isCreateModalOpen,setIsCreateModalOpen] = useState(false);
    const {user} = useAuth();
    const navigate = useNavigate();
    useEffect(()=>{
        const fetchBooks = async()=>{
            try {
                const response = await axiosInstance.get(API_PATHS.BOOKS.GET_Books);
                setBooks(response.data);
            } catch (error) {
                toast.error("Failed to fetch books");
            } finally {

                setIsLoading(false);
            }
        };
        fetchBooks();
    },[]);
    const handleCreateBook = () => {


                
    return <div>Dashboard Page</div>;
};

export default DashboardPages;
