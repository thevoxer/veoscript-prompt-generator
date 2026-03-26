import React, { useEffect, useState } from 'react';
import { HistoryItem, VideoPromptData } from '../types';
import { getHistory, deleteHistoryItem, clearHistory } from '../services/historyService';
import { Clock, Trash2, ArrowRight, Calendar, History, AlertCircle } from 'lucide-react';

interface HistoryViewProps {
  onSelect: (data: VideoPromptData) => void;
  onBack: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onSelect, onBack }) => {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteHistoryItem(id);
    setItems(updated);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all history?")) {
      clearHistory();
      setItems([]);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <History className="text-primary-500" />
          Prompt History
        </h2>
        <div className="flex gap-4">
          {items.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} /> Clear All
            </button>
          )}
          <button onClick={onBack} className="text-slate-400 hover:text-white text-sm">
            Back to Generator
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 text-slate-500 mb-4">
            <History size={32} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No History Yet</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Your generated prompts will be saved here automatically. Go back and create your first video concept!
          </p>
          <button 
            onClick={onBack}
            className="mt-6 px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-colors"
          >
            Create New Prompt
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item.technicalPrompt)}
              className="group relative bg-slate-900 border border-slate-800 hover:border-primary-500/50 rounded-xl p-5 transition-all cursor-pointer hover:shadow-lg hover:shadow-primary-900/10"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded">
                      <Calendar size={10} /> {formatDate(item.timestamp)}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-primary-400">
                      {item.technicalPrompt.aspect_ratio || "Ratio N/A"}
                    </span>
                  </div>
                  <h4 className="text-slate-200 font-medium line-clamp-2 mb-2">
                    "{item.userIdea}"
                  </h4>
                  <p className="text-sm text-slate-500 line-clamp-1">
                    <span className="font-mono text-slate-600">Scene:</span> {item.technicalPrompt.subject}
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="mt-auto p-2 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
                     <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;