import React, { useState, useMemo, useRef, useEffect } from 'react';
import { WORD_EMBEDDINGS, WordVector } from '../data/embeddingsData';
import { projectVectorsPCA, cosineSimilarity, ProjectedPoint } from '../utils/nlpEngine';
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';

interface VectorVisualizerProps {
  customVocab?: Record<string, WordVector> | null;
  highlightWord?: string | null;
}

export const VectorVisualizer: React.FC<VectorVisualizerProps> = ({
  customVocab,
  highlightWord,
}) => {
  const activeVocab = customVocab || WORD_EMBEDDINGS;
  const wordList = useMemo(() => Object.values(activeVocab), [activeVocab]);

  // Extract all categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    wordList.forEach((w) => set.add(w.category));
    return Array.from(set);
  }, [wordList]);

  // Selected categories filter
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(highlightWord || 'kral');
  const [showAnalogyVector, setShowAnalogyVector] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Update selectedWord when prop changes
  useEffect(() => {
    if (highlightWord) setSelectedWord(highlightWord);
  }, [highlightWord]);

  // Project via PCA
  const projectedPoints = useMemo(() => {
    return projectVectorsPCA(wordList);
  }, [wordList]);

  // Color mapping per category
  const categoryColors: Record<string, { bg: string; border: string; text: string; hex: string }> = {
    'Hükümdarlık & Soyluluk': { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400', hex: '#f59e0b' },
    'Aile & Akrabalık': { bg: 'bg-rose-500/20', border: 'border-rose-500', text: 'text-rose-400', hex: '#f43f5e' },
    'Coğrafya & Şehirler': { bg: 'bg-cyan-500/20', border: 'border-cyan-500', text: 'text-cyan-400', hex: '#06b6d4' },
    'Teknoloji & Bilişim': { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400', hex: '#3b82f6' },
    'Yiyecek & İçecek': { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', hex: '#f97316' },
    'Hayvanlar & Doğa': { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400', hex: '#10b981' },
    'Duygular': { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', hex: '#a855f7' },
    'Meslekler & Kurumlar': { bg: 'bg-indigo-500/20', border: 'border-indigo-500', text: 'text-indigo-400', hex: '#6366f1' },
    'Bilim & Eğitim': { bg: 'bg-teal-500/20', border: 'border-teal-500', text: 'text-teal-400', hex: '#14b8a6' },
    'Ulaşım & Araçlar': { bg: 'bg-sky-500/20', border: 'border-sky-500', text: 'text-sky-400', hex: '#0284c7' },
    'Özel Model': { bg: 'bg-fuchsia-500/20', border: 'border-fuchsia-500', text: 'text-fuchsia-400', hex: '#d946ef' },
  };

  const getPointColor = (cat: string) => {
    return (
      categoryColors[cat] || {
        bg: 'bg-slate-500/20',
        border: 'border-slate-500',
        text: 'text-slate-300',
        hex: '#94a3b8',
      }
    );
  };

  // Filtered points
  const visiblePoints = useMemo(() => {
    if (selectedCats.length === 0) return projectedPoints;
    return projectedPoints.filter((p) => selectedCats.includes(p.category));
  }, [projectedPoints, selectedCats]);

  // Find nearest neighbors to selected word
  const activeSelectedPoint = useMemo(() => {
    return projectedPoints.find((p) => p.word.toLowerCase() === selectedWord?.toLowerCase());
  }, [projectedPoints, selectedWord]);

  const nearestToSelected = useMemo(() => {
    if (!selectedWord || !activeVocab[selectedWord]) return [];
    const targetVec = activeVocab[selectedWord].vector;

    return visiblePoints
      .filter((p) => p.word.toLowerCase() !== selectedWord.toLowerCase())
      .map((p) => ({
        point: p,
        sim: cosineSimilarity(targetVec, activeVocab[p.word]?.vector || []),
      }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, 4);
  }, [selectedWord, activeVocab, visiblePoints]);

  // Classical Analogy vector pairs for visualization (kral-erkek and kraliçe-kadın)
  const analogyVectorPairs = [
    { from: 'erkek', to: 'kral', label: 'Cinsiyet -> Liderlik' },
    { from: 'kadın', to: 'kraliçe', label: 'Cinsiyet -> Liderlik' },
    { from: 'türkiye', to: 'ankara', label: 'Ülke -> Başkent' },
    { from: 'fransa', to: 'paris', label: 'Ülke -> Başkent' },
  ];

  const getCanvasCoords = (normX: number, normY: number, width: number, height: number) => {
    // Map -1..1 to screen coordinates with padding, zoom, and pan
    const centerX = width / 2 + panOffset.x;
    const centerY = height / 2 + panOffset.y;
    const scale = (Math.min(width, height) / 2) * 0.75 * zoomLevel;

    return {
      x: centerX + normX * scale,
      y: centerY + normY * scale,
    };
  };

  // SVG Canvas dimensions
  const svgWidth = 800;
  const svgHeight = 560;

  const toggleCategory = (cat: string) => {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Controls */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              2D PCA Vektör Uzayı İzdüşümü (Dimensionality Reduction)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              50 boyutlu yüksek mertebeli Word2Vec latent uzayı, Temel Bileşen Analizi (PCA) ile 2 boyuta indirgenerek semantik kümelerin geometrisi görselleştirilmiştir.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAnalogyVector(!showAnalogyVector)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition ${
                showAnalogyVector
                  ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span>{showAnalogyVector ? '✓' : '○'} Analoji Vektör Okları</span>
            </button>

            <button
              onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
              className="p-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg"
              title="Yakınlaştır"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
              className="p-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg"
              title="Uzaklaştır"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              className="p-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg"
              title="Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="pt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-2">Semantik Kümeler:</span>
          <button
            onClick={() => setSelectedCats([])}
            className={`text-xs px-2.5 py-1 rounded-full font-medium border transition ${
              selectedCats.length === 0
                ? 'bg-slate-100 text-slate-950 border-white'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Tümü ({projectedPoints.length})
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCats.includes(cat);
            const color = getPointColor(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium border transition flex items-center gap-1.5 ${
                  isSelected
                    ? `${color.bg} ${color.border} ${color.text}`
                    : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color.hex }}
                />
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Vector Space Canvas & Sidebar */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-2 relative overflow-hidden shadow-2xl">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto cursor-crosshair select-none"
            style={{ maxHeight: '620px' }}
          >
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
              <marker
                id="arrowhead-analogy"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#818cf8" />
              </marker>
            </defs>
            <rect width={svgWidth} height={svgHeight} fill="#090d16" />
            <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />

            {/* Principal Axes */}
            <line
              x1={0}
              y1={svgHeight / 2 + panOffset.y}
              x2={svgWidth}
              y2={svgHeight / 2 + panOffset.y}
              stroke="#334155"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <line
              x1={svgWidth / 2 + panOffset.x}
              y1={0}
              x2={svgWidth / 2 + panOffset.x}
              y2={svgHeight}
              stroke="#334155"
              strokeDasharray="4 4"
              strokeWidth="1"
            />

            <text x="15" y={svgHeight / 2 + panOffset.y - 8} fill="#64748b" fontSize="10" fontFamily="monospace">
              ← 1. Temel Bileşen (PC1) →
            </text>
            <text
              x={svgWidth / 2 + panOffset.x + 8}
              y="20"
              fill="#64748b"
              fontSize="10"
              fontFamily="monospace"
            >
              ↑ 2. Temel Bileşen (PC2)
            </text>

            {/* Analogy Vector Direction Arrows */}
            {showAnalogyVector &&
              analogyVectorPairs.map((pair, idx) => {
                const ptFrom = projectedPoints.find((p) => p.word === pair.from);
                const ptTo = projectedPoints.find((p) => p.word === pair.to);
                if (!ptFrom || !ptTo) return null;

                const cFrom = getCanvasCoords(ptFrom.x, ptFrom.y, svgWidth, svgHeight);
                const cTo = getCanvasCoords(ptTo.x, ptTo.y, svgWidth, svgHeight);

                return (
                  <g key={idx}>
                    <line
                      x1={cFrom.x}
                      y1={cFrom.y}
                      x2={cTo.x}
                      y2={cTo.y}
                      stroke="#818cf8"
                      strokeWidth="2.5"
                      strokeDasharray="3 3"
                      markerEnd="url(#arrowhead-analogy)"
                    />
                    <text
                      x={(cFrom.x + cTo.x) / 2 + 5}
                      y={(cFrom.y + cTo.y) / 2 - 5}
                      fill="#a5b4fc"
                      fontSize="9"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                    >
                      Δv ({pair.from} → {pair.to})
                    </text>
                  </g>
                );
              })}

            {/* Nearest neighbor lines from selected word */}
            {activeSelectedPoint &&
              nearestToSelected.map(({ point, sim }) => {
                const cCenter = getCanvasCoords(activeSelectedPoint.x, activeSelectedPoint.y, svgWidth, svgHeight);
                const cOther = getCanvasCoords(point.x, point.y, svgWidth, svgHeight);

                return (
                  <line
                    key={point.word}
                    x1={cCenter.x}
                    y1={cCenter.y}
                    x2={cOther.x}
                    y2={cOther.y}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeOpacity={Math.max(0.2, sim)}
                    strokeDasharray="2 2"
                  />
                );
              })}

            {/* Word Points */}
            {visiblePoints.map((pt) => {
              const coords = getCanvasCoords(pt.x, pt.y, svgWidth, svgHeight);
              const isSelected = selectedWord?.toLowerCase() === pt.word.toLowerCase();
              const color = getPointColor(pt.category);

              return (
                <g
                  key={pt.word}
                  transform={`translate(${coords.x}, ${coords.y})`}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => setSelectedWord(pt.word)}
                >
                  {/* Selected glowing ring */}
                  {isSelected && (
                    <circle
                      r="16"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                      className="animate-spin"
                    />
                  )}

                  {/* Dot */}
                  <circle
                    r={isSelected ? 7 : 5}
                    fill={color.hex}
                    stroke="#090d16"
                    strokeWidth="2"
                  />

                  {/* Label */}
                  <text
                    x="9"
                    y="4"
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize={isSelected ? '13' : '11'}
                    fontWeight={isSelected ? 'bold' : '500'}
                    fontFamily="Inter, sans-serif"
                    className="drop-shadow-md select-none"
                  >
                    {pt.word}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick instructions footer */}
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-slate-400">
            <span>💡 Bir kelimeye tıklayarak komşularını ve vektörel mesafesini inceleyin.</span>
            <span className="font-mono text-cyan-400">{visiblePoints.length} Kelime Gösteriliyor</span>
          </div>
        </div>

        {/* Details & Nearest Neighbors Sidebar */}
        <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Seçili Kelime Detayı
              </span>
              {activeSelectedPoint && (
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-bold"
                  style={{
                    backgroundColor: `${getPointColor(activeSelectedPoint.category).hex}22`,
                    color: getPointColor(activeSelectedPoint.category).hex,
                  }}
                >
                  {activeSelectedPoint.category}
                </span>
              )}
            </div>

            {activeSelectedPoint ? (
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-extrabold text-white capitalize">
                    {activeSelectedPoint.word}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    PCA Konumu: (X: {activeSelectedPoint.x.toFixed(3)}, Y: {activeSelectedPoint.y.toFixed(3)})
                  </div>
                </div>

                {/* Nearest 4 neighbors in 50D space */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>En Yakın 4 Vektör Komşusu:</span>
                    <span className="text-emerald-400 font-mono text-[11px]">Kosinüs Skoru</span>
                  </div>

                  <div className="space-y-2">
                    {nearestToSelected.map(({ point, sim }) => (
                      <div
                        key={point.word}
                        onClick={() => setSelectedWord(point.word)}
                        className="p-2.5 bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl flex items-center justify-between cursor-pointer transition"
                      >
                        <div>
                          <div className="font-bold text-xs text-white capitalize">{point.word}</div>
                          <div className="text-[10px] text-slate-400">{point.category}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-emerald-400">
                            {(sim * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vector Dimensionality breakdown */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-400">
                  <div className="text-[11px] font-semibold text-slate-300">Vektör Boyutu (Embedding Size):</div>
                  <div className="font-mono text-[10px] text-slate-400 break-all leading-relaxed">
                    [
                    {activeVocab[activeSelectedPoint.word]?.vector
                      .slice(0, 8)
                      .map((v) => v.toFixed(3))
                      .join(', ')}
                    , ... +42 boyut]
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-xs">
                Grafikten bir kelimeye tıklayınız.
              </div>
            )}
          </div>

          {/* Theoretical Notice */}
          <div className="p-3.5 bg-blue-950/20 border border-blue-800/30 rounded-xl text-xs text-blue-200/80 space-y-1">
            <div className="font-bold text-blue-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              PCA ile Boyut İndirgeme
            </div>
            <p className="text-[11px] leading-relaxed text-blue-200/70">
              Yüksek boyutlu uzayda komşu olan kelimelerin 2D izdüşümde de birbirine yakın kümelendiğini görebilirsiniz (Örn: meyveler kendi içinde, ülkeler kendi içinde).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
