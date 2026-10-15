/**
 * NLP Engine: Word2Vec vector math, Cosine Similarity, PCA Projection, and In-Browser Trainer
 */
import { WORD_EMBEDDINGS, WordVector } from '../data/embeddingsData';

// --- Vector Math ---

export function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

export function magnitude(v: number[]): number {
  return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

export function normalize(v: number[]): number[] {
  const mag = magnitude(v);
  if (mag === 0) return v.map(() => 0);
  return v.map((x) => x / mag);
}

/**
 * Calculates Cosine Similarity between two vectors:
 * cos(theta) = (A . B) / (||A|| * ||B||)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = dotProduct(a, b);
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  const sim = dot / (magA * magB);
  // Clamp between -1 and 1 due to floating point inaccuracies
  return Math.max(-1, Math.min(1, sim));
}

export function vectorAdd(a: number[], b: number[]): number[] {
  return a.map((val, idx) => val + b[idx]);
}

export function vectorSubtract(a: number[], b: number[]): number[] {
  return a.map((val, idx) => val - b[idx]);
}

export interface SimilarityResult {
  word: string;
  similarity: number;
  category?: string;
  vector?: number[];
}

/**
 * Finds top-N most similar words in the vocabulary to a target vector or target word
 */
export function findMostSimilar(
  target: string | number[],
  topN: number = 10,
  excludeWords: string[] = [],
  customVocab?: Record<string, WordVector>
): SimilarityResult[] {
  const vocab = customVocab || WORD_EMBEDDINGS;
  let targetVector: number[];
  const normalizedExcludes = excludeWords.map((w) => w.toLowerCase().trim());

  if (typeof target === 'string') {
    const key = target.toLowerCase().trim();
    if (!vocab[key]) return [];
    targetVector = vocab[key].vector;
    normalizedExcludes.push(key);
  } else {
    targetVector = target;
  }

  const results: SimilarityResult[] = [];

  for (const [key, wordObj] of Object.entries(vocab)) {
    if (normalizedExcludes.includes(key)) continue;
    const sim = cosineSimilarity(targetVector, wordObj.vector);
    results.push({
      word: wordObj.word,
      similarity: sim,
      category: wordObj.category,
      vector: wordObj.vector,
    });
  }

  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, topN);
}

/**
 * Computes vector analogy:
 * V(target) = V(A) - V(B) + V(C)
 * Returns nearest words to V(target), excluding A, B, and C
 */
export function computeAnalogy(
  wordA: string,
  wordB: string,
  wordC: string,
  topN: number = 5,
  customVocab?: Record<string, WordVector>
): {
  targetVector: number[];
  candidates: SimilarityResult[];
  error?: string;
} {
  const vocab = customVocab || WORD_EMBEDDINGS;
  const a = wordA.toLowerCase().trim();
  const b = wordB.toLowerCase().trim();
  const c = wordC.toLowerCase().trim();

  if (!vocab[a]) return { targetVector: [], candidates: [], error: `"${wordA}" kelimesi sözlükte bulunamadı.` };
  if (!vocab[b]) return { targetVector: [], candidates: [], error: `"${wordB}" kelimesi sözlükte bulunamadı.` };
  if (!vocab[c]) return { targetVector: [], candidates: [], error: `"${wordC}" kelimesi sözlükte bulunamadı.` };

  const vecA = vocab[a].vector;
  const vecB = vocab[b].vector;
  const vecC = vocab[c].vector;

  // Target = A - B + C
  const diff = vectorSubtract(vecA, vecB);
  const targetVec = normalize(vectorAdd(diff, vecC));

  const candidates = findMostSimilar(targetVec, topN, [a, b, c], vocab);

  return { targetVector: targetVec, candidates };
}

/**
 * Finds the odd one out in a group of words (Gensim `doesnt_match` equivalent).
 * Calculates centroid of all words, then identifies the word with lowest mean cosine similarity.
 */
