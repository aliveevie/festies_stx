import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaTimes, FaFile } from 'react-icons/fa';
import Button from './Button';

/**
 * Beautiful FileUpload Component
 * File upload with drag and drop
 */
const FileUpload = ({
  accept,
  multiple = false,
  maxSize,
  onUpload,
  className = "",
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    
    if (maxSize) {
      const validFiles = fileArray.filter(file => file.size <= maxSize);
      if (validFiles.length !== fileArray.length) {
        alert('Some files exceed the maximum size limit');
      }
      setFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
    } else {
      setFiles(prev => multiple ? [...prev, ...fileArray] : fileArray);
    }

    if (onUpload) {
      onUpload(multiple ? fileArray : fileArray[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center
          transition-all duration-300
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }
        `}
        animate={{
          scale: isDragging ? 1.02 : 1,
        }}
      >
        <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop files here, or
        </p>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Browse Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        {maxSize && (
          <p className="text-sm text-gray-500 mt-4">
            Max file size: {formatFileSize(maxSize)}
          </p>
        )}
      </motion.div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <FaFile className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaTimes />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
