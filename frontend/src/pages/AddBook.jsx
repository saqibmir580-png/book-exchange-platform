import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";
import { ReactSpreadsheetImport } from "react-spreadsheet-import";

const AddBook = () => {
  // Component state
  const [mode, setMode] = useState("single");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [bulkData, setBulkData] = useState([]);
  const [bulkImageFiles, setBulkImageFiles] = useState([]);
  const [bulkFile, setBulkFile] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setError({ message: "Authentication required. Please login." });
    }
    setToken(storedToken);
  }, []);

  // Toggle between single and bulk mode
  const toggleMode = () => {
    setMode((prev) => (prev === "single" ? "bulk" : "single"));
    setMessage("");
    setError(null);
    setBulkData([]);
    setBulkImageFiles([]);
    setBulkFile(null);
    setShowImport(false);
    setUploadProgress(0);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle single image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.match("image.*")) {
      setError({ message: "Please select an image file (JPEG, PNG, etc.)" });
      return;
    }
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Handle bulk image uploads
  const handleBulkImageChange = (e, index) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = [...bulkImageFiles];
    newFiles[index] = files[0];
    setBulkImageFiles(newFiles);

    const reader = new FileReader();
    reader.onload = (event) => {
      const newBulkData = [...bulkData];
      newBulkData[index].imagePreview = event.target.result;
      setBulkData(newBulkData);
    };
    reader.readAsDataURL(files[0]);
  };

  // Validate single book form
  const validateSingleForm = () => {
    if (!formData.title.trim()) {
      setError({ message: "Title is required" });
      return false;
    }
    if (!formData.author.trim()) {
      setError({ message: "Author is required" });
      return false;
    }
    return true;
  };

  // Submit single book
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(null);

    if (!validateSingleForm()) return;
    if (!token) {
      setError({ message: "Authentication required" });
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("isbn", formData.isbn);
      data.append("imageUrl", formData.imageUrl);
      if (imageFile) data.append("image", imageFile);

      await axios.post("/books/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("📚 Book added successfully!");
      setFormData({ title: "", author: "", isbn: "", imageUrl: "" });
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      handleApiError(err, "Failed to add book");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file import
  const handleImportSubmit = (data, file) => {
    if (!file) {
      setError({ message: "No file was selected" });
      return;
    }

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError({ message: "Please upload an Excel (.xlsx, .xls) or CSV file" });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError({ message: "File size must be less than 10MB" });
      return;
    }

    const validData = data.validData;
    const invalidData = data.invalidData;

    if (!validData || validData.length === 0) {
      setError({ message: "No valid books found in the file" });
      return;
    }

    if (invalidData && invalidData.length > 0) {
      setMessage(
        `Imported ${validData.length} books (${invalidData.length} had errors)`
      );
    }

    const books = validData.map((row) => ({
      title: row.title?.toString()?.trim() || "",
      author: row.author?.toString()?.trim() || "",
      isbn: row.isbn?.toString()?.trim() || "",
      imageUrl: row.imageUrl?.toString()?.trim() || "",
    }));

    setBulkData(books);
    setBulkFile(file);
    setBulkImageFiles(new Array(books.length).fill(null));
    setShowImport(false);
    setMessage(`Found ${books.length} valid books ready for upload`);
  };

  // Submit bulk upload
  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError(null);
    setUploadProgress(0);

    if (!bulkFile) {
      setError({ message: "Please select an Excel/CSV file first" });
      return;
    }
    if (!token) {
      setError({ message: "Authentication required" });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", bulkFile);

      // Add any image files
      bulkImageFiles.forEach((file, index) => {
        if (file) {
          formData.append(`images`, file);
          formData.append(`imageIndexes`, index.toString());
        }
      });

      const response = await axios.post("/books/bulk-upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
          setMessage(`Uploading... ${percentCompleted}%`);
        },
      });

      setMessage(
        `✅ Successfully uploaded ${response.data.insertedCount} books!` +
        (response.data.errors?.length > 0
          ? ` (${response.data.errors.length} errors)`
          : "")
      );
      
      setBulkFile(null);
      setBulkData([]);
      setBulkImageFiles([]);
    } catch (err) {
      console.error("Upload error:", err);
      if (err.response) {
        setError({
          message: err.response.data.error || "Upload failed",
          details: err.response.data.errors
        });
      } else {
        setError({ message: "Network error during upload" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle API errors
  const handleApiError = (err, defaultMessage) => {
    console.error("API Error:", err);
    
    let errorMsg = defaultMessage;
    if (err.response) {
      errorMsg = err.response.data?.message || 
                err.response.data?.error || 
                `Server error (${err.response.status})`;
    } else if (err.message) {
      errorMsg = err.message;
    }

    setError({ message: `❌ ${errorMsg}` });
  };

  // Spreadsheet import fields configuration
  const importFields = [
    {
      label: "Title *",
      key: "title",
      fieldType: { type: "input" },
      alternateMatches: ["book title", "title", "name"],
      example: "The Alchemist",
      validations: [{ rule: "required", errorMessage: "Title is required" }],
    },
    {
      label: "Author *",
      key: "author",
      fieldType: { type: "input" },
      alternateMatches: ["writer", "author", "creator"],
      example: "Paulo Coelho",
      validations: [{ rule: "required", errorMessage: "Author is required" }],
    },
    {
      label: "ISBN",
      key: "isbn",
      fieldType: { type: "input" },
      alternateMatches: ["isbn number", "isbn code"],
      example: "9780062315007",
    },
    {
      label: "Image URL",
      key: "imageUrl",
      fieldType: { type: "input" },
      alternateMatches: ["cover", "image", "cover image"],
      example: "https://example.com/book-cover.jpg",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-700">
            {mode === "single" ? "➕ Add Book" : "📑 Bulk Upload Books"}
          </h2>
          <button
            onClick={toggleMode}
            className="text-sm text-indigo-600 underline hover:text-indigo-800"
          >
            Switch to {mode === "single" ? "Bulk Upload" : "Single Upload"}
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error.message}
            {error.details && (
              <ul className="mt-2 list-disc list-inside">
                {error.details.map((err, i) => (
                  <li key={i}>Row {err.row}: {err.error}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {mode === "single" ? (
          <form
            onSubmit={handleSingleSubmit}
            className="space-y-4 w-full max-w-md"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Book Title"
                className="w-full border px-4 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Author"
                className="w-full border px-4 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN
              </label>
              <input
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Optional ISBN"
                className="w-full border px-4 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/book-cover.jpg"
                className="w-full border px-4 py-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or Upload Cover Image
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="Book Preview"
                  className="w-24 h-32 object-cover mb-2 border rounded"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Processing..." : "Add Book"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setShowImport(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              📁 Import Excel/CSV
            </button>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

            {bulkData.length > 0 && (
              <div className="p-4 border rounded bg-gray-50">
                <h3 className="font-medium text-gray-800 mb-2">
                  Ready to upload {bulkData.length} books
                </h3>
                <div className="max-h-96 overflow-y-auto mb-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Author
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ISBN
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Upload Cover
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bulkData.map((book, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {book.title}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {book.author}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {book.isbn || "-"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {book.imageUrl ? (
                              <img
                                src={book.imageUrl}
                                alt="Cover"
                                className="h-10"
                              />
                            ) : (
                              "No image"
                            )}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleBulkImageChange(e, index)}
                              className="text-sm"
                            />
                            {book.imagePreview && (
                              <img
                                src={book.imagePreview}
                                alt="Preview"
                                className="h-10 mt-1"
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={handleBulkSubmit}
                  disabled={isLoading}
                  className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Uploading..." : "🚀 Upload Now"}
                </button>
              </div>
            )}

            {showImport && (
              <ReactSpreadsheetImport
                isOpen={showImport}
                onClose={() => setShowImport(false)}
                onSubmit={(data, file) => handleImportSubmit(data, file)}
                fields={importFields}
              />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AddBook;