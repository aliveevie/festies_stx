import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useDrop Hook
 * Hook for handling drop zones and file uploads via drag and drop
 */
const useDrop = ({
  onDrop,
  onDragOver,
  onDragEnter,
  onDragLeave,
  accept = null, // MIME types or file extensions
  multiple = false,
  disabled = false,
} = {}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef(null);
  const dragCounterRef = useRef(0);

  const validateFiles = useCallback(
    (files) => {
      if (!accept) return files;

      const acceptedTypes = accept.split(',').map((type) => type.trim());
      return Array.from(files).filter((file) => {
        const fileName = file.name.toLowerCase();
        const fileType = file.type.toLowerCase();

        return acceptedTypes.some((acceptType) => {
          if (acceptType.startsWith('.')) {
            // File extension
            return fileName.endsWith(acceptType.toLowerCase());
          } else if (acceptType.includes('/*')) {
            // MIME type wildcard (e.g., image/*)
            const baseType = acceptType.split('/')[0];
            return fileType.startsWith(baseType);
          } else {
            // Full MIME type
            return fileType === acceptType.toLowerCase();
          }
        });
      });
    },
    [accept]
  );

  const handleDragEnter = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      dragCounterRef.current += 1;

      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
        setIsDragOver(true);
        onDragEnter?.(e);
      }
    },
    [onDragEnter]
  );

  const handleDragLeave = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      dragCounterRef.current -= 1;

      if (dragCounterRef.current === 0) {
        setIsDragOver(false);
        setIsDragging(false);
        onDragLeave?.(e);
      }
    },
    [onDragLeave]
  );

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        e.dataTransfer.dropEffect = 'copy';
        setIsDragOver(true);
        onDragOver?.(e);
      }
    },
    [onDragOver]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragOver(false);
      setIsDragging(false);
      dragCounterRef.current = 0;

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;

      let validFiles = Array.from(files);

      if (!multiple && validFiles.length > 1) {
        validFiles = [validFiles[0]];
      }

      if (accept) {
        validFiles = validateFiles(validFiles);
      }

      if (validFiles.length > 0) {
        const result = multiple ? validFiles : validFiles[0];
        onDrop?.(result, e);
      }
    },
    [disabled, multiple, accept, validateFiles, onDrop]
  );

  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone || disabled) return;

    // Prevent default drag behaviors on document
    const handleDragOverDocument = (e) => {
      e.preventDefault();
    };

    const handleDropDocument = (e) => {
      e.preventDefault();
    };

    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);

    document.addEventListener('dragover', handleDragOverDocument);
    document.addEventListener('drop', handleDropDocument);

    return () => {
      dropZone.removeEventListener('dragenter', handleDragEnter);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('drop', handleDrop);

      document.removeEventListener('dragover', handleDragOverDocument);
      document.removeEventListener('drop', handleDropDocument);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop, disabled]);

  return {
    ref: dropZoneRef,
    isDragOver,
    isDragging,
  };
};

export default useDrop;
// Style improvement
// Performance optimization
// Refactor improvement
