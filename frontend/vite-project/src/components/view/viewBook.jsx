import { useState } from 'react';
import { ChevronLeft, Menu } from 'lucide-react';
import ViewChapterSidebar from './ViewChapterSidebar';

const ViewBook = ({ book }) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);

  const selectedChapter = book.chapters[selectedChapterIndex];

  // Format content with proper paragraphs and styling
  const formatContent = (content) => {
    return content
      .split('\n\n')
      .filter(paragraph => paragraph.trim())
      .map(paragraph => paragraph.trim())
      .map(paragraph => {
        paragraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        paragraph = paragraph.replace(/\*(.*?)\*/g, '<em>$1</em>');
        return `<p>${paragraph}</p>`;
      })
      .join('');
  };

  return (
    <div className="flex h-[calc(100vh-46px)] bg-white text-gray-900">
      {/* Sidebar */}
      <ViewChapterSidebar
        book={book}
        selectedChapterIndex={selectedChapterIndex}
        onSelectChapter={setSelectedChapterIndex}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="font-semibold text-base md:text-lg truncate">
                {book.title}
              </h1>
              <p className="text-sm text-gray-500">{book.author}</p>
            </div>
          </div>

          {/* Font Size Controls */}
          <div className="flex items-center gap-2 mr-4">
            <button
              onClick={() => setFontSize(Math.max(14, fontSize - 2))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-sm font-bold"
            >
              A-
            </button>

            <span className="text-sm text-gray-500">
              {fontSize}px
            </span>

            <button
              onClick={() => setFontSize(prev => Math.min(prev + 2, 36))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-lg font-bold"
            >
              A+
            </button>
          </div>
        </header>
      </main>
    </div>
  );
};

export default ViewBook;