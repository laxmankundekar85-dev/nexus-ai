import React, { useState } from 'react';
import {
  FolderArchive,
  FileText,
  Trash2,
  Eye,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDocuments } from '../hooks/useDocuments';
import { documentsApi } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import FileUpload from '../components/FileUpload';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import type { Document } from '../types';

export const DocumentsPage: React.FC = () => {
  const { documents, loading, uploadDocument, deleteDocument, refetch } = useDocuments(1, 50);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [loadingText, setLoadingText] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      await uploadDocument(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewText = async (doc: Document) => {
    setSelectedDoc(doc);
    setLoadingText(true);
    try {
      const res = await documentsApi.getText(doc.id);
      setExtractedText(res.text);
    } catch {
      toast.error('Could not fetch extracted text');
    } finally {
      setLoadingText(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-7 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sky-200/80 dark:border-sky-500/20 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30">
              <FolderArchive className="w-5 h-5 text-white" />
            </div>
            Document Store & Knowledge Context
          </h1>
          <p className="text-xs text-slate-500 dark:text-sky-300/70 mt-1">
            Indexed documents (PDF, DOCX, XLSX, CSV, TXT) parsed for grounded agent retrieval and citation.
          </p>
        </div>

        <Button variant="ghost" size="xs" onClick={() => refetch()} icon={<RefreshCw className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}>
          Refresh
        </Button>
      </div>

      {/* Upload Zone */}
      <FileUpload onFileSelect={handleUpload} loading={isUploading} />

      {/* Documents Table */}
      <Card className="p-0 overflow-hidden">
        {documents.length === 0 && !loading ? (
          <div className="p-8">
            <EmptyState
              icon={<FileText className="w-6 h-6 text-sky-500" />}
              title="No documents uploaded"
              description="Drop PDF or office documents above to parse and enable semantic agent grounding."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sky-50/80 dark:bg-[#091526]/80 border-b border-sky-200 dark:border-sky-500/20 text-sky-900 dark:text-sky-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5 font-bold">Document Name</th>
                  <th className="py-3.5 px-5 font-bold">Size</th>
                  <th className="py-3.5 px-5 font-bold">Status</th>
                  <th className="py-3.5 px-5 font-bold">Uploaded</th>
                  <th className="py-3.5 px-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 dark:divide-sky-500/15">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-sky-50/60 dark:hover:bg-sky-950/40 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className="truncate max-w-sm">{doc.filename}</span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 dark:text-sky-300/70 font-mono">
                      {formatBytes(doc.size_bytes)}
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={doc.processing_status} />
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 dark:text-sky-300/70 font-mono">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleViewText(doc)}
                        icon={<Eye className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
                      >
                        Preview Text
                      </Button>
                      <Button
                        variant="danger"
                        size="xs"
                        onClick={() => deleteDocument(doc.id)}
                        icon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Extracted Text Modal */}
      <Modal
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        title={`Extracted Content: ${selectedDoc?.filename}`}
        maxWidth="lg"
      >
        {loadingText ? (
          <div className="py-10 text-center text-xs text-slate-400">Loading content...</div>
        ) : (
          <pre className="p-4 bg-sky-50/80 dark:bg-[#071324] rounded-xl text-xs font-mono text-slate-800 dark:text-sky-200 max-h-96 overflow-y-auto whitespace-pre-wrap border border-sky-200 dark:border-sky-500/20">
            {extractedText || 'No text extracted.'}
          </pre>
        )}
      </Modal>
    </div>
  );
};

export default DocumentsPage;
