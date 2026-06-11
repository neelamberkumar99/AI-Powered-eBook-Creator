import { BookOpen, ChevronLeft } from 'lucide-react';

const ViewChapterSidebar = ({
  book,
  selectedChapterIndex,
  onSelectChapter,
  isOpen,
  onClose,
}) => {

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className=""
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative left-0 top-0 h-full w-80 bg-white border-r border-gray-100
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="">
          <div className="">
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewChapterSidebar;