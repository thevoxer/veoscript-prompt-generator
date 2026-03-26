
import React, { useState } from 'react';
import { VideoPromptData } from '../types';
import { ArrowRight, Camera, Clapperboard, Edit3, Lightbulb, Music, Clock, Layout, ChevronDown, MessageSquareQuote, Shirt, User, Sparkles, Loader2, RefreshCw } from 'lucide-react';

interface PromptEditorProps {
  initialData: VideoPromptData;
  userIdea: string;
  onConfirm: (data: VideoPromptData) => void;
  onBack: () => void;
  onRegenerate: (newIdea: string) => Promise<void>;
  isRegenerating: boolean;
}

// Extracted outside to prevent re-rendering/focus loss issues
const InputGroup = ({ 
  label, 
  value, 
  onChange, 
  icon: Icon, 
  rows = 2,
  type = "text"
}: { 
  label: string; 
  value: string | number;
  onChange: (val: string | number) => void;
  icon: React.ElementType; 
  rows?: number;
  type?: "text" | "number";
}) => (
  <div className="flex flex-col space-y-2">
    <label className="text-xs font-semibold text-primary-400 uppercase tracking-wider flex items-center gap-2">
      <Icon size={14} /> {label}
    </label>
    {rows === 1 && type === "text" ? (
       <input
       value={value}
       onChange={(e) => onChange(e.target.value)}
       className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-colors"
     />
    ) : type === "number" ? (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-colors"
      />
    ) : (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:outline-none resize-none transition-colors custom-scrollbar"
      />
    )}
  </div>
);

