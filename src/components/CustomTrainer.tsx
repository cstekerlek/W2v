import React, { useState } from 'react';
import { WordVector } from '../data/embeddingsData';
import {
  trainCustomWord2Vec,
  TrainingProgress,
  TrainedModelResult,
} from '../utils/nlpEngine';
import {
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Sliders,
  FileText,
  TrendingDown,
  BookOpen,
  Cpu,
  Layers,
} from 'lucide-react';

interface CustomTrainerProps {
  onModelTrained: (model: Record<string, WordVector> | null) => void;
  isCustomModelActive: boolean;
}

const PRESET_CORPORA = [
  {
    title: 'Yapay Zeka & Bilişim Külliyatı',
    description: 'Yapay zeka, derin öğrenme, python ve yazılım kavramları',
    text: `Yapay zeka ve makine öğrenmesi modern yazılım dünyasını hızla dönüştürüyor.
Python dili yapay zeka algoritmaları ve veri bilimi modelleri geliştirmek için en popüler araçtır.
Derin öğrenme sinir ağları büyük veri kümeleri üzerinde eğitilerek karmaşık örüntüleri öğrenir.
Bilgisayar mühendisliği yazılım algoritmaları ve veri yapıları üzerine odaklanır.
Gensim ve Word2Vec doğal dil işleme alanında kelime vektörleri üretmek için kullanılır.
Doğal dil işleme metinleri anlamsal vektör uzayına dönüştürerek kosinüs benzerliği hesaplar.
Veri bilimcileri python kütüphaneleri ile modeller eğitir ve bulut sunuculara dağıtır.`,
  },
  {
    title: 'Tarih, Hükümdarlık & Krallık Masalı',
    description: 'Kral, kraliçe, saray, taht ve soyluluk terimleri',
    text: `Kral büyük sarayda altın taht üzerinde oturur ve krallığı adaletle yönetir.
Kraliçe kralın yanında sarayda hüküm sürer ve halkına sevgiyle yaklaşır.
Prens genç ve cesur bir savaşçıdır, gelecekte tahta geçerek kral olacaktır.
Prenses sarayın bahçesinde çiçekler yetiştirir ve kraliçenin zarafetini taşır.
Vezir kral ve kraliçeye devlet işlerinde akıl verir, saray kurallarını düzenler.
Saray muhafızları tahtı ve krallığı düşman ordularına karşı cesurca korur.`,
  },
  {
    title: 'Doğa, Canlılar & Evren',
    description: 'Gezegenler, uzay, hayvanlar ve ekosistem ilişkileri',
    text: `Güneş sistemimizde dünya, mars, jüpiter gibi gezegenler güneş etrafında döner.
Astronomi evren, yıldızlar, galaksiler ve uzay boşluğunu inceleyen temel bilim dalıdır.
Kedi ve köpek evcil hayvanlar olarak insanların en sadık dostlarıdır.
Ormanda aslan, kaplan ve kurt gibi yırtıcı hayvanlar doğal dengeyi korur.
Kuşlar gökyüzünde kanat çırparak sıcak ülkelere doğru göç eder.
Doğadaki tüm canlılar su, güneş ışığı ve temiz hava ile hayatını sürdürür.`,
  },
];

