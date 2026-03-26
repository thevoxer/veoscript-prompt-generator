import React, { useState, useRef, useCallback } from 'react';
import { Loader2, Sparkles, History, Image as ImageIcon, X, UploadCloud } from 'lucide-react';

interface IdeaInputProps {
  onSubmit: (idea: string, imageBase64?: string) => void;
  onViewHistory: () => void;
  isGenerating: boolean;
}

const IdeaInput: React.FC<IdeaInputProps> = ({ onSubmit, onViewHistory, isGenerating }) => {
  const [idea, setIdea] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim() || selectedImage) {
      onSubmit(idea, selectedImage || undefined);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file (JPG, PNG, WebP)");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isGenerating) {
      setIsDragging(true);
    }
  }, [isGenerating]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isGenerating) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [isGenerating]);

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-8 shadow-2xl relative">
        
        <button 
          onClick={onViewHistory}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-sm z-20"
          title="View History"
        >
          <History size={18} />
          <span className="hidden sm:inline">History</span>
        </button>

        <div className="text-center mb-8 mt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600/20 text-primary-500 mb-4">
            <Sparkles size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Video Generator Assistant</h2>
          <p className="text-slate-400">Describe your concept or drag & drop an image to start engineering the perfect Veo/Sora prompt.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div 
            className={`relative group transition-all duration-300 rounded-xl ${isDragging ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-slate-900 scale-[1.01]' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. A futuristic samurai walking through a neon-lit cyber city in the rain..."
              className="w-full h-64 bg-slate-950 border border-slate-700 rounded-xl p-4 text-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none custom-scrollbar focus:outline-none pb-24"
              disabled={isGenerating}
            />
            
            {/* Drag Overlay */}
            {isDragging && (
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10 border-2 border-dashed border-primary-500 animate-in fade-in duration-200">
                <UploadCloud size={48} className="text-primary-500 mb-2" />
                <p className="text-white font-semibold text-lg">Drop image here</p>
                <p className="text-slate-400 text-sm">JPG, PNG, WebP supported</p>
              </div>
            )}
            
            {/* Image Preview Area */}
            {selectedImage && !isDragging && (
              <div className="absolute bottom-4 left-4 z-10">
                <div className="relative group">
                  <img 
                    src={selectedImage} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-lg border border-slate-600 shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Upload Button inside Textarea area */}
            <div className="absolute bottom-4 right-4 z-10">
              <input 
                type="file" 
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${selectedImage ? 'bg-primary-600/20 text-primary-400' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                title="Upload Reference Image"
              >
                <ImageIcon size={18} />
                {selectedImage ? 'Image Added' : 'Add Image'}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={(!idea.trim() && !selectedImage) || isGenerating}
            className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-900/20 transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" />
                Constructing Scene...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Technical Prompt
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 flex flex-wrap gap-2 justify-center text-xs text-slate-500">
          <span className="bg-slate-800 px-2 py-1 rounded">Gemini 2.5 Flash</span>
          <span className="bg-slate-800 px-2 py-1 rounded">Drag & Drop Ready</span>
          <span className="bg-slate-800 px-2 py-1 rounded">Multimodal Input</span>
          <span className="bg-slate-800 px-2 py-1 rounded">Sora Ready</span>
        </div>
      </div>
    </div>
  );
};

export default IdeaInput;
