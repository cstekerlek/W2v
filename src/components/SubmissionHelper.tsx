import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Send,
  ExternalLink,
  Github,
  Globe,
  Sparkles,
  Award,
} from 'lucide-react';

export const SubmissionHelper: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [courseName, setCourseName] = useState('Doğal Dil İşleme (Natural Language Processing)');
  const [githubUrl, setGithubUrl] = useState('https://github.com/kullanici/nlp-gensim-word2vec');
  const [vercelUrl, setVercelUrl] = useState('https://nlp-gensim-word2vec.vercel.app');
  const [frameworkChoice, setFrameworkChoice] = useState('Flask & Gensim Word2Vec');
  const [isCopied, setIsCopied] = useState(false);

  const submissionText = `===================================================================
DOĞAL DİL İŞLEME (NLP) DERSİ ÖDEV TESLİM METNİ
===================================================================

Öğrenci Bilgileri:
- Adı Soyadı: ${studentName || '[Adınız Soyadınız]'}
- Öğrenci No: ${studentNumber || '[Öğrenci Numaranız]'}
- Ders Adı: ${courseName}

Proje Bağlantıları:
1. GitHub Deposu (Açık Kaynak Kodlar):
   ${githubUrl}

2. Canlı Yayın Web Adresi (Vercel):
   ${vercelUrl}

Proje Mimarisi & Kullanılan Teknolojiler:
- Programlama Dili: Python 3
- NLP Kütüphanesi: Gensim 4.x (Word2Vec Algoritması)
- Model Mimarisi: Skip-Gram / Continuous Bag of Words (CBOW)
- Web Çerçevesi: ${frameworkChoice}
- Dağıtım / Bulut Platformu: Vercel Serverless Functions

Geliştirilen Özellikler ve REST API Uç Noktaları:
1. Kosinüs Benzerliği (/api/similarity): İki kelime arasındaki n-boyutlu vektör açısını (cos θ) hesaplar.
2. Vektör Analojisi (/api/analogy): "Kral - Erkek + Kadın = Kraliçe" doğrusal anlamsal cebir denklemlerini çözer.
3. En Yakın Kelimeler (/api/most_similar): Verilen kelimeye en yüksek kosinüs benzerliğine sahip kelimeleri listeler.
4. Anlamsal Aykırı Kelime (/api/doesnt_match): Kümedeki kelimelerin ağırlık merkezine (centroid) en uzak olan kelimeyi tespit eder.
5. Canlı Web Test Arayüzü (/): Tüm kullanıcıların tarayıcı üzerinden modeli doğrudan deneyimleyebileceği etkileşimli kullanıcı arayüzü sunar.

Yukarıda yer alan canlı web adresi ve GitHub deposu üzerinden projenin tüm kaynak kodlarına ve çalışan test arayüzüne erişilebilir.

Saygılarımla.
===================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(submissionText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/30">
                Ödev Teslim Metni Hazırlayıcı
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Üniversite Portalı Teslim Asistanı
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Hocanıza teslim edeceğiniz metin kutusuna doğrudan yapıştırmak üzere GitHub ve Vercel bağlantılarınızı içeren profesyonel bir ödev teslim raporu oluşturun.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition shrink-0"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Rapor Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Teslim Metnini Kopyala</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Form Inputs */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block border-b border-slate-800 pb-2">
            Ödev Bilgilerinizi Doldurun
          </span>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Adınız Soyadınız:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Öğrenci Numarası:</label>
              <input
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                placeholder="Örn: 2021104050"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-400" />
                GitHub Proje Deposu Adresi:
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/kullanici/nlp-gensim-word2vec"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Canlı Vercel Web Adresi:
              </label>
              <input
                type="text"
                value={vercelUrl}
                onChange={(e) => setVercelUrl(e.target.value)}
                placeholder="https://nlp-gensim-word2vec.vercel.app"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Seçilen Web Çerçevesi:</label>
              <select
                value={frameworkChoice}
                onChange={(e) => setFrameworkChoice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2 outline-none"
              >
                <option value="Flask 3.x & Gensim Word2Vec">Flask 3.x & Gensim Word2Vec</option>
                <option value="FastAPI & Gensim Word2Vec">FastAPI & Gensim Word2Vec</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Output Preview */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Teslim Metni Önizlemesi
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Doğrudan Yapıştırmaya Hazır</span>
            </div>

            <pre className="font-mono text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 overflow-x-auto whitespace-pre select-text">
              {submissionText}
            </pre>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
          >
            <Copy className="w-4 h-4" />
            <span>Metni Kopyala ve Sisteme (Moodle / OYS / Canvas) Yapıştır</span>
          </button>
        </div>
      </div>
    </div>
  );
};
