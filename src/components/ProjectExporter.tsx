import React, { useState } from 'react';
import JSZip from 'jszip';
import { FLASK_TEMPLATE, FASTAPI_TEMPLATE, ProjectFile } from '../data/projectTemplates';
import {
  Download,
  Copy,
  Check,
  FolderGit2,
  Terminal,
  ExternalLink,
  FileCode,
  Globe,
  Send,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const ProjectExporter: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState<'flask' | 'fastapi'>('flask');
  const activeTemplate = selectedFramework === 'flask' ? FLASK_TEMPLATE : FASTAPI_TEMPLATE;
  const [selectedFileName, setSelectedFileName] = useState('api/index.py');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  // Live test for student's deployed Vercel URL
  const [userVercelUrl, setUserVercelUrl] = useState('');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isTestingUrl, setIsTestingUrl] = useState(false);

  const currentFile = activeTemplate.files.find((f) => f.name === selectedFileName) || activeTemplate.files[0];

  const handleCopyCode = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(identifier);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleCopyCommand = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      activeTemplate.files.forEach((file) => {
        zip.file(file.name, file.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nlp-gensim-${selectedFramework}-vercel.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('ZIP oluşturma hatası:', e);
    } finally {
      setIsZipping(false);
    }
  };

  const handleTestDeployedUrl = async () => {
    if (!userVercelUrl) return;
    setIsTestingUrl(true);
    setTestOutput(null);

    let cleanUrl = userVercelUrl.trim();
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      const endpoint = `${cleanUrl.replace(/\/$/, '')}/api/similarity?w1=kral&w2=kraliçe`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setTestOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestOutput(`Bağlantı hatası: ${err.message}. Lütfen CORS ayarlarını veya Vercel URL'sini kontrol edin.`);
    } finally {
      setIsTestingUrl(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
                Ödev Gereksinimi: Python + Gensim + Flask/FastAPI + Vercel
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-blue-400" />
              GitHub & Vercel Dağıtım Paketi Üreticisi
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Ödevinizi teslim etmek için gerekli olan tüm Python dosyalarını, Gensim Word2Vec modelini, Vercel Serverless yapılandırmasını ve detaylı dökümantasyonu 1-tıkla indirin veya GitHub'a yükleyin.
            </p>
          </div>

          {/* Download ZIP Button */}
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'ZIP Hazırlanıyor...' : 'Tüm Projeyi ZIP Olarak İndir (.zip)'}</span>
          </button>
        </div>

        {/* Framework Selector Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Mimari Seçimi:</span>
            <button
              onClick={() => {
                setSelectedFramework('flask');
                setSelectedFileName('api/index.py');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition ${
                selectedFramework === 'flask'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Flask 3.x (Önerilen & Sade)
            </button>
            <button
              onClick={() => {
                setSelectedFramework('fastapi');
                setSelectedFileName('api/index.py');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition ${
                selectedFramework === 'fastapi'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              FastAPI (Otomatik Swagger /docs)
            </button>
          </div>

          <span className="text-xs text-slate-400">
            {activeTemplate.files.length} Dosya Dahil (Vercel Serverless uyumlu)
          </span>
        </div>
      </div>

      {/* Code Viewer & File Explorer */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: File Tree */}
        <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Proje Dosyaları
            </span>
            <span className="text-[11px] text-slate-500 font-mono">/repo_root</span>
          </div>

          <div className="space-y-1.5">
            {activeTemplate.files.map((file) => {
              const isSelected = selectedFileName === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFileName(file.name)}
                  className={`w-full p-2.5 rounded-xl text-left border transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500/60 text-white'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileCode
                      className={`w-4 h-4 shrink-0 ${
                        file.name.endsWith('.py')
                          ? 'text-yellow-400'
                          : file.name.endsWith('.json')
                          ? 'text-emerald-400'
                          : 'text-blue-400'
                      }`}
                    />
                    <span className="font-mono text-xs font-semibold truncate">{file.name}</span>
                  </div>
                  {isSelected && <span className="text-[10px] text-blue-400 font-bold">Aktif</span>}
                </button>
              );
            })}
          </div>

          {/* Quick file description */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="font-bold text-slate-300">{currentFile.name}</div>
            <p className="text-[11px] text-slate-400">{currentFile.description}</p>
          </div>
        </div>

        {/* Right: Code Preview with Copy */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          {/* Code Viewer Header */}
          <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-semibold text-white">{currentFile.name}</span>
            </div>

            <button
              onClick={() => handleCopyCode(currentFile.content, currentFile.name)}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition"
            >
              {copiedFile === currentFile.name ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kodu Kopyala</span>
                </>
              )}
            </button>
          </div>

          {/* Code Body */}
          <div className="p-4 overflow-x-auto max-h-[460px] font-mono text-xs text-slate-300 leading-relaxed bg-[#0b0f19]">
            <pre className="select-text whitespace-pre">{currentFile.content}</pre>
          </div>
        </div>
      </div>

      {/* GitHub & Vercel Step-by-Step Deployment Guide */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            Adım Adım GitHub ve Vercel Dağıtım Kılavuzu
          </h4>
          <span className="text-xs text-slate-400">Ortalama süre: 3 dakika</span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <span className="font-bold text-xs text-white">ZIP'i Açın & Git Başlatın</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              İndirdiğiniz ZIP dosyasını bilgisayarınızda bir klasöre çıkarın ve terminali açarak şu komutları yazın:
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400 space-y-1 relative">
              <div>git init</div>
              <div>git add .</div>
              <div>git commit -m "NLP Gensim Projesi"</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </span>
              <span className="font-bold text-xs text-white">GitHub Deponuza Yükleyin</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              GitHub üzerinde <code className="text-white">nlp-word2vec-proje</code> adında yeni bir public repo oluşturup push edin:
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-indigo-300 space-y-1">
              <div>git branch -M main</div>
              <div>git remote add origin https://github.com/KULLANICI/nlp-word2vec-proje.git</div>
              <div>git push -u origin main</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </span>
              <span className="font-bold text-xs text-white">Vercel'e Bağlayıp Yayınlayın</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline inline-flex items-center gap-1"
              >
                vercel.com <ExternalLink className="w-3 h-3" />
              </a>{' '}
              adresine gidin, <b>"Add New Project"</b> deyip GitHub deponuzu seçin ve <b>"Deploy"</b> butonuna basın!
            </p>
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-[11px] text-emerald-400">
              ✓ <code className="font-mono">vercel.json</code> sayesinde ayar gerekmeden otomatik yayına alınır.
            </div>
          </div>
        </div>
      </div>

      {/* Live Vercel Verification Tool */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              Yayınlanan Canlı Vercel Servisinizi Test Edin
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Vercel'den aldığınız URL'yi buraya yapıştırarak API'nin doğru çalıştığını doğrulayabilirsiniz.
            </p>
          </div>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/60 px-2.5 py-1 rounded-full font-mono">
            Doğrulama Aracı
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={userVercelUrl}
            onChange={(e) => setUserVercelUrl(e.target.value)}
            placeholder="Örn: https://nlp-word2vec-proje.vercel.app"
            className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none font-mono"
          />
          <button
            onClick={handleTestDeployedUrl}
            disabled={isTestingUrl || !userVercelUrl.trim()}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isTestingUrl ? 'Test Ediliyor...' : 'API Testi Yap (w1=kral, w2=kraliçe)'}</span>
          </button>
        </div>

        {testOutput && (
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
            <div className="text-[10px] text-slate-500 mb-1">CANLI API YANITI:</div>
            <pre className="whitespace-pre overflow-x-auto text-emerald-400">{testOutput}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
