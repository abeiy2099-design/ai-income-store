import { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  currentFile?: string;
  label: string;
  accept?: string;
  bucketName?: string;
}

export default function FileUpload({
  onUploadComplete,
  currentFile,
  label,
  accept = '.pdf,.epub',
  bucketName = 'ebooks'
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setUploadProgress(100);
      onUploadComplete(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = () => {
    onUploadComplete('');
    setUploadProgress(0);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-[#2C2E83]">{label}</label>

      {!currentFile ? (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
              uploading
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                : 'border-[#00D4FF] bg-white hover:bg-[#00D4FF]/5'
            }`}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2C2E83]"></div>
                <span className="text-[#2C2E83]">Uploading... {uploadProgress}%</span>
              </>
            ) : (
              <>
                <Upload size={20} className="text-[#2C2E83]" />
                <span className="text-[#2C2E83] font-medium">Click to upload file</span>
              </>
            )}
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 py-3 border-2 border-[#00D4FF] rounded-lg bg-[#00D4FF]/5">
          <FileText size={20} className="text-[#2C2E83]" />
          <span className="flex-1 text-sm text-[#2C2E83] truncate">{currentFile}</span>
          <button
            type="button"
            onClick={removeFile}
            className="text-red-500 hover:text-red-700"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <p className="text-xs text-gray-500">Supported formats: PDF, EPUB (Max 50MB)</p>
    </div>
  );
}
