import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Sparkles,
  FileDown,
  Save,
  Menu,
  X,
  Edit,
  NotebookText,
  ChevronDown,
  FileText,
} from "lucide-react";
import { arrayMove } from "@dnd-kit/sortable";

import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import Dropdown, { DropdownItem } from "../components/ui/Dropdown";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import SelectField from "../components/ui/SelectField";

const EditorPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("editor");
  const fileInputRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // AI Modal state
  const [isOutlineModalOpen, setIsOutlineModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiStyle, setAiStyle] = useState("informative");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axiosInstance.get(
          `${API_PATHS.BOOKS.GET_BOOK_BY_ID}/${bookId}`
        );

        setBook(response.data);
      } catch (error) {
        toast.error("Failed to fetch book");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId, navigate]);

  const handleBookChange = (e) => {
    const { name, value } = e.target;

    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleChapterChange = (e) => {
    const { name, value } = e.target;
    const updatedChapters = [...book.chapters];
    updatedChapters[selectedChapterIndex][name] = value; 
    setBook((prevBook) => ({
      ...prevBook,
      chapters: updatedChapters,
    }));

  };

  const handleAddChapter = (e) => {
    const newChapter = {
      title: `Chapter ${book.chapters.length + 1}`,
      content: "",
    };
    const updatedChapters = [...book.chapters, newChapter];
    setBook((prevBook) => ({
      ...prevBook,
      chapters: updatedChapters,
    }));
    setSelectedChapterIndex(updatedChapters.length - 1);
  };

  const handleDeleteChapter = (index) => {
    if (book.chapters.length <= 1) {
      toast.error(" A book must have at least one chapter.");
      return;
    }
    const updatedChapters = book.chapters.filter((_, i) => i !== index);
    setBook((prevBook) => ({
      ...prevBook,
      chapters: updatedChapters,
    }));
    setSelectedChapterIndex((prevIndex) =>
      prevIndex >= index ? Math.max(0, prevIndex - 1) :prevIndex
    );

  };

  const handleReorderChapters = (oldIndex, newIndex) => {
    setBook((prevBook) => ({
      ...prevBook,
      chapters: arrayMove(prevBook.chapters, oldIndex, newIndex),
    }));
    setSelectedChapterIndex(newIndex);//keep the selected chapter index in sync with the new order

  };

  const handleSaveChanges = async (
    bookToSave = book,
    showToast = true
  ) => {
    setIsSaving(true);
    try {
      await axiosInstance.put(
        `${API_PATHS.BOOKS.UPDATE_BOOK}/${bookId}`,
        bookToSave
      );
      if (showToast) {
        toast.success("Changes saved successfully");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("coverImage", file);
    setIsUploading(true);
    try {
      const response = await axiosInstance.post(
        `${API_PATHS.BOOKS.UPLOAD_COVER}/${bookId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
      }
      );
      setBook(response.data);
      toast.success("Cover image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload cover image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateOutline = async (index) => {
    const chapter = book.chapters[index];
    if (!chapter || !chapter.title) {
      toast.error("Chapter title is required to generate outline");
      return;
    }
    setIsGenerating(index);
    try {
      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_CHAPTER_CONTENT,
        {
          chapterTitle: chapter.title,
          chapterDescription: chapter.description || "",
          style: "aistyle",
        }
      );
      const updatedChapters = [...book.chapters];
      updatedChapters[index].content = response.data.content;

      const updatedBook = {
        ...book,
        chapters: updatedChapters,
      };
      setBook(updatedBook);
      toast.success(`Content for "${chapter.title}" generated! `);}

      await handleSaveChanges(updatedBook, false);
    } catch (error) {
      toast.error("Failed to generate chapter content");
    }
      finally {
        setIsGenerating(false);
      }






  };

  const handleExportPDF = async () => {
    toast.loading("generating PDF...");
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.BOOKS.EXPORT_PDF}/${bookId}`,
        {responseType: "blob"}
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      toast.dismiss();
      toast.success("PDF generated successfully");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to generate PDF");
    }


  };

  const handleExportDoc = async () => {
    toast.loading("generating document...");
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.BOOKS.EXPORT_DOC}/${bookId}`,
        {responseType: "blob"}
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book.title}.docx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("Document generated successfully");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to generate document");
    }


  };

  if (isLoading || !book) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading Editor...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex bg-gray-50 font-sans relative min-h-screen">
        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 flex md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="fixed inset-0 bg-black/20"
              aria-hidden="true"
              onClick={() => setIsSidebarOpen(false)}
            />

            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <ChapterSidebar
                book={book}
                selectedChapterIndex={selectedChapterIndex}
                onSelectChapter={(index) => {
                  setSelectedChapterIndex(index);
                  setIsSidebarOpen(false);
                }}
                onAddChapter={handleAddChapter}
                onDeleteChapter={handleDeleteChapter}
                onGenerateChapterContent={() => {}}
                isGenerating={isGenerating}
                onReorderChapters={handleReorderChapters}
              />
            </div>

            <div
              className="flex-shrink-0 w-14"
              aria-hidden="true"
            />
          </div>
        )}
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0 sticky top-0 h-screen">
          <ChapterSidebar
            book={book}
            selectedChapterIndex={selectedChapterIndex}
            onSelectChapter={(index) => {
              setSelectedChapterIndex(index);
              setIsSidebarOpen(false);
            }}
            onAddChapter={handleAddChapter}
            onDeleteChapter={handleDeleteChapter}
            onGenerateChapterContent={handleGenerateChapterContent}
            isGenerating={isGenerating}
            onReorderChapters={handleReorderChapters}

          />
        </div>
        <main className="flex--1 h-full flex flex-col">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200 p-3 flex justify-between item center">
            <div className="flex items-center gap-2">
              <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-800"
            >
              <menu className="w-6 h-6 " />
            </button>
            <div className="hidden sm:flex space-x-1 bg slate-100 p-1 rounded-lg">
              <button
                onClick={handleSaveChanges}
                className={`flex items-center justify-center flex-1 py-2 px-4  text-sm font-medium rounded-md transition-colors duration-200 ${`}
                  activeTab === "editor"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:bg-gray-700"
                }`}
              >
              <Edit className="w-4 h-4 mr-2" />
              Editor
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center justify-center flex-1 py-2 px-4  text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap ${`
                  activeTab === "details"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 "
                }`}
              >
              <NotebookText className="w-4 h-4 mr-2" />
              Book Details
              </button>
              </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <Dropdown
                  trigger={
                    <button variant="ghost" icon={FileDown}>
                      Export
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                  }
                >

              <div className="flex items-center gap-2 sm:gap-4">
              <DropdownItem onClick={handleExportPDF}>
                  <FileDown className="w-4 h-4 mr-2 text-slate-500" />
                  Export as pdf
                </DropdownItem>
                    <DropdownItem onClick={handleExportDoc}>
                      <FileText className="w-4 h-4 mr-2 text-slate-500" />
                      Export as document
                    </DropdownItem>
                    </Dropdown>
                    <Button
                    onClick={() => handleSaveChanges()
                      isLoading={isSaving}
                      icon={Save}
                    >
                      Save Changes
                      </Button>
                      </div>
                      </header>

                      <div className="w-full">
                        {activeTab === "editor" ? (
                          <ChapterEditorTab
                          book={book}
                          selectedChapterIndex={selectedChapterIndex}
                          onChapterChange={handleChapterChange}
                          onGeneratechapterContent={handleGenerateChapterContent}
                          isGenerating={isGenerating}
                          />
                        )}
                        <BookDetailsTab
                          book={book}
                          onBookChange={handleBookChange}
                          onCoverUpload={handleCoverImageUpload}
                          isUploading={isUploading}
                          fileInputRef={fileInputRef}
                          

                        />
                        }}
                        </div>

                      </main>
      </div>
    </>
  );
};

export default EditorPage;