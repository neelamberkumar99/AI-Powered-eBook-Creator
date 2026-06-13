import InputField from "../ui/InputField";
import Button from "../ui/Button";
import { UploadCloud } from "lucide-react";
import { BASE_URL } from "../../utils/apiPaths";

const BookDetailsTab = ({
  book,
  onBookChange,
  onCoverUpload,
  isUploading,
  fileInputRef,
}) => {
  const coverImageUrl =
    book.coverImage?.startsWith("http")
      ? book.coverImage
      : `${BASE_URL}/backend${book.coverImage}`.replace(/\/\//g, "/");

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mt-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Book Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Title"
            name="title"
            value={book.title}
            onChange={onBookChange}
          />

          <InputField
            label="Author"
            name="author"
            value={book.author}
            onChange={onBookChange}
          />

          <div className="md:col-span-2">
            <InputField
              label="Subtitle"
              name="subtitle"
              value={book.subtitle || ""}
              onChange={onBookChange}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mt-6">
        <h3 className="text-lg font-semibold mb-3">Cover Image</h3>

        <div className="">
          <img
            src={coverImageUrl}
            alt="Cover"
            className="w-48 rounded-lg shadow"
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={onCoverUpload}
            className="hidden"
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            icon={UploadCloud}
            isLoading={isUploading}
          >
            Upload Cover
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsTab;