
import React, { useState, useCallback } from 'react';
import { VideoPromptData, AppStep } from './types';
import { generateTechnicalPrompt } from './services/geminiService';
import { saveHistoryItem } from './services/historyService';
import IdeaInput from './components/IdeaInput';
import PromptEditor from './components/PromptEditor';
import JsonResult from './components/JsonResult';
import HistoryView from './components/HistoryView';
import { Video, FileJson, History as HistoryIcon } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.IDEA_INPUT);
  const [promptData, setPromptData] = useState<VideoPromptData | null>(null);
  const [currentUserIdea, setCurrentUserIdea] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string | undefined>(undefined);
  
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIdeaSubmit = useCallback(async (idea: string, imageBase64?: string) => {
    setLoading(true);
    setError(null);
    setCurrentUserIdea(idea);
    setCurrentImage(imageBase64); // Store image for context

    try {
      const generatedData = await generateTechnicalPrompt(idea, imageBase64);
      setPromptData(generatedData);
      
      // Save to history immediately after generation
      saveHistoryItem(idea, generatedData, imageBase64);
      
      setStep(AppStep.EDIT_DETAILS);
    } catch (err) {
      console.error(err);
      setError("Failed to generate prompt. Please try again or check your API key.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRegeneratePrompt = useCallback(async (newIdea: string) => {
    setRegenerating(true);
    setError(null);
    setCurrentUserIdea(newIdea);
    // We keep the currentImage if it exists, allowing the user to refine the prompt based on the same image
    
    try {
      const generatedData = await generateTechnicalPrompt(newIdea, currentImage);
      setPromptData(generatedData);
      
      // Save the refined version to history
      saveHistoryItem(newIdea, generatedData, currentImage);
    } catch (err) {
      console.error(err);
      setError("Failed to regenerate prompt.");
    } finally {
      setRegenerating(false);
    }
  }, [currentImage]);

  const handleConfirmDetails = useCallback((data: VideoPromptData) => {
    setPromptData(data);
    setStep(AppStep.JSON_RESULT);
  }, []);

  const handleRestart = useCallback(() => {
    setStep(AppStep.IDEA_INPUT);
    setPromptData(null);
    setCurrentUserIdea("");
    setCurrentImage(undefined);
    setError(null);
  }, []);

  const handleViewHistory = useCallback(() => {
    setStep(AppStep.HISTORY);
    setError(null);
  }, []);

  const handleHistorySelect = useCallback((data: VideoPromptData) => {
    setPromptData(data);
    // We don't easily have the original idea text stored in promptData, 
    // but usually the history item has it. 
    // NOTE: Ideally, we'd pass the full history item back, but for now we just proceed to edit.
    setStep(AppStep.EDIT_DETAILS);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-primary-500/30">
      {/* Global Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity" 
            onClick={handleRestart}
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
               <Video className="text-white" size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight">Veo<span className="text-primary-400">Script</span></span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
             <div 
                onClick={() => setStep(AppStep.IDEA_INPUT)}
                className={`flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors ${step === AppStep.IDEA_INPUT ? 'text-white' : ''}`}
              >
               <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">1</span> Idea
             </div>
             <div className={`w-8 h-px bg-slate-800`}></div>
             <div className={`flex items-center gap-2 ${step === AppStep.EDIT_DETAILS ? 'text-white' : ''}`}>
               <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">2</span> Refine
             </div>
             <div className={`w-8 h-px bg-slate-800`}></div>
             <div className={`flex items-center gap-2 ${step === AppStep.JSON_RESULT ? 'text-white' : ''}`}>
               <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">3</span> JSON
             </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
             <button 
              onClick={handleViewHistory}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs"
             >
               <HistoryIcon size={14} /> History
             </button>
             <a href="#" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs">
              <FileJson size={14} /> API Docs
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-start min-h-[calc(100vh-64px)]">
        {error && (
          <div className="w-full max-w-lg mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {step === AppStep.IDEA_INPUT && (
          <IdeaInput 
            onSubmit={handleIdeaSubmit} 
            onViewHistory={handleViewHistory}
            isGenerating={loading} 
          />
        )}

        {step === AppStep.HISTORY && (
          <HistoryView 
            onSelect={handleHistorySelect} 
            onBack={handleRestart} 
          />
        )}

        {step === AppStep.EDIT_DETAILS && promptData && (
          <PromptEditor 
            initialData={promptData}
            userIdea={currentUserIdea}
            onConfirm={handleConfirmDetails} 
            onBack={handleRestart}
            onRegenerate={handleRegeneratePrompt}
            isRegenerating={regenerating}
          />
        )}

        {step === AppStep.JSON_RESULT && promptData && (
          <JsonResult 
            data={promptData} 
            onRestart={handleRestart}
            onBackToEdit={() => setStep(AppStep.EDIT_DETAILS)}
          />
        )}
      </main>
    </div>
  );
};

export default App;
