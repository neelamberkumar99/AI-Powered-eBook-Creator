import { useMemo, useState } from "react";
import { Sparkles, Type, Eye, Maximize2 } from "lucide-react";
import Button from "../ui/Button";
import InputField from "../ui/InputField";
import SimpleMDEditor from "./SimpleMDEEditor";

const ChapterEditorTab = ({
  book = {
    title: "Untitled",
    chapters: [
      {
        title: "Chapter 1",
        content: "",
      },
    ],
  },
  selectedChapterIndex = 0,
  onChapterChange = () => {},
  onGenerateChapterContent = () => {},
  isGenerating,
}) => {
  const[isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  //simple markdown parser
  const formatMarkdown = (content) => {
  };
  const mdeOptions = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      toolbar:[
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
      ],
    };
    },[]);

    if(selectedChapterIndex ==null|| !book.chapters[selectedChapterIndex]){
      return (
        <div className="flex-1 flex items-center justify-center ">
          <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Type className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-lg">Please select a chapter to edit</p>
        <p className="text-gray-400 text-sm mt-1">choose from the sidebar to begin writing</p>
        </div>
        </div>
      );
    }
      const currentChapter = book.chapters[selectedChapterIndex];
  return <div>ChapterEditorTab</div>;
};

export default ChapterEditorTab;