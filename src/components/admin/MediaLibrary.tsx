"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Copy, Image as ImageIcon, ExternalLink, Loader2, UploadCloud } from "lucide-react";
import { format } from "date-fns";

interface MediaFile {
  name: string;
  id: string | null;
  updated_at: string | null;
  created_at: string | null;
  last_accessed_at: string | null;
  metadata: {
    size: number;
    mimetype: string;
  } | null;
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from('product-images').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

    if (data) {
      // Filter out the empty folder placeholder if any (.emptyFolderPlaceholder)
      setFiles(data.filter(f => f.name !== '.emptyFolderPlaceholder'));
    }
    setLoading(false);
  };

  const getPublicUrl = (fileName: string) => {
    return supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
  };

  const handleDelete = async (fileName: string) => {
    if (confirm(`Are you sure you want to delete ${fileName}? This might break images on live products.`)) {
      await supabase.storage.from('product-images').remove([fileName]);
      fetchFiles();
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    await supabase.storage.from('product-images').upload(fileName, file, { cacheControl: '3600', upsert: false });
    
    setUploading(false);
    fetchFiles();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Product Images Bucket</h2>
        <div className="relative">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
          />
          <button 
            disabled={uploading}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            Upload Image
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
        ) : files.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No media files found. Upload some images.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {files.map((file) => {
              const url = getPublicUrl(file.name);
              const isImage = file.metadata?.mimetype?.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
              
              return (
                <div key={file.id} className="group bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="aspect-square bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center">
                    {isImage ? (
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${url})` }} />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-slate-300" />
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => copyToClipboard(url)} className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-colors" title="Copy URL">
                        <Copy className="w-4 h-4" />
                      </button>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-colors" title="Open in new tab">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button onClick={() => handleDelete(file.name)} className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-slate-900 dark:text-white truncate" title={file.name}>{file.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] text-slate-500">{formatBytes(file.metadata?.size || 0)}</p>
                      <p className="text-[10px] text-slate-500">{format(new Date(file.created_at || new Date().toISOString()), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
