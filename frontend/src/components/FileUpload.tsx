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
          // Light: Soft off-white slate (no glare), dark text, medium blue drag
          'bg-slate-100/90 backdrop-blur-md border-slate-300',
          isDragOver
            ? 'border-blue-600 bg-blue-50/80 scale-[1.01]'
            : 'hover:border-blue-500 hover:bg-slate-200/80',
          // Dark: Pure Black & White
          'dark:bg-zinc-950/80 dark:border-white/15 dark:hover:border-white/40 dark:hover:bg-zinc-900',
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

        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-3 shadow-md shadow-blue-600/30 dark:bg-white dark:text-black">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          {loading ? 'Uploading & parsing document...' : 'Click to upload or drag & drop documents'}
        </p>
        <p className="text-xs text-slate-700 dark:text-zinc-400 font-medium">
          PDF, DOCX, TXT, CSV, XLSX (max {maxSizeMB}MB)
        </p>
      </div>

      {error && (
        <div className="mt-2 text-xs text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
