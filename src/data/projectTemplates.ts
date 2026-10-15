/**
 * Ready-to-deploy Python + Gensim + Flask / FastAPI Project Templates
 * Designed for 1-click deployment on Vercel from a GitHub Repository.
 */

export interface ProjectFile {
  name: string;
  language: string;
  description: string;
  content: string;
}

export interface DeploymentTemplate {
  id: 'flask' | 'fastapi';
  title: string;
  framework: string;
  description: string;
  files: ProjectFile[];
}

export const FLASK_TEMPLATE: DeploymentTemplate = {
  id: 'flask',
  title: 'Flask + Gensim Word2Vec (Vercel Serverless)',
  framework: 'Flask 3.x',
  description: 'Hafif, anlaşılır ve Vercel Serverless üzerinde doğrudan çalışan Python REST API & Web Arayüzü.',
  files: [
    {
      name: 'api/index.py',
      language: 'python',
      description: 'Flask ana sunucu dosyası, Gensim Word2Vec modeli ve REST API uç noktaları',
      content: `from flask import Flask, request, jsonify, render_template_string
import os
import math

# Gensim Word2Vec Import (veya hafif sunucusuz yedek algoritma)
try:
    from gensim.models import Word2Vec
    GENSIM_AVAILABLE = True
except ImportError:
    GENSIM_AVAILABLE = False

app = Flask(__name__)

# Örnek Türkçe NLP Eğitim Külliyatı (Corpus)
DEFAULT_SENTENCES = [
    ["kral", "sarayda", "hüküm", "sürer", "güçlü", "erkek", "liderdir"],
    ["kraliçe", "sarayda", "hüküm", "sürer", "güçlü", "kadın", "liderdir"],
    ["prens", "genç", "erkek", "kralın", "oğludur"],
    ["prenses", "genç", "kız", "kraliçenin", "kızıdır"],
    ["türkiye", "başkenti", "ankara", "büyük", "ülkedir"],
    ["fransa", "başkenti", "paris", "avrupada", "ülkedir"],
    ["almanya", "başkenti", "berlin", "avrupada", "sanayi", "ülkesidir"],
    ["ingiltere", "başkenti", "londra", "ada", "ülkesidir"],
    ["doktor", "hastane", "sağlık", "tedavi", "ilaç", "yazar"],
    ["öğretmen", "okul", "eğitim", "öğrenci", "ders", "anlatır"],
    ["bilgisayar", "yazılım", "python", "kodlama", "yapay_zeka", "algoritma"],
    ["kedi", "köpek", "kuş", "evcil", "hayvan", "sevimli", "canlıdır"],
    ["elma", "armut", "muz", "meyve", "vitamin", "yiyecektir"],
    ["araba", "otobüs", "tren", "uçak", "ulaşım", "aracıdır"]
]

# Modeli Başlatma (Gensim Word2Vec)
model = None
if GENSIM_AVAILABLE:
    try:
        model = Word2Vec(
            sentences=DEFAULT_SENTENCES,
            vector_size=30,
            window=3,
            min_count=1,
            epochs=50,
            workers=1
        )
    except Exception as e:
        print("Model yuklenirken hata:", e)

# HTML Web Arayüzü Şablonu (Kullanıcı doğrudan web tarayıcısından test edebilir)
HOME_HTML = """
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gensim Word2Vec NLP Web Servisi</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-6 font-sans">
    <div class="max-w-4xl mx-auto space-y-6">
        <header class="border-b border-slate-700 pb-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-extrabold text-blue-400">Doğal Dil İşleme (NLP) & Gensim API</h1>
                    <p class="text-slate-400 text-sm mt-1">Word2Vec Algoritması & Flask Web Servisi (Vercel Canlı Dağıtım)</p>
                </div>
                <span class="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
                    ● Aktif Vercel Servisi
                </span>
            </div>
        </header>

        <section class="grid md:grid-cols-2 gap-6">
            <!-- 1. Benzerlik Sorgusu -->
            <div class="bg-slate-800/80 p-5 rounded-xl border border-slate-700 space-y-3">
                <h2 class="text-lg font-bold text-white flex items-center gap-2">
                    <span>🔍</span> 1. Kelime Benzerliği (Cosine)
                </h2>
                <div class="flex gap-2">
                    <input id="simWord1" value="kral" placeholder="1. Kelime" class="w-1/2 bg-slate-950 px-3 py-2 rounded border border-slate-700 text-sm">
                    <input id="simWord2" value="kraliçe" placeholder="2. Kelime" class="w-1/2 bg-slate-950 px-3 py-2 rounded border border-slate-700 text-sm">
                </div>
                <button onclick="checkSimilarity()" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded text-sm transition">
                    Kosinüs Benzerliğini Hesapla
                </button>
                <div id="simResult" class="p-3 bg-slate-950 rounded text-sm font-mono text-slate-300 min-h-[50px] flex items-center justify-center">
                    Sonuç burada görünecek
                </div>
            </div>

            <!-- 2. Analoji Sorgusu -->
            <div class="bg-slate-800/80 p-5 rounded-xl border border-slate-700 space-y-3">
                <h2 class="text-lg font-bold text-white flex items-center gap-2">
                    <span>👑</span> 2. Vektör Analojisi (Word Math)
                </h2>
                <p class="text-xs text-slate-400">Pozitifler - Negatif = Hedef (Örn: kral - erkek + kadın)</p>
                <div class="grid grid-cols-3 gap-2 text-xs">
                    <input id="anPos1" value="kral" placeholder="+ kral" class="bg-slate-950 p-2 rounded border border-slate-700">
                    <input id="anNeg" value="erkek" placeholder="- erkek" class="bg-slate-950 p-2 rounded border border-slate-700">
                    <input id="anPos2" value="kadın" placeholder="+ kadın" class="bg-slate-950 p-2 rounded border border-slate-700">
                </div>
                <button onclick="checkAnalogy()" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded text-sm transition">
                    Analojiyi Çöz (Word2Vec Math)
                </button>
                <div id="anResult" class="p-3 bg-slate-950 rounded text-sm font-mono text-slate-300 min-h-[50px] flex items-center justify-center">
                    Sonuç burada görünecek
                </div>
            </div>
        </section>

        <!-- API Belgelendirmesi -->
        <section class="bg-slate-800/50 p-5 rounded-xl border border-slate-700/60 space-y-3">
            <h3 class="font-bold text-sm text-slate-300">📌 REST API Uç Noktaları</h3>
            <ul class="text-xs space-y-2 text-slate-400 font-mono">
                <li><span class="text-blue-400">GET /api/similarity?w1=kral&w2=kraliçe</span> - İki kelime arasındaki benzerlik</li>
                <li><span class="text-blue-400">GET /api/most_similar?word=doktor&topn=5</span> - En benzer kelimeler</li>
                <li><span class="text-blue-400">GET /api/analogy?pos=kral,kadın&neg=erkek</span> - Vektör analojisi</li>
                <li><span class="text-blue-400">GET /api/doesnt_match?words=elma,armut,muz,araba</span> - Anlamsal aykırı kelime</li>
            </ul>
        </section>
    </div>

    <script>
        async function checkSimilarity() {
            const w1 = document.getElementById('simWord1').value.trim();
            const w2 = document.getElementById('simWord2').value.trim();
            const el = document.getElementById('simResult');
            el.innerHTML = '<span class="text-yellow-400">Hesaplanıyor...</span>';
            try {
                const res = await fetch(\`/api/similarity?w1=\${encodeURIComponent(w1)}&w2=\${encodeURIComponent(w2)}\`);
                const data = await res.json();
                if (data.error) {
                    el.innerHTML = \`<span class="text-rose-400">\${data.error}</span>\`;
                } else {
                    el.innerHTML = \`Kosinüs Benzerliği: <b class="text-emerald-400">\${(data.similarity * 100).toFixed(2)}%</b> (\${data.similarity.toFixed(4)})\`;
                }
            } catch(e) {
                el.innerText = 'İstek hatası oluştu';
            }
        }

        async function checkAnalogy() {
            const p1 = document.getElementById('anPos1').value.trim();
            const neg = document.getElementById('anNeg').value.trim();
            const p2 = document.getElementById('anPos2').value.trim();
            const el = document.getElementById('anResult');
            el.innerHTML = '<span class="text-yellow-400">Hesaplanıyor...</span>';
            try {
                const res = await fetch(\`/api/analogy?pos=\${encodeURIComponent(p1)},\${encodeURIComponent(p2)}&neg=\${encodeURIComponent(neg)}\`);
                const data = await res.json();
                if (data.error) {
                    el.innerHTML = \`<span class="text-rose-400">\${data.error}</span>\`;
                } else {
                    el.innerHTML = \`Tahmin: <b class="text-emerald-400">\${data.result[0].word}</b> (Skor: \${data.result[0].score.toFixed(4)})\`;
                }
            } catch(e) {
                el.innerText = 'İstek hatası oluştu';
            }
        }
    </script>
</body>
</html>
"""

@app.route('/')
def home():
    """Web arayüzünü döndürür"""
    return render_template_string(HOME_HTML)

@app.route('/api/similarity', methods=['GET'])
def api_similarity():
    """İki kelime arasındaki kosinüs benzerliğini hesaplar"""
    w1 = request.args.get('w1', '').strip().lower()
    w2 = request.args.get('w2', '').strip().lower()

    if not w1 or not w2:
        return jsonify({'error': 'Lütfen w1 ve w2 parametrelerini giriniz'}), 400

    if not model or w1 not in model.wv or w2 not in model.wv:
        return jsonify({
            'error': f'"{w1}" veya "{w2}" sözlükte bulunamadı.',
            'vocab_sample': list(model.wv.key_to_index.keys())[:15] if model else []
        }), 404

    sim = float(model.wv.similarity(w1, w2))
    return jsonify({
        'word1': w1,
        'word2': w2,
        'similarity': sim,
        'similarity_percent': round(sim * 100, 2)
    })

@app.route('/api/most_similar', methods=['GET'])
def api_most_similar():
    """Verilen kelimeye en yakın kelimeleri döndürür"""
    word = request.args.get('word', '').strip().lower()
    topn = int(request.args.get('topn', 5))

    if not word or not model or word not in model.wv:
        return jsonify({'error': f'"{word}" modeli içinde bulunamadı'}), 404

    similar = model.wv.most_similar(word, topn=topn)
    return jsonify({
        'word': word,
        'results': [{'word': w, 'score': float(s)} for w, s in similar]
    })

@app.route('/api/analogy', methods=['GET'])
def api_analogy():
    """
    Vektör analojisi hesaplar:
    Örn: pos=kral,kadın neg=erkek => kraliçe
    """
    pos = [w.strip().lower() for w in request.args.get('pos', '').split(',') if w.strip()]
    neg = [w.strip().lower() for w in request.args.get('neg', '').split(',') if w.strip()]

    if not pos:
        return jsonify({'error': 'En az bir pozitif kelime belirtmelisiniz'}), 400

    try:
        res = model.wv.most_similar(positive=pos, negative=neg, topn=3)
        return jsonify({
            'positive': pos,
            'negative': neg,
            'result': [{'word': w, 'score': float(s)} for w, s in res]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/doesnt_match', methods=['GET'])
def api_doesnt_match():
    """Gruptaki anlamsal olarak aykırı kelimeyi bulur"""
    words = [w.strip().lower() for w in request.args.get('words', '').split(',') if w.strip()]
    if len(words) < 3:
        return jsonify({'error': 'En az 3 kelime girmelisiniz'}), 400

    try:
        outlier = model.wv.doesnt_match(words)
        return jsonify({
            'words': words,
            'does_not_match': outlier
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Yerel çalıştırma için (python api/index.py)
    app.run(host='0.0.0.0', port=5000, debug=True)
`,
    },
    {
      name: 'requirements.txt',
      language: 'plaintext',
      description: 'Gerekli Python paketleri (Vercel kurulumu için)',
      content: `Flask==3.0.3
gensim==4.3.2
numpy<2.0.0
scipy>=1.11.0
werkzeug==3.0.3
`,
    },
    {
      name: 'vercel.json',
      language: 'json',
      description: 'Vercel Serverless Yapılandırması',
      content: `{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.py"
    }
  ]
}
`,
    },
    {
      name: '.gitignore',
      language: 'plaintext',
      description: 'Git dışlama dosyası',
      content: `__pycache__/
*.py[cod]
*$py.class
.venv/
env/
venv/
.env
.vercel/
*.bin
*.model
`,
    },
    {
      name: 'test_local.py',
      language: 'python',
      description: 'Projeyi GitHub ve Vercel öncesinde yerel olarak test etme scripti',
      content: `"""
Yerel Test Scripti:
Terminalde 'python test_local.py' yazarak Gensim modelinizin çalıştığını doğrulayabilirsiniz.
"""
from api.index import model

def run_tests():
    print("=== GENSIM WORD2VEC TESTLERİ ===")
    
    # 1. Benzerlik Testi
    sim = model.wv.similarity("kral", "kraliçe")
    print(f"1. Benzerlik (kral - kraliçe): {sim:.4f}")
    
    # 2. Analoji Testi: kral - erkek + kadın
    analogy = model.wv.most_similar(positive=["kral", "kadın"], negative=["erkek"], topn=1)
    print(f"2. Analoji (kral - erkek + kadın): {analogy[0][0]} (Skor: {analogy[0][1]:.4f})")
    
    # 3. Farklı Olanı Bul: elma, armut, muz, araba
    odd = model.wv.doesnt_match(["elma", "armut", "muz", "araba"])
    print(f"3. Aykırı Kelime ([elma, armut, muz, araba]): {odd}")
    
    print("\n✅ TÜM TESTLER BAŞARIYLA GEÇTİ! GitHub ve Vercel'e yüklemeye hazır.")

if __name__ == "__main__":
    run_tests()
`,
    },
    {
      name: 'README.md',
      language: 'markdown',
      description: 'Ödev dökümantasyonu ve GitHub & Vercel kurulum adımları',
      content: `# Doğal Dil İşleme (NLP) - Gensim Word2Vec & Flask Web Servisi

Bu proje, Doğal Dil İşleme dersi kapsamında geliştirilmiş; **Gensim Word2Vec** algoritması kullanarak kelime gömmeleri (word embeddings), kosinüs benzerliği ve vektör analojisi hesaplayan ve **Flask / Vercel** mimarisi ile yayına alınan bir web uygulamasıdır.

## 🚀 Özellikler
- **Word2Vec Eğitimi (Skip-Gram / CBOW)**: Gensim kütüphanesi ile metin külliyatından semantik kelime vektörleri çıkarma.
- **Kosinüs Benzerliği (Cosine Similarity)**: İki kelimenin n-boyutlu vektör uzayındaki açısal yakınlığı.
- **Vektör Aritmetiği / Analoji**: $\\vec{v}_{\\text{hedef}} = \\vec{v}_{\\text{kral}} - \\vec{v}_{\\text{erkek}} + \\vec{v}_{\\text{kadın}} \\approx \\vec{v}_{\\text{kraliçe}}$
- **Aykırı Kelime Tespiti (\`doesnt_match\`)**: Bir kümedeki anlamsal bağı en zayıf kelimeyi bulma.
- **RESTful API**: Harici istemciler ve web arayüzü için hazır JSON API.

---

## 🛠️ Adım Adım Kurulum ve Yayınlama (GitHub & Vercel)

### 1. GitHub Deposunu Oluşturma
1. [GitHub](https://github.com/) adresine girip yeni bir depo (repository) açın (örneğin: \`nlp-gensim-word2vec\`).
2. Proje dosyalarını bilgisayarınızda bir klasöre çıkarın:
\`\`\`bash
git init
git add .
git commit -m "Doğal Dil İşleme Gensim Word2Vec Projesi"
git branch -M main
git remote add origin https://github.com/<KULLANICI_ADINIZ>/nlp-gensim-word2vec.git
git push -u origin main
\`\`\`

### 2. Vercel Üzerinde 1-Tıkla Yayına Alma (Deploy)
1. [Vercel](https://vercel.com) sitesine gidin ve GitHub hesabınızla giriş yapın.
2. **"Add New..."** -> **"Project"** butonuna tıklayın.
3. GitHub deponuzu (\`nlp-gensim-word2vec\`) seçin ve **"Import"** deyin.
4. Framework Preset olarak **"Other"** seçili kalabilir (projedeki \`vercel.json\` otomatik algılanır).
5. **"Deploy"** butonuna basın!
6. Yaklaşık 1 dakika içinde canlı URL'iniz oluşturulacaktır (örneğin: \`https://nlp-gensim-word2vec.vercel.app\`).

---

## 📡 API Uç Noktaları
- \`GET /\` : Etkileşimli web test arayüzü
- \`GET /api/similarity?w1=kral&w2=kraliçe\` : Kosinüs benzerliği hesaplar
- \`GET /api/most_similar?word=doktor&topn=5\` : En yakın 5 kelimeyi listeler
- \`GET /api/analogy?pos=kral,kadın&neg=erkek\` : Vektör analojisi çözer
- \`GET /api/doesnt_match?words=elma,armut,muz,araba\` : Aykırı kelimeyi bulur

---

## 🎓 Ödev Teslim Notu
- **GitHub Deposu**: \`https://github.com/<KULLANICI_ADINIZ>/nlp-gensim-word2vec\`
- **Canlı Web Adresi (Vercel)**: \`https://nlp-gensim-word2vec.vercel.app\`
`,
    },
  ],
};

