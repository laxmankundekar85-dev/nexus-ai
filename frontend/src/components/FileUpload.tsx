import React, { useRef, useState } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  loading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.pdf,.docx,.txt,.csv,.xlsx',
  maxSizeMB = 50,
  loading = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200',
          'bg-white/60 dark:bg-[#071324]/60 backdrop-blur-md',
          isDragOver
            ? 'border-sky-500 bg-sky-50/80 dark:bg-sky-950/50 scale-[1.01]'
            : 'border-sky-200 dark:border-sky-500/30 hover:border-sky-400 dark:hover:border-sky-400 hover:bg-white/80 dark:hover:bg-[#0b1b33]/80',
          loading && 'opacity-50 pointer-events-none'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white mb-3 shadow-md shadow-sky-500/25">
          <UploadCloud className="w-6 h-6 text-white" />
        </div>

        <p className="text-sm font-bold text-slate-800 dark:text-sky-100 mb-1">
          Click to upload or drag & drop documents
        </p>
        <p className="text-xs text-slate-500 dark:text-sky-300/70">
          PDF, DOCX, TXT, CSV, XLSX (max {maxSizeMB}MB)
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-rose-500 dark:text-rose-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
