import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
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
          'flex flex-col items-center justify-center p-8 border border-dashed rounded-xl cursor-pointer transition-colors duration-150',
          isDragOver
            ? 'border-blue-500 bg-blue-500/5'
            : 'border-slate-800 hover:border-slate-700 bg-[#0b0f19] hover:bg-[#0e1422]',
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

        <div className="p-3 rounded-lg bg-slate-800/90 text-slate-400 mb-2.5 border border-slate-700/60">
          <UploadCloud className="w-5 h-5 text-slate-300" />
        </div>

        <p className="text-xs font-semibold text-slate-200 mb-0.5">
          Click to upload or drag & drop files
        </p>
        <p className="text-[11px] text-slate-500">
          PDF, DOCX, TXT, CSV, XLSX (max {maxSizeMB}MB)
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