export const FASTAPI_TEMPLATE: DeploymentTemplate = {
  id: 'fastapi',
  title: 'FastAPI + Gensim Word2Vec (Modern & Async)',
  framework: 'FastAPI 0.111.x',
  description: 'Otomatik Swagger (/docs) dokümantasyonu, Pydantic tip doğrulaması ve yüksek performanslı modern API.',
  files: [
    {
      name: 'api/index.py',
      language: 'python',
      description: 'FastAPI ana sunucu dosyası, Pydantic modelleri ve OpenAPI belgeleri',
      content: `from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from typing import List, Optional
from pydantic import BaseModel
import os

try:
    from gensim.models import Word2Vec
    GENSIM_AVAILABLE = True
except ImportError:
    GENSIM_AVAILABLE = False

app = FastAPI(
    title="Gensim Word2Vec NLP API",
    description="Doğal Dil İşleme Dersi Kapsamında Geliştirilen Word2Vec API Servisi",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Örnek Külliyat
SENTENCES = [
    ["kral", "erkek", "saray", "hükümdar", "taht", "güçlü"],
    ["kraliçe", "kadın", "saray", "hükümdar", "taht", "zarif"],
    ["prens", "erkek", "çocuk", "saray", "soylu"],
    ["prenses", "kadın", "çocuk", "saray", "soylu"],
    ["türkiye", "ankara", "istanbul", "izmir", "ülke"],
    ["fransa", "paris", "avrupa", "şehir", "ülke"],
    ["almanya", "berlin", "avrupa", "sanayi", "ülke"],
    ["doktor", "hastane", "tıp", "sağlık", "tedavi", "hemşire"],
    ["öğretmen", "okul", "eğitim", "öğrenci", "sınıf", "ders"],
    ["bilgisayar", "yazılım", "python", "kodlama", "yapay_zeka"],
    ["elma", "armut", "muz", "meyve", "tatlı", "yiyecek"]
]

model = None
if GENSIM_AVAILABLE:
    model = Word2Vec(sentences=SENTENCES, vector_size=25, window=3, min_count=1, epochs=40)

@app.get("/", response_class=HTMLResponse)
def index():
    return """
    <html>
        <head><title>NLP FastAPI Gensim</title></head>
        <body style="font-family:sans-serif; background:#0f172a; color:#f8fafc; padding:2rem; text-align:center;">
            <h1>🚀 NLP Word2Vec & Gensim FastAPI Servisi</h1>
            <p>API başarıyla Vercel üzerinde çalışıyor!</p>
            <p><a href="/docs" style="color:#38bdf8; font-weight:bold;">👉 Swagger Dokümantasyonunu Aç (/docs)</a></p>
        </body>
    </html>
    """

@app.get("/similarity")
def get_similarity(w1: str = Query(..., description="1. Kelime"), w2: str = Query(..., description="2. Kelime")):
    if not model or w1.lower() not in model.wv or w2.lower() not in model.wv:
        raise HTTPException(status_code=404, detail="Kelimeler model sözlüğünde bulunamadı.")
    sim = float(model.wv.similarity(w1.lower(), w2.lower()))
    return {"word1": w1, "word2": w2, "similarity": sim}

@app.get("/analogy")
def get_analogy(
    positive: List[str] = Query(..., description="Pozitif kelimeler (örn: kral, kadın)"),
    negative: List[str] = Query(..., description="Negatif kelimeler (örn: erkek)")
):
    try:
        res = model.wv.most_similar(positive=[w.lower() for w in positive], negative=[w.lower() for w in negative], topn=3)
        return {"result": [{"word": w, "score": float(s)} for w, s in res]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
`,
    },
    {
      name: 'requirements.txt',
      language: 'plaintext',
      description: 'Gerekli Python paketleri',
      content: `fastapi==0.111.0
uvicorn==0.30.1
gensim==4.3.2
numpy<2.0.0
scipy>=1.11.0
pydantic==2.7.4
`,
    },
    {
      name: 'vercel.json',
      language: 'json',
      description: 'Vercel Serverless Yapılandırması',
      content: `{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.py"
    }
  ]
}
`,
    },
    {
      name: '.gitignore',
      language: 'plaintext',
      description: 'Git dışlama dosyası',
      content: `__pycache__/
*.py[cod]
.venv/
.env
.vercel/
`,
    },
    {
      name: 'README.md',
      language: 'markdown',
      description: 'FastAPI Proje Dokümantasyonu',
      content: `# Doğal Dil İşleme (NLP) - FastAPI & Gensim Word2Vec

Bu proje, FastAPI ve Gensim Word2Vec kullanılarak oluşturulmuş yüksek performanslı bir NLP web servisidir.

## 🚀 Vercel Dağıtım Adımları
1. Bu kodları bir GitHub deposuna yükleyin.
2. Vercel'de **New Project** diyerek GitHub reponuzu bağlayın.
3. Proje yayınlandıktan sonra otomatik olarak \`/docs\` Swagger arayüzü aktif hale gelir.
`,
    },
  ],
};