export function findOddOneOut(
  words: string[],
  customVocab?: Record<string, WordVector>
): {
  oddWord: string | null;
  details: { word: string; averageSimilarity: number }[];
  error?: string;
} {
  const vocab = customVocab || WORD_EMBEDDINGS;
  const cleaned = words.map((w) => w.toLowerCase().trim()).filter(Boolean);

  if (cleaned.length < 3) {
    return { oddWord: null, details: [], error: 'En az 3 kelime girmelisiniz.' };
  }

  const vectors: { word: string; vector: number[] }[] = [];
  const missing: string[] = [];

  for (const w of cleaned) {
    if (vocab[w]) {
      vectors.push({ word: w, vector: vocab[w].vector });
    } else {
      missing.push(w);
    }
  }

  if (missing.length > 0) {
    return {
      oddWord: null,
      details: [],
      error: `Sözlükte bulunamayan kelimeler: ${missing.join(', ')}`,
    };
  }

  // Calculate similarity of each word to all other words in the group
  const details = vectors.map((item, idx) => {
    let sumSim = 0;
    let count = 0;
    vectors.forEach((other, oIdx) => {
      if (idx !== oIdx) {
        sumSim += cosineSimilarity(item.vector, other.vector);
        count++;
      }
    });
    return {
      word: item.word,
      averageSimilarity: count > 0 ? sumSim / count : 0,
    };
  });

  // Lowest average similarity = the outlier
  details.sort((a, b) => a.averageSimilarity - b.averageSimilarity);

  return {
    oddWord: details[0]?.word || null,
    details,
  };
}

/**
 * Computes sentence similarity by averaging word embeddings
 */
export function computeSentenceSimilarity(
  sent1: string,
  sent2: string,
  customVocab?: Record<string, WordVector>
): {
  similarity: number;
  tokens1: string[];
  tokens2: string[];
  matchedCount1: number;
  matchedCount2: number;
} {
  const vocab = customVocab || WORD_EMBEDDINGS;

  const tokenize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'<>]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 1);

  const t1 = tokenize(sent1);
  const t2 = tokenize(sent2);

  const getCentroid = (tokens: string[]) => {
    const dim = 50;
    const centroid = new Array(dim).fill(0);
    let matched = 0;

    for (const t of tokens) {
      if (vocab[t]) {
        matched++;
        const vec = vocab[t].vector;
        for (let i = 0; i < dim; i++) {
          centroid[i] += vec[i];
        }
      }
    }

    if (matched === 0) return { vector: centroid, matched: 0 };
    return { vector: normalize(centroid.map((v) => v / matched)), matched };
  };

  const c1 = getCentroid(t1);
  const c2 = getCentroid(t2);

  if (c1.matched === 0 || c2.matched === 0) {
    return {
      similarity: 0,
      tokens1: t1,
      tokens2: t2,
      matchedCount1: c1.matched,
      matchedCount2: c2.matched,
    };
  }

  const sim = cosineSimilarity(c1.vector, c2.vector);
  return {
    similarity: Math.max(0, sim),
    tokens1: t1,
    tokens2: t2,
    matchedCount1: c1.matched,
    matchedCount2: c2.matched,
  };
}

/**
 * 2D PCA (Principal Component Analysis) Projection:
 * Reduces high-dimensional vectors to 2D coordinates for visual exploration
 */
export interface ProjectedPoint {
  word: string;
  category: string;
  x: number; // Normalized -1 to 1
  y: number; // Normalized -1 to 1
  language: 'tr' | 'en';
}

export function projectVectorsPCA(
  words: WordVector[],
  seedOffset: number = 0
): ProjectedPoint[] {
  if (words.length === 0) return [];

  const dim = words[0].vector.length;
  const n = words.length;

  // 1. Compute Mean Vector
  const mean = new Array(dim).fill(0);
  for (const w of words) {
    for (let d = 0; d < dim; d++) {
      mean[d] += w.vector[d];
    }
  }
  for (let d = 0; d < dim; d++) mean[d] /= n;

  // 2. Mean-center the data
  const centered = words.map((w) =>
    w.vector.map((val, d) => val - mean[d])
  );

  // 3. Power iteration to find 2 principal components
  function powerIteration(data: number[][], orthogonalTo?: number[]): number[] {
    let v = new Array(dim).fill(0).map((_, i) => Math.sin(i + 1.23 + seedOffset));
    v = normalize(v);

    for (let iter = 0; iter < 25; iter++) {
      if (orthogonalTo) {
        // Project out component parallel to orthogonalTo
        const proj = dotProduct(v, orthogonalTo);
        v = v.map((val, idx) => val - proj * orthogonalTo[idx]);
        v = normalize(v);
      }

      // Multiply by X^T * X
      // temp = X * v
      const x_v = data.map((row) => dotProduct(row, v));
      // next_v = X^T * x_v
      const next_v = new Array(dim).fill(0);
      for (let r = 0; r < data.length; r++) {
        for (let d = 0; d < dim; d++) {
          next_v[d] += data[r][d] * x_v[r];
        }
      }
      v = normalize(next_v);
    }
    return v;
  }

  const pc1 = powerIteration(centered);
  const pc2 = powerIteration(centered, pc1);

  // 4. Project onto PC1 and PC2
  const rawCoords = words.map((w, idx) => ({
    word: w.word,
    category: w.category,
    language: w.language,
    x: dotProduct(centered[idx], pc1),
    y: dotProduct(centered[idx], pc2),
  }));

  // Find min and max for scaling
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  for (const p of rawCoords) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  // Return coordinates normalized within [-0.85, 0.85] for clean padding
  return rawCoords.map((p) => ({
    word: p.word,
    category: p.category,
    language: p.language,
    x: ((p.x - minX) / rangeX) * 1.7 - 0.85,
    y: ((p.y - minY) / rangeY) * 1.7 - 0.85,
  }));
}

/**
 * In-Browser Custom Word2Vec Trainer (Skip-Gram with Negative Sampling simulation)
 */
export interface TrainingProgress {
  epoch: number;
  totalEpochs: number;
  loss: number;
  vocabularySize: number;
  totalPairs: number;
}

export interface TrainedModelResult {
  vocab: Record<string, WordVector>;
  vocabList: string[];
  lossHistory: number[];
  trainingPairsCount: number;
}

