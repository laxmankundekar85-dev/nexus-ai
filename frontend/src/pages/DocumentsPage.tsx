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
    <div className="p-7 max-w-7xl mx-auto w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-slate-400" />
            Document Store & Knowledge Context
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Indexed documents (PDF, DOCX, XLSX, CSV, TXT) parsed for grounded agent retrieval and citation.
          </p>
        </div>

        <Button variant="ghost" size="xs" onClick={() => refetch()} icon={<RefreshCw className="w-3.5 h-3.5" />}>
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
              icon={<FileText className="w-6 h-6 text-slate-400" />}
              title="No documents uploaded"
              description="Drop PDF or office documents above to parse and enable semantic agent grounding."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b0f19] border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 font-medium">Document Name</th>
                  <th className="py-3 px-4 font-medium">Size</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Uploaded</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-slate-200 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-sm">{doc.filename}</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 font-mono">
                      {formatBytes(doc.size_bytes)}
                    </td>
                    <td className="py-2.5 px-4">
                      <StatusBadge status={doc.processing_status} />
                    </td>
                    <td className="py-2.5 px-4 text-slate-400 font-mono">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-4 text-right space-x-1.5">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleViewText(doc)}
                        icon={<Eye className="w-3 h-3" />}
                      >
                        Preview Text
                      </Button>
                      <Button
                        variant="danger"
                        size="xs"
                        onClick={() => deleteDocument(doc.id)}
                        icon={<Trash2 className="w-3 h-3" />}
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
          <pre className="p-3.5 bg-[#0b0f19] rounded-lg text-xs font-mono text-slate-300 max-h-96 overflow-y-auto whitespace-pre-wrap border border-slate-800">
            {extractedText || 'No text extracted.'}
          </pre>
        )}
      </Modal>
    </div>
  );
};

export default DocumentsPage;
