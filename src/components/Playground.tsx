import React, { useState } from 'react';
import {
  WORD_EMBEDDINGS,
  PRESET_ANALOGIES,
  PRESET_ODD_ONE_OUT,
  WordVector,
} from '../data/embeddingsData';
import {
  cosineSimilarity,
  computeAnalogy,
  findMostSimilar,
  findOddOneOut,
  computeSentenceSimilarity,
  SimilarityResult,
} from '../utils/nlpEngine';
import {
  Compass,
  Sparkles,
  GitCompare,
  Search,
  Filter,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Cpu,
} from 'lucide-react';

interface PlaygroundProps {
  customVocab?: Record<string, WordVector> | null;
  onSelectWordForMap?: (word: string) => void;
}

export const Playground: React.FC<PlaygroundProps> = ({
  customVocab,
  onSelectWordForMap,
}) => {
  const activeVocab = customVocab || WORD_EMBEDDINGS;
  const vocabWords = Object.keys(activeVocab);

  // Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<
    'similarity' | 'analogy' | 'most_similar' | 'odd_one_out' | 'sentences'
  >('similarity');

  // 1. Similarity State
  const [word1, setWord1] = useState('kral');
  const [word2, setWord2] = useState('kraliçe');

  // 2. Analogy State
  const [analogyA, setAnalogyA] = useState('kral');
  const [analogyB, setAnalogyB] = useState('erkek');
  const [analogyC, setAnalogyC] = useState('kadın');

  // 3. Most Similar State
  const [searchTarget, setSearchTarget] = useState('doktor');
  const [topK, setTopK] = useState(6);

  // 4. Odd One Out State
  const [oddInput, setOddInput] = useState('elma, armut, muz, bilgisayar');

  // 5. Sentences State
  const [sentence1, setSentence1] = useState('Yapay zeka ve bilgisayar yazılımı geliştiriyoruz.');
  const [sentence2, setSentence2] = useState('Python ile kodlama ve algoritma üzerine çalışıyoruz.');

  // Calculations
  // Similarity
  const v1 = activeVocab[word1.toLowerCase().trim()];
  const v2 = activeVocab[word2.toLowerCase().trim()];
  const similarityScore = v1 && v2 ? cosineSimilarity(v1.vector, v2.vector) : null;
  const thetaDegrees = similarityScore !== null ? Math.acos(similarityScore) * (180 / Math.PI) : null;

  // Analogy
  const analogyResult = computeAnalogy(analogyA, analogyB, analogyC, 5, activeVocab);

  // Most Similar
  const mostSimilarList: SimilarityResult[] = searchTarget && activeVocab[searchTarget.toLowerCase().trim()]
    ? findMostSimilar(searchTarget, topK, [searchTarget], activeVocab)
    : [];

  // Odd one out
  const oddList = oddInput.split(/[,;\s]+/).map((s) => s.trim()).filter(Boolean);
  const oddResult = oddList.length >= 3 ? findOddOneOut(oddList, activeVocab) : null;

  // Sentence similarity
  const sentenceResult = computeSentenceSimilarity(sentence1, sentence2, activeVocab);

  return (
    <div className="space-y-6">
      {/* Sub navigation pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveSubTab('similarity')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeSubTab === 'similarity'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          <span>Kosinüs Benzerliği</span>
        </button>

        <button
          onClick={() => setActiveSubTab('analogy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeSubTab === 'analogy'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Vektör Analojisi (Word Math)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('most_similar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeSubTab === 'most_similar'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>En Benzer Kelimeler (Top-N)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('odd_one_out')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeSubTab === 'odd_one_out'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Farklı Olanı Bul (doesnt_match)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sentences')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeSubTab === 'sentences'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Cümle Semantik Uyumu</span>
        </button>
      </div>

      {/* 1. KOSİNÜS BENZERLİĞİ BÖLÜMÜ */}
      {activeSubTab === 'similarity' && (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-blue-400" />
                  Kelimeler Arası Semantik Kosinüs Benzerliği
                </h3>
                <span className="text-xs text-slate-400 font-mono">Gensim: model.wv.similarity(w1, w2)</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                İki kelime vektörünün 50 boyutlu gizil uzaydaki açısını (cos θ) hesaplar. 1.0 tam anlamsal özdeşlik, 0.0 ortogonallik (ilgisizlik), negatif değerler ise zıtlığı temsil eder.
              </p>
            </div>

            {/* Inputs */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">1. Kelime</label>
                <div className="relative">
                  <input
                    type="text"
                    value={word1}
                    onChange={(e) => setWord1(e.target.value)}
                    list="vocab-list"
                    placeholder="Örn: kral"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-medium text-white outline-none"
                  />
                  {v1 && (
                    <span className="absolute right-3 top-3 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono">
                      {v1.category}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">2. Kelime</label>
                <div className="relative">
                  <input
                    type="text"
                    value={word2}
                    onChange={(e) => setWord2(e.target.value)}
                    list="vocab-list"
                    placeholder="Örn: kraliçe"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm font-medium text-white outline-none"
                  />
                  {v2 && (
                    <span className="absolute right-3 top-3 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono">
                      {v2.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Test Presets */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-400">Hızlı Test Çiftleri:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  ['kral', 'kraliçe', 'Yüksek Benzerlik (Soyluluk)'],
                  ['ankara', 'türkiye', 'Başkent & Ülke'],
                  ['doktor', 'hastane', 'Meslek & Kurum'],
                  ['kedi', 'köpek', 'Evcil Hayvanlar'],
                  ['mutlu', 'sevinç', 'Eşanlamlı Duygular'],
                  ['bilgisayar', 'elma', 'Düşük Benzerlik (Çapraz Alan)'],
                  ['mutlu', 'mutsuz', 'Zıt Duygular'],
                ].map(([wA, wB, label]) => (
                  <button
                    key={`${wA}-${wB}`}
                    onClick={() => {
                      setWord1(wA);
                      setWord2(wB);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                      word1 === wA && word2 === wB
                        ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {wA} ↔ {wB}
                  </button>
                ))}
              </div>
            </div>

            {/* Mathematical Formula Preview */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1">
              <div className="text-slate-500 text-[11px] font-sans">KULLANILAN FORMÜL:</div>
              <div className="text-blue-300 font-semibold">
                cos(θ) = (u · v) / (||u|| * ||v||)
              </div>
              <div className="text-slate-400 text-[11px]">
                Python / Gensim: <code className="text-emerald-400">similarity = float(model.wv.similarity('{word1}', '{word2}'))</code>
              </div>
            </div>
          </div>

          {/* Similarity Score Card & Gauge */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Analiz Sonucu
                </span>
                {similarityScore !== null && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      similarityScore > 0.7
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : similarityScore > 0.35
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : similarityScore > 0
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {similarityScore > 0.7
                      ? 'Çok Güçlü İlişki'
                      : similarityScore > 0.35
                      ? 'Orta Düzey İlişki'
                      : similarityScore > 0
                      ? 'Zayıf / Nötr'
                      : 'Zıt / Negatif Korelasyon'}
                  </span>
                )}
              </div>

              {similarityScore !== null ? (
                <div className="text-center py-6 space-y-4">
                  {/* Big Number */}
                  <div>
                    <div className="text-5xl font-black tracking-tight text-white">
                      {(similarityScore * 100).toFixed(1)}
                      <span className="text-2xl font-light text-slate-400">%</span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-1">
                      Kosinüs Skoru: <span className="text-blue-400 font-bold">{similarityScore.toFixed(4)}</span>
                    </div>
                  </div>

                  {/* Progress Bar / Visual Meter */}
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        similarityScore > 0.6
                          ? 'bg-emerald-500'
                          : similarityScore > 0.3
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{
                        width: `${Math.max(0, Math.min(100, ((similarityScore + 1) / 2) * 100))}%`,
                      }}
                    />
                  </div>

                  {/* Geometric Angle Insight */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Vektörler Arası Açı (θ):</span>
                      <span className="font-mono font-bold text-white">
                        {thetaDegrees !== null ? `${thetaDegrees.toFixed(1)}°` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>1. Kelime Boyutu:</span>
                      <span className="font-mono text-slate-300">50 Boyutlu Normalizeli</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>2. Kelime Boyutu:</span>
                      <span className="font-mono text-slate-300">50 Boyutlu Normalizeli</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <AlertCircle className="w-10 h-10 mx-auto text-amber-500/60" />
                  <p className="text-sm font-medium text-slate-300">Kelime bulunamadı</p>
                  <p className="text-xs text-slate-500">
                    Sözlükteki kelimelerden birini seçiniz veya Model Eğitimi sekmesinden kendi metninizi yükleyiniz.
                  </p>
                </div>
              )}
            </div>

            {onSelectWordForMap && (
              <button
                onClick={() => onSelectWordForMap(word1)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
              >
                <span>🗺️ Bu Kelimeleri 2D Vektör Haritasında Gör</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. VEKTÖR ANALOJİSİ (WORD MATH) BÖLÜMÜ */}
      {activeSubTab === 'analogy' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-400" />
                Vektör Analojisi & Doğrusal Anlamsal Cebir (Linear Semantic Algebra)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Word2Vec'in en devrimsel özelliği: Kelimeler arasındaki anlamsal ilişkiler latent vektör uzayında yön ve uzunluk olarak saklanır.
              </p>
            </div>
            <span className="text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-800/80 px-3 py-1.5 rounded-lg font-mono">
              model.wv.most_similar(positive=[A, C], negative=[B])
            </span>
          </div>

          {/* Analogy Formula Equation Builder */}
          <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
            <div className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              Analoji Denklemi
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
              {/* Word A */}
              <div className="md:col-span-2">
                <label className="text-[11px] font-medium text-emerald-400 mb-1 block">
                  + Pozitif Kelime A
                </label>
                <input
                  type="text"
                  value={analogyA}
                  onChange={(e) => setAnalogyA(e.target.value)}
                  placeholder="kral"
                  className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-4 py-2.5 text-sm font-semibold text-white outline-none focus:border-emerald-400"
                />
              </div>

              {/* Minus Sign */}
              <div className="text-center font-bold text-2xl text-rose-400">-</div>

              {/* Word B */}
              <div className="md:col-span-1">
                <label className="text-[11px] font-medium text-rose-400 mb-1 block">
                  - Negatif B
                </label>
                <input
                  type="text"
                  value={analogyB}
                  onChange={(e) => setAnalogyB(e.target.value)}
                  placeholder="erkek"
                  className="w-full bg-slate-900 border border-rose-500/40 rounded-xl px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-rose-400"
                />
              </div>

              {/* Plus Sign */}
              <div className="text-center font-bold text-2xl text-emerald-400">+</div>

              {/* Word C */}
              <div className="md:col-span-1">
                <label className="text-[11px] font-medium text-emerald-400 mb-1 block">
                  + Pozitif C
                </label>
                <input
                  type="text"
                  value={analogyC}
                  onChange={(e) => setAnalogyC(e.target.value)}
                  placeholder="kadın"
                  className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-emerald-400"
                />
              </div>

              {/* Equals Sign */}
              <div className="text-center font-bold text-2xl text-indigo-400">=</div>

              {/* Expected Result */}
              <div className="md:col-span-1 bg-indigo-950/40 border border-indigo-500/40 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-indigo-300 block font-medium">Hedef Çıkarım</span>
                <span className="text-base font-extrabold text-indigo-200">
                  {analogyResult.candidates[0]?.word || '?'}
                </span>
              </div>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">Klasik Test Analojileri:</span>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {PRESET_ANALOGIES.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAnalogyA(p.wordA);
                    setAnalogyB(p.wordB);
                    setAnalogyC(p.wordC);
                  }}
                  className={`p-3 text-left rounded-xl border transition ${
                    analogyA === p.wordA && analogyB === p.wordB && analogyC === p.wordC
                      ? 'bg-indigo-950/60 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-indigo-300">{p.description}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    {p.wordA} - {p.wordB} + {p.wordC} = <b className="text-emerald-400">{p.expected}</b>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Results List */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Modelin En Yüksek Olasılıklı Tahminleri (Nearest Vectors)</span>
              <span className="text-indigo-400 font-mono">cos(V_target, V_candidate)</span>
            </h4>

            {analogyResult.error ? (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{analogyResult.error}</span>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {analogyResult.candidates.map((cand, idx) => (
                  <div
                    key={cand.word}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      idx === 0
                        ? 'bg-indigo-900/30 border-indigo-500/60 shadow-lg shadow-indigo-950/50'
                        : 'bg-slate-900/50 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0 ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-white capitalize">{cand.word}</div>
                        <div className="text-[10px] text-slate-400">{cand.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        {(cand.similarity * 100).toFixed(1)}%
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {cand.similarity.toFixed(4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. EN BENZER KELİMELER (TOP-N) BÖLÜMÜ */}
      {activeSubTab === 'most_similar' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-400" />
                En Benzer Kelimeler & Semantik Komşuluk (Top-N Most Similar)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Gensim'in <code className="text-emerald-300">model.wv.most_similar(word, topn=k)</code> metodunun canlı simülasyonu.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Listelenecek Sayı (k):</span>
              <select
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none"
              >
                <option value={4}>Top 4</option>
                <option value={6}>Top 6</option>
                <option value={10}>Top 10</option>
                <option value={15}>Top 15</option>
              </select>
            </div>
          </div>

          {/* Search Input and Suggestions */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTarget}
                onChange={(e) => setSearchTarget(e.target.value)}
                placeholder="Örnek kelime girin (örn: doktor, türkiye, bilgisayar, kedi)..."
                list="vocab-list"
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-white outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-slate-400 mr-1">Örnekler:</span>
              {['doktor', 'türkiye', 'bilgisayar', 'kedi', 'mutlu', 'uçak', 'matematik', 'elma'].map((w) => (
                <button
                  key={w}
                  onClick={() => setSearchTarget(w)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition ${
                    searchTarget.toLowerCase() === w
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              "{searchTarget}" İle En Yüksek Benzerliğe Sahip Kelimeler:
            </h4>

            {mostSimilarList.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {mostSimilarList.map((res, i) => (
                  <div
                    key={res.word}
                    className="bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 rounded-xl p-4 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold flex items-center justify-center">
                          #{i + 1}
                        </span>
                        <span className="font-bold text-white capitalize">{res.word}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {(res.similarity * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full"
                        style={{ width: `${Math.max(0, res.similarity * 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>{res.category}</span>
                      <span className="font-mono text-[10px] text-slate-500">
                        {res.similarity.toFixed(4)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                "{searchTarget}" kelimesi sözlükte bulunamadı. Lütfen listeden bir kelime seçiniz.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. FARKLI OLANI BUL (DOESNT_MATCH) BÖLÜMÜ */}
      {activeSubTab === 'odd_one_out' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-amber-400" />
              Anlamsal Aykırı Kelime Tespiti (Outlier Detection)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Gensim'deki <code className="text-amber-300">model.wv.doesnt_match(words)</code> metodu, kümedeki tüm kelimelerin ağırlık merkezini (centroid) hesaplayarak diğerlerine en uzak olan aykırı kelimeyi saptar.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kelime Grubu (Virgülle ayırarak en az 3 kelime girin):
              </label>
              <input
                type="text"
                value={oddInput}
                onChange={(e) => setOddInput(e.target.value)}
                placeholder="elma, armut, muz, bilgisayar"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm font-medium text-white outline-none"
              />
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-400">Hazır Test Örnekleri:</span>
              {PRESET_ODD_ONE_OUT.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setOddInput(item.words.join(', '))}
                  className="text-xs px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 transition"
                >
                  {item.category}: <span className="font-mono text-amber-300">{item.words.join(', ')}</span>
                </button>
              ))}
            </div>

            {/* Results */}
            {oddResult?.error ? (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{oddResult.error}</span>
              </div>
            ) : oddResult?.oddWord ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Gensim Analiz Çıktısı
                  </span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-500/30">
                    Aykırı Kelime Tespit Edildi
                  </span>
                </div>

                <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs text-amber-400 font-medium">Gruptan Ayrılan Kelime:</div>
                    <div className="text-2xl font-black text-white capitalize mt-0.5">
                      {oddResult.oddWord}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono">
                      model.wv.doesnt_match({JSON.stringify(oddList)})
                    </span>
                  </div>
                </div>

                {/* Breakdown list */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-slate-400">
                    Kelimelerin Küme İçi Ortalama Benzerlikleri:
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {oddResult.details.map((d) => {
                      const isOutlier = d.word === oddResult.oddWord;
                      return (
                        <div
                          key={d.word}
                          className={`p-3 rounded-xl border flex items-center justify-between ${
                            isOutlier
                              ? 'bg-rose-950/30 border-rose-500/50'
                              : 'bg-slate-900 border-slate-800'
                          }`}
                        >
                          <span className={`text-sm font-bold ${isOutlier ? 'text-rose-300' : 'text-slate-200'}`}>
                            {d.word} {isOutlier && '⚠️ (En Düşük Uyum)'}
                          </span>
                          <span className="font-mono text-xs text-slate-400">
                            Ort. Benzerlik: <b className="text-white">{(d.averageSimilarity * 100).toFixed(1)}%</b>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 5. CÜMLE ANLAMSAL BENZERLİĞİ BÖLÜMÜ */}
      {activeSubTab === 'sentences' && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Cümle & Doküman Düzeyinde Anlamsal Karşılaştırma
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Doğal dildeki iki cümlenin kelime gömmelerini (embedding centroid) birleştirerek anlamsal örtüşme oranını ölçer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-purple-300">1. Cümle</label>
              <textarea
                value={sentence1}
                onChange={(e) => setSentence1(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-100 outline-none"
              />
              <div className="text-[11px] text-slate-400">
                Eşleşen Kelimeler: {sentenceResult.matchedCount1} / {sentenceResult.tokens1.length}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-purple-300">2. Cümle</label>
              <textarea
                value={sentence2}
                onChange={(e) => setSentence2(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-100 outline-none"
              />
              <div className="text-[11px] text-slate-400">
                Eşleşen Kelimeler: {sentenceResult.matchedCount2} / {sentenceResult.tokens2.length}
              </div>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            {[
              [
                'Yapay zeka ve bilgisayar yazılımı geliştiriyoruz.',
                'Python ile kodlama ve algoritma üzerine çalışıyoruz.',
                'Teknoloji (Yüksek Uyum)',
              ],
              [
                'Doktor hastanede hastaları tedavi eder.',
                'Öğretmen okulda öğrencilere yeni bilgiler öğretir.',
                'Meslekler & Kurumlar (Orta Uyum)',
              ],
              [
                'Evde kedi ve köpek beslemeyi çok seviyorum.',
                'Yeni aldığımız araba otoyolda çok hızlı gidiyor.',
                'Farklı Konular (Düşük Uyum)',
              ],
            ].map(([s1, s2, tag], i) => (
              <button
                key={i}
                onClick={() => {
                  setSentence1(s1);
                  setSentence2(s2);
                }}
                className="text-xs px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 transition"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Score Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 text-center space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Anlamsal Benzerlik Skoru
            </div>
            <div className="text-4xl font-black text-purple-400">
              {(sentenceResult.similarity * 100).toFixed(1)}%
            </div>
            <div className="w-full max-w-md mx-auto bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, sentenceResult.similarity * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto pt-2">
              Kelime torbası vektörlerinin ortalaması (Centroid Averaging) yöntemi ile hesaplanmıştır.
            </p>
          </div>
        </div>
      )}

      {/* Datalist for autocomplete */}
      <datalist id="vocab-list">
        {vocabWords.map((w) => (
          <option key={w} value={w}>
            {activeVocab[w].category}
          </option>
        ))}
      </datalist>
    </div>
  );
};