export const CustomTrainer: React.FC<CustomTrainerProps> = ({
  onModelTrained,
  isCustomModelActive,
}) => {
  const [corpusText, setCorpusText] = useState(PRESET_CORPORA[0].text);
  const [vectorSize, setVectorSize] = useState(25);
  const [windowSize, setWindowSize] = useState(3);
  const [minCount, setMinCount] = useState(1);
  const [epochs, setEpochs] = useState(25);
  const [learningRate, setLearningRate] = useState(0.05);

  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState<TrainingProgress | null>(null);
  const [trainedResult, setTrainedResult] = useState<TrainedModelResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStartTraining = () => {
    setIsTraining(true);
    setErrorMessage(null);
    setProgress(null);

    // Run slightly asynchronously so UI can render spinner/progress
    setTimeout(() => {
      try {
        const result = trainCustomWord2Vec(
          corpusText,
          {
            vectorSize,
            windowSize,
            minCount,
            epochs,
            learningRate,
          },
          (p) => {
            setProgress(p);
          }
        );

        setTrainedResult(result);
        onModelTrained(result.vocab);
        setIsTraining(false);
      } catch (err: any) {
        setErrorMessage(err.message || 'Eğitim sırasında bir hata oluştu.');
        setIsTraining(false);
      }
    }, 100);
  };

  const handleResetToDefault = () => {
    onModelTrained(null);
    setTrainedResult(null);
    setProgress(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-fuchsia-400" />
              Tarayıcı İçi Özel Word2Vec Model Eğitimi (Skip-Gram)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Gensim'in arkasındaki Word2Vec eğitim döngüsünü canlı olarak çalıştırın: Kendi Türkçe metin külliyatınızı girin, hiperparametreleri ayarlayın ve model ağırlıklarının optimizasyonunu izleyin.
            </p>
          </div>

          {/* Active status indicator */}
          <div className="flex items-center gap-2">
            {isCustomModelActive ? (
              <div className="flex items-center gap-2 bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 px-3 py-1.5 rounded-xl text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-fuchsia-400" />
                <span>Özel Model Uygulamada Aktif</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                Varsayılan Genel Model Aktif
              </div>
            )}
          </div>
        </div>

        {/* Preset Corpora Selector */}
        <div className="pt-4 space-y-2">
          <span className="text-xs font-semibold text-slate-400">Hazır Eğitim Metinleri (Külliyat):</span>
          <div className="grid sm:grid-cols-3 gap-3">
            {PRESET_CORPORA.map((corpus, i) => (
              <button
                key={i}
                onClick={() => setCorpusText(corpus.text)}
                className={`p-3 rounded-xl border text-left transition ${
                  corpusText === corpus.text
                    ? 'bg-fuchsia-950/40 border-fuchsia-500/60 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-xs text-fuchsia-300">{corpus.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{corpus.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Text Input & Hyperparameters */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-fuchsia-400" />
                Eğitim Metni (Corpus)
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {corpusText.trim().split(/\s+/).length} Kelime
              </span>
            </div>
            <textarea
              value={corpusText}
              onChange={(e) => setCorpusText(e.target.value)}
              rows={8}
              placeholder="Buraya Türkçe eğitim metinlerinizi yapıştırabilirsiniz..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-fuchsia-500 rounded-xl p-4 text-xs font-mono text-slate-200 outline-none leading-relaxed"
            />
          </div>

          {/* Hyperparameters Controls */}
          <div className="space-y-4 bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-fuchsia-400" />
                Model Hiperparametreleri
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Gensim Word2Vec(...)</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Vector Size */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Vektör Boyutu (vector_size):</span>
                  <span className="font-mono text-fuchsia-400 font-bold">{vectorSize}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  step={5}
                  value={vectorSize}
                  onChange={(e) => setVectorSize(Number(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>

              {/* Window Size */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Pencere Boyutu (window):</span>
                  <span className="font-mono text-fuchsia-400 font-bold">±{windowSize}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={windowSize}
                  onChange={(e) => setWindowSize(Number(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>

              {/* Epochs */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Epok Sayısı (epochs):</span>
                  <span className="font-mono text-fuchsia-400 font-bold">{epochs}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={epochs}
                  onChange={(e) => setEpochs(Number(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>

              {/* Learning Rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Öğrenme Oranı (alpha):</span>
                  <span className="font-mono text-fuchsia-400 font-bold">{learningRate}</span>
                </div>
                <input
                  type="range"
                  min={0.01}
                  max={0.15}
                  step={0.01}
                  value={learningRate}
                  onChange={(e) => setLearningRate(Number(e.target.value))}
                  className="w-full accent-fuchsia-500"
                />
              </div>
            </div>
          </div>

          {/* Training Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartTraining}
              disabled={isTraining || !corpusText.trim()}
              className="flex-1 bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-900/30 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isTraining ? 'Model Eğitiliyor...' : 'Word2Vec Modelini Eğit'}</span>
            </button>

            {isCustomModelActive && (
              <button
                onClick={handleResetToDefault}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Sıfırla</span>
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Right Column: Training Progress & Metrics */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Eğitim İstatistikleri & Kayıp (Loss)
              </span>
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Kelime Dağarcığı (Vocab)</span>
                <span className="text-2xl font-black text-white font-mono">
                  {trainedResult ? trainedResult.vocabList.length : '-'}
                </span>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Eğitim Çiftleri (Skip-Gram)</span>
                <span className="text-2xl font-black text-white font-mono">
                  {trainedResult ? trainedResult.trainingPairsCount : '-'}
                </span>
              </div>
            </div>

            {/* Progress status */}
            {progress && (
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>
                    Epok: <b className="text-white">{progress.epoch} / {progress.totalEpochs}</b>
                  </span>
                  <span>
                    Kayıp (Loss): <b className="text-emerald-400 font-mono">{progress.loss.toFixed(4)}</b>
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-fuchsia-500 h-full rounded-full transition-all duration-200"
                    style={{ width: `${(progress.epoch / progress.totalEpochs) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Vocabulary pill list */}
            {trainedResult && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-400">
                  Öğrenilen Kelimeler ({trainedResult.vocabList.length}):
                </span>
                <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                  {trainedResult.vocabList.map((w) => (
                    <span
                      key={w}
                      className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-300 rounded font-mono"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gensim equivalence snippet */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
            <div className="text-[10px] text-slate-500 font-sans">GENSIM EŞDEĞER PYTHON KODU:</div>
            <div className="text-fuchsia-300">
              model = Word2Vec(sentences, vector_size={vectorSize}, window={windowSize}, epochs={epochs}, min_count={minCount})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
