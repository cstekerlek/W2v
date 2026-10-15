import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
  GitCompare,
  Code,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export const TheoryGuide: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('word2vec');

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          Doğal Dil İşleme (NLP) & Gensim Word2Vec Teori Rehberi
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Ders kapsamında sorumlu olunan temel kavramlar, matematiksel temeller, Word2Vec mimarileri (Skip-Gram vs CBOW) ve Gensim kütüphanesinin çalışma prensipleri.
        </p>
      </div>

      {/* Accordion / Content Cards */}
      <div className="space-y-4">
        {/* 1. Kelime Temsilleri & One-Hot vs Embedding */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('representations')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Geleneksel Temsiller (One-Hot) vs Dağıtık Vektör Temsilleri (Word Embeddings)
                </h4>
                <p className="text-xs text-slate-400">Neden seyrek (sparse) vektörler yerine yoğun (dense) vektörler kullanılır?</p>
              </div>
            </div>
            {expandedSection === 'representations' ? (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {expandedSection === 'representations' && (
            <div className="p-6 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-rose-400 flex items-center gap-1.5">
                    ❌ One-Hot Encoding (Geleneksel)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Sözlükteki her kelimeye yalnızca bir adet '1' ve geri kalanına '0' atanır (Örn: 50.000 kelimelik sözlükte 50.000 boyutlu devasa matris).
                  </p>
                  <div className="font-mono text-[10px] bg-slate-950 p-2 rounded text-slate-400">
                    kedi = [1, 0, 0, 0, ...]<br />
                    köpek = [0, 1, 0, 0, ...]<br />
                    araba = [0, 0, 1, 0, ...]
                  </div>
                  <div className="text-[11px] text-rose-300">
                    <b>Sorun:</b> Her iki one-hot vektörün iç çarpımı (dot product) daima 0'dır! Yani kedi ile köpek arasındaki anlamsal yakınlık ölçülemez.
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    ✅ Word Embeddings (Word2Vec)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Kelimeler düşük boyutlu (genellikle 50, 100 veya 300 boyutlu), sürekli (continuous) ve yoğun (dense) reel sayı vektörleriyle temsil edilir.
                  </p>
                  <div className="font-mono text-[10px] bg-slate-950 p-2 rounded text-slate-400">
                    kedi = [0.24, -0.81, 0.45, 0.12, ...]<br />
                    köpek = [0.28, -0.79, 0.42, 0.15, ...]<br />
                    araba = [-0.65, 0.11, -0.89, 0.74, ...]
                  </div>
                  <div className="text-[11px] text-emerald-300">
                    <b>Avantaj:</b> Benzer bağlamlarda geçen kelimelerin vektörleri uzayda birbirine çok yakın konumlara yerleşir!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. Word2Vec Mimarisi: CBOW vs Skip-Gram */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('word2vec')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Word2Vec Algoritmik Mimarisi: CBOW vs Skip-Gram
                </h4>
                <p className="text-xs text-slate-400">Tomas Mikolov et al. (2013) tarafından geliştirilen iki temel yaklaşım</p>
              </div>
            </div>
            {expandedSection === 'word2vec' ? (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {expandedSection === 'word2vec' && (
            <div className="p-6 border-t border-slate-800/80 bg-slate-950/60 space-y-5 text-xs text-slate-300 leading-relaxed">
              <p className="text-slate-300">
                Word2Vec, <i>"Bir kelimeyi beraberinde bulunduğu arkadaşlarından tanırsınız"</i> (J.R. Firth, Dağıtımsal Hipotez) ilkesine dayanır.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-indigo-300">
                    A) CBOW (Continuous Bag of Words)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Çevreleyen bağlamdaki komşu kelimelere bakarak <b>ortadaki merkez kelimeyi</b> tahmin etmeye çalışır.
                  </p>
                  <div className="p-2.5 bg-slate-950 rounded text-[11px] font-mono text-indigo-200">
                    Girdi: [sarayda, hüküm, güçlü] → Çıktı: "kral"
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside pt-1">
                    <li>Eğitimi çok daha hızlıdır.</li>
                    <li>Sık geçen kelimeler için mükemmel temsil üretir.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-fuchsia-300">
                    B) Skip-Gram (Bizim Tercihimiz)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Merkezdeki tek bir kelimeye bakarak <b>etrafındaki komşu kelimeleri</b> tahmin etmeye çalışır.
                  </p>
                  <div className="p-2.5 bg-slate-950 rounded text-[11px] font-mono text-fuchsia-200">
                    Girdi: "kral" → Çıktı: [sarayda, taht, erkek, soylu]
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside pt-1">
                    <li>Daha küçük veri kümelerinde ve nadir kelimelerde üstün başarı sağlar.</li>
                    <li>Anlamsal analojilerde (kral - erkek + kadın) daha keskindir.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Kosinüs Benzerliği ve Vektör Analojisi Matematiği */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('math')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Matematiksel Formüller: Kosinüs Benzerliği & Vektör Analojisi
                </h4>
                <p className="text-xs text-slate-400">Dot product, normlar ve kosinüs açısı hesaplaması</p>
              </div>
            </div>
            {expandedSection === 'math' ? (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {expandedSection === 'math' && (
            <div className="p-6 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-300">1. Kosinüs Benzerliği (Cosine Similarity)</div>
                <div className="font-mono text-sm text-white bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                  cos(θ) = (u · v) / ( ||u|| × ||v|| ) = ∑(u_i × v_i) / [ √(∑ u_i²) × √(∑ v_i²) ]
                </div>
                <p className="text-slate-400 text-[11px]">
                  Burada <b>u · v</b> iç çarpım (dot product), <b>||u||</b> ise Öklid normudur (vektörün büyüklüğü). Vektörlerin uzunluk farkından etkilenmeksizin sadece aralarındaki açısal yönelim farkını ölçer.
                </p>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-indigo-300">2. Vektör Analojisi Formülü (Word Analogies)</div>
                <div className="font-mono text-sm text-white bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                  v_hedef = v_kral - v_erkek + v_kadın
                </div>
                <p className="text-slate-400 text-[11px]">
                  Bu işlem sonucunda elde edilen <code>v_hedef</code> vektörüne en yakın (kosinüs benzerliği en yüksek olan) kelime aranır ve sistem <b>"kraliçe"</b> kelimesini bulur!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 4. Gensim Kütüphanesi Python Kod Kalıpları */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleSection('gensim')}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                4
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Gensim Kütüphanesi Temel Python Fonksiyonları
                </h4>
                <p className="text-xs text-slate-400">Ödevde kodlamanız gereken temel metotlar ve parametreleri</p>
              </div>
            </div>
            {expandedSection === 'gensim' ? (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {expandedSection === 'gensim' && (
            <div className="p-6 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs font-mono text-slate-300">
              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-amber-400 font-bold font-sans"># 1. Modeli Eğitme</div>
                  <div className="text-emerald-400">
                    from gensim.models import Word2Vec<br />
                    model = Word2Vec(sentences, vector_size=100, window=5, min_count=1, sg=1, epochs=30)
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-amber-400 font-bold font-sans"># 2. İki Kelime Benzerliği</div>
                  <div className="text-emerald-400">
                    skor = model.wv.similarity('kral', 'kraliçe')  # Çıktı: 0.8842
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-amber-400 font-bold font-sans"># 3. En Benzer Kelimeler & Analoji</div>
                  <div className="text-emerald-400">
                    # kral - erkek + kadın analojisi:<br />
                    sonuc = model.wv.most_similar(positive=['kral', 'kadın'], negative=['erkek'], topn=3)
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-amber-400 font-bold font-sans"># 4. Gruptan Aykırı Olanı Bulma</div>
                  <div className="text-emerald-400">
                    aykiri = model.wv.doesnt_match(['elma', 'armut', 'muz', 'bilgisayar'])  # Çıktı: 'bilgisayar'
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