export function trainCustomWord2Vec(
  corpusText: string,
  options: {
    vectorSize?: number;
    windowSize?: number;
    minCount?: number;
    epochs?: number;
    learningRate?: number;
  },
  onProgress?: (prog: TrainingProgress) => void
): TrainedModelResult {
  const {
    vectorSize = 30,
    windowSize = 2,
    minCount = 1,
    epochs = 15,
    learningRate = 0.05,
  } = options;

  // 1. Tokenize & Clean Text
  const sentences = corpusText
    .toLowerCase()
    .split(/[.!?\n]+/)
    .map((s) =>
      s
        .replace(/[^a-zçğıöşü\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 1)
    )
    .filter((s) => s.length > 1);

  // 2. Build Vocabulary & Counts
  const wordCounts: Record<string, number> = {};
  for (const sent of sentences) {
    for (const w of sent) {
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    }
  }

  const vocabWords = Object.keys(wordCounts).filter(
    (w) => wordCounts[w] >= minCount
  );
  const vocabSize = vocabWords.length;
  const wordToIndex: Record<string, number> = {};
  vocabWords.forEach((w, i) => {
    wordToIndex[w] = i;
  });

  if (vocabSize < 3) {
    throw new Error('Eğitim için yeterli kelime bulunamadı. Lütfen daha uzun bir metin giriniz.');
  }

  // 3. Generate Training Pairs (Center Word -> Context Word)
  const pairs: [number, number][] = [];
  for (const sent of sentences) {
    const validIndices = sent
      .map((w) => wordToIndex[w])
      .filter((idx) => idx !== undefined);

    for (let i = 0; i < validIndices.length; i++) {
      const center = validIndices[i];
      for (let j = Math.max(0, i - windowSize); j <= Math.min(validIndices.length - 1, i + windowSize); j++) {
        if (i !== j) {
          pairs.push([center, validIndices[j]]);
        }
      }
    }
  }

  if (pairs.length === 0) {
    throw new Error('Eğitim çiftleri oluşturulamadı. Metin uzunluğunu artırınız.');
  }

  // 4. Initialize Weights randomly
  // W_in (Center vectors) and W_out (Context vectors)
  const W_in: number[][] = [];
  const W_out: number[][] = [];
  for (let i = 0; i < vocabSize; i++) {
    W_in.push(
      new Array(vectorSize).fill(0).map(() => (Math.random() - 0.5) / vectorSize)
    );
    W_out.push(new Array(vectorSize).fill(0));
  }

  const lossHistory: number[] = [];

  // Helper sigmoid
  const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(-10, Math.min(10, z))));

  // 5. Training Loop (Skip-Gram with Negative Sampling)
  for (let ep = 1; ep <= epochs; ep++) {
    let epochLoss = 0;

    for (const [centerIdx, contextIdx] of pairs) {
      // Positive Sample
      const v_center = W_in[centerIdx];
      const theta_pos = W_out[contextIdx];
      const z_pos = dotProduct(v_center, theta_pos);
      const pred_pos = sigmoid(z_pos);
      const err_pos = pred_pos - 1; // target is 1
      epochLoss += -Math.log(Math.max(1e-7, pred_pos));

      // 2 Negative Samples
      const negSamples: number[] = [];
      for (let n = 0; n < 2; n++) {
        const randIdx = Math.floor(Math.random() * vocabSize);
        if (randIdx !== contextIdx) negSamples.push(randIdx);
      }

      // Gradients for center word
      const grad_center = new Array(vectorSize).fill(0);
      for (let d = 0; d < vectorSize; d++) {
        grad_center[d] += err_pos * theta_pos[d];
        theta_pos[d] -= learningRate * err_pos * v_center[d];
      }

      for (const negIdx of negSamples) {
        const theta_neg = W_out[negIdx];
        const z_neg = dotProduct(v_center, theta_neg);
        const pred_neg = sigmoid(z_neg);
        const err_neg = pred_neg - 0; // target is 0
        epochLoss += -Math.log(Math.max(1e-7, 1 - pred_neg));

        for (let d = 0; d < vectorSize; d++) {
          grad_center[d] += err_neg * theta_neg[d];
          theta_neg[d] -= learningRate * err_neg * v_center[d];
        }
      }

      for (let d = 0; d < vectorSize; d++) {
        v_center[d] -= learningRate * grad_center[d];
      }
    }

    const avgLoss = epochLoss / pairs.length;
    lossHistory.push(avgLoss);

    if (onProgress) {
      onProgress({
        epoch: ep,
        totalEpochs: epochs,
        loss: avgLoss,
        vocabularySize: vocabSize,
        totalPairs: pairs.length,
      });
    }
  }

  // 6. Assemble Resulting Model
  const trainedVocab: Record<string, WordVector> = {};
  for (let i = 0; i < vocabSize; i++) {
    const word = vocabWords[i];
    // Pad to 50 dimensions if needed for compatibility
    const baseVec = W_in[i];
    const paddedVec = new Array(50).fill(0);
    for (let d = 0; d < 50; d++) {
      paddedVec[d] = d < baseVec.length ? baseVec[d] : 0;
    }

    trainedVocab[word] = {
      word,
      category: 'Özel Model',
      language: 'tr',
      vector: normalize(paddedVec),
    };
  }

  return {
    vocab: trainedVocab,
    vocabList: vocabWords,
    lossHistory,
    trainingPairsCount: pairs.length,
  };
}