const PromptEditor: React.FC<PromptEditorProps> = ({ initialData, userIdea, onConfirm, onBack, onRegenerate, isRegenerating }) => {
  const [formData, setFormData] = useState<VideoPromptData>(initialData);
  const [currentIdea, setCurrentIdea] = useState(userIdea);

  // Update local state when initialData changes (e.g. after regeneration)
  React.useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const aspectRatios = ["16:9", "9:16", "1:1", "21:9"];

  const handleChange = (field: keyof VideoPromptData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegenerateClick = () => {
    if (currentIdea.trim() !== "") {
      onRegenerate(currentIdea);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500 pb-24">
      
      {/* Refine Idea Section */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-8 backdrop-blur-sm">
         <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400"/> Refine Concept
            </h3>
         </div>
         <div className="flex gap-4 items-start">
            <textarea
              value={currentIdea}
              onChange={(e) => setCurrentIdea(e.target.value)}
              placeholder="Edit your original idea here to regenerate the technical details..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:ring-1 focus:ring-primary-500 focus:outline-none h-24 resize-none custom-scrollbar text-sm"
            />
            <button
              onClick={handleRegenerateClick}
              disabled={isRegenerating || !currentIdea.trim()}
              className="h-24 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 rounded-lg transition-all flex flex-col items-center justify-center gap-2 min-w-[120px]"
            >
               {isRegenerating ? (
                 <>
                  <Loader2 size={20} className="animate-spin text-primary-500"/>
                  <span className="text-xs">Updating...</span>
                 </>
               ) : (
                 <>
                  <RefreshCw size={20} />
                  <span className="text-xs">Regenerate</span>
                 </>
               )}
            </button>
         </div>
         <p className="text-xs text-slate-500 mt-2">Modifying the concept and clicking regenerate will overwrite the fields below using AI.</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Edit3 className="text-primary-500" />
          Refine Technical Details
        </h2>
        <button onClick={onBack} className="text-slate-400 hover:text-white text-sm">
          Cancel & Restart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {isRegenerating && (
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl border border-slate-800">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-2xl flex flex-col items-center border border-slate-700">
               <Loader2 className="animate-spin text-primary-500 mb-4" size={40} />
               <p className="text-white font-semibold">Re-imagining Scene...</p>
            </div>
          </div>
        )}

        {/* Main Narrative Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <InputGroup 
              label="Subject Appearance" 
              value={formData.subject} 
              onChange={(v) => handleChange('subject', v)} 
              icon={User} 
              rows={3} 
            />
            <InputGroup 
              label="Outfit & Costume" 
              value={formData.outfit || ''} 
              onChange={(v) => handleChange('outfit', v)} 
              icon={Shirt} 
              rows={2} 
            />
            <InputGroup 
              label="Action & Movement" 
              value={formData.action} 
              onChange={(v) => handleChange('action', v)} 
              icon={Clapperboard} 
              rows={3} 
            />
            <InputGroup 
              label="Dialogue / Script" 
              value={formData.dialogue} 
              onChange={(v) => handleChange('dialogue', v)} 
              icon={MessageSquareQuote} 
              rows={2} 
            />
            <InputGroup 
              label="Environment & Setting" 
              value={formData.environment} 
              onChange={(v) => handleChange('environment', v)} 
              icon={Clapperboard} 
              rows={3} 
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
             <InputGroup 
              label="Mood & Atmosphere" 
              value={formData.mood} 
              onChange={(v) => handleChange('mood', v)} 
              icon={Lightbulb} 
             />
             <InputGroup 
              label="Visual Style" 
              value={formData.style} 
              onChange={(v) => handleChange('style', v)} 
              icon={Lightbulb} 
             />
          </div>
        </div>

        {/* Technical Column */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 mb-4">Camera & Lighting</h3>
            <InputGroup 
              label="Lighting Setup" 
              value={formData.lighting} 
              onChange={(v) => handleChange('lighting', v)} 
              icon={Lightbulb} 
              rows={2} 
            />
            <InputGroup 
              label="Camera Angle" 
              value={formData.camera_angle} 
              onChange={(v) => handleChange('camera_angle', v)} 
              icon={Camera} 
              rows={1} 
            />
            <InputGroup 
              label="Camera Movement" 
              value={formData.camera_movement} 
              onChange={(v) => handleChange('camera_movement', v)} 
              icon={Camera} 
              rows={1} 
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
             <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 mb-4">Output Settings</h3>
             <InputGroup 
              label="Audio Prompt" 
              value={formData.audio_prompt} 
              onChange={(v) => handleChange('audio_prompt', v)} 
              icon={Music} 
              rows={2} 
             />
             <div className="grid grid-cols-2 gap-4">
                <InputGroup 
                  label="Duration (s)" 
                  value={formData.duration_seconds} 
                  onChange={(v) => handleChange('duration_seconds', v)} 
                  icon={Clock} 
                  type="number" 
                />
                
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-semibold text-primary-400 uppercase tracking-wider flex items-center gap-2">
                    <Layout size={14} /> Aspect Ratio
                  </label>
                  <div className="relative">
                    <select
                      value={aspectRatios.includes(formData.aspect_ratio) ? formData.aspect_ratio : "custom"}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "custom") {
                           if (aspectRatios.includes(formData.aspect_ratio)) {
                             handleChange("aspect_ratio", "");
                           }
                        } else {
                          handleChange("aspect_ratio", val);
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="16:9">16:9 (Landscape)</option>
                      <option value="9:16">9:16 (Portrait)</option>
                      <option value="1:1">1:1 (Square)</option>
                      <option value="21:9">21:9 (Cinematic)</option>
                      <option value="custom">Custom / Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <ChevronDown size={16} />
                    </div>
                  </div>
                  
                  {!aspectRatios.includes(formData.aspect_ratio) && (
                    <input
                      type="text"
                      value={formData.aspect_ratio}
                      onChange={(e) => handleChange('aspect_ratio', e.target.value)}
                      placeholder="e.g. 2.35:1"
                      className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-colors animate-in fade-in slide-in-from-top-1"
                    />
                  )}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/80 backdrop-blur-lg border-t border-slate-800 flex justify-center z-50">
        <div className="w-full max-w-6xl flex justify-end gap-4">
           <button 
            onClick={onBack}
            className="px-6 py-3 rounded-xl text-slate-300 font-medium hover:bg-slate-800 transition-colors"
          >
            Back
          </button>
          <button 
            onClick={() => onConfirm(formData)}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-900/20 flex items-center gap-2 transition-transform hover:scale-105"
          >
            Generate Final JSON <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptEditor;
