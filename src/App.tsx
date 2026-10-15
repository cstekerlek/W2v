import React, { useState } from 'react';
import { WordVector } from './data/embeddingsData';
import { Playground } from './components/Playground';
import { VectorVisualizer } from './components/VectorVisualizer';
import { CustomTrainer } from './components/CustomTrainer';
import { ProjectExporter } from './components/ProjectExporter';
import { TheoryGuide } from './components/TheoryGuide';
import { SubmissionHelper } from './components/SubmissionHelper';
import {
  Compass,
  Layers,
  Cpu,
  FolderGit2,
  BookOpen,
  Award,
  Sparkles,
  ExternalLink,
  Code2,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'playground' | 'visualizer' | 'trainer' | 'exporter' | 'theory' | 'submission'
  >('playground');

  // Custom trained vocabulary state (null = use default comprehensive vocabulary)
  const [customVocab, setCustomVocab] = useState<Record<string, WordVector> | null>(null);
  const [highlightWordForMap, setHighlightWordForMap] = useState<string | null>(null);

  const handleSelectWordForMap = (word: string) => {
    setHighlightWordForMap(word);
    setActiveTab('visualizer');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-xl tracking-wider">
              W2V
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-white tracking-tight">
                  NLP Word2Vec & Gensim Studio
                </h1>
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Akademik Sürüm
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Doğal Dil İşleme, Vektör Benzerliği, Analoji Analizleri ve Flask/FastAPI GitHub-Vercel Dağıtım Kiti
              </p>
            </div>
          </div>

          {/* Quick Badges & Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {customVocab && (
              <div className="flex items-center gap-1.5 bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs px-2.5 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse" />
                <span className="font-semibold text-[11px]">Özel Eğitilen Model Aktif</span>
                <button
                  onClick={() => setCustomVocab(null)}
                  className="hover:text-white ml-1 text-slate-400"
                  title="Varsayılana Dön"
                >
                  ✕
                </button>
              </div>
            )}

            <button
              onClick={() => setActiveTab('exporter')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md shadow-blue-600/20 transition flex items-center gap-1.5"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>GitHub & Vercel Paketini İndir</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 border-t border-slate-850 py-1.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('playground')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'playground'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. Canlı NLP & Word2Vec Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('visualizer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'visualizer'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. 2D Vektör Uzayı Haritası (PCA)</span>
          </button>

          <button
            onClick={() => setActiveTab('trainer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'trainer'
                ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>3. Özel Model Eğitimi (Skip-Gram)</span>
          </button>

          <button
            onClick={() => setActiveTab('exporter')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'exporter'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>4. GitHub & Vercel Dağıtım Kiti</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'theory'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>5. NLP & Gensim Ders Notları</span>
          </button>

          <button
            onClick={() => setActiveTab('submission')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'submission'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>6. Ödev Teslim Asistanı</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'playground' && (
          <Playground
            customVocab={customVocab}
            onSelectWordForMap={handleSelectWordForMap}
          />
        )}

        {activeTab === 'visualizer' && (
          <VectorVisualizer
            customVocab={customVocab}
            highlightWord={highlightWordForMap}
          />
        )}

        {activeTab === 'trainer' && (
          <CustomTrainer
            onModelTrained={(m) => setCustomVocab(m)}
            isCustomModelActive={!!customVocab}
          />
        )}

        {activeTab === 'exporter' && <ProjectExporter />}

        {activeTab === 'theory' && <TheoryGuide />}

        {activeTab === 'submission' && <SubmissionHelper />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-12 text-slate-500 text-xs text-center space-y-2">
        <p className="font-medium text-slate-400">
          Doğal Dil İşleme (NLP) & Gensim Word2Vec Üniversite Ödevi Geliştirme Platformu
        </p>
        <p className="text-[11px] text-slate-500">
          Gensim Word2Vec • Flask 3.x • FastAPI • Vercel Serverless Functions • Kosinüs Benzerliği • Vektör Analojileri
        </p>
      </footer>
    </div>
  );
}
