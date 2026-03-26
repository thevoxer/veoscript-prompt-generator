import React from 'react';
import { VideoPromptData } from '../types';
import { Check, Copy, Download, RefreshCcw, ArrowLeft } from 'lucide-react';

interface JsonResultProps {
  data: VideoPromptData;
  onRestart: () => void;
  onBackToEdit: () => void;
}

const JsonResult: React.FC<JsonResultProps> = ({ data, onRestart, onBackToEdit }) => {
  const [copied, setCopied] = React.useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veo-prompt-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-24">
      <div className="flex items-center justify-between mb-8">
         <button 
            onClick={onBackToEdit}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Editor
          </button>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Ready for Production</h2>
        <p className="text-slate-400">Copy this JSON to use with your backend video generation API.</p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
          
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
              >
                <Download size={14} /> JSON
              </button>
            </div>
          </div>

          {/* Code Block */}
          <div className="p-6 overflow-x-auto custom-scrollbar bg-[#0d1117]">
            <pre className="font-mono text-sm leading-relaxed">
              {jsonString.split('\n').map((line, i) => {
                 // Simple syntax highlighting logic for presentation
                 const isKey = line.includes('":');
                 const [key, ...valParts] = line.split(':');
                 const val = valParts.join(':');

                 if (isKey) {
                   return (
                    <div key={i} className="table-row">
                      <span className="table-cell text-slate-600 select-none pr-4 text-right w-8">{i + 1}</span>
                      <span className="table-cell">
                        <span className="text-sky-400">{key}:</span>
                        <span className="text-emerald-400">{val}</span>
                      </span>
                    </div>
                   )
                 }
                 return (
                  <div key={i} className="table-row">
                     <span className="table-cell text-slate-600 select-none pr-4 text-right w-8">{i + 1}</span>
                     <span className="table-cell text-slate-300">{line}</span>
                  </div>
                 );
              })}
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={onRestart}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCcw size={16} /> Create Another Prompt
        </button>
      </div>
    </div>
  );
};

export default JsonResult;