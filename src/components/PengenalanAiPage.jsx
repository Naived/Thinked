import React, { useState } from 'react';

// --- Individual Content Sections ---

const DefinisiSection = ({ onBack }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
        <button onClick={onBack} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 mb-8 transition-colors">← Kembali ke Menu</button>
        <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-200 pb-3">Definisi Artificial Intelligence</h2>
        <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
            <p><strong>Artificial Intelligence (AI)</strong> atau Kecerdasan Buatan adalah cabang ilmu komputer yang bertujuan untuk menciptakan sistem dan mesin yang dapat melakukan tugas-tugas yang biasanya memerlukan kecerdasan manusia. AI mencakup kemampuan seperti pembelajaran, penalaran, persepsi, pemecahan masalah, dan komunikasi.</p>
            <blockquote className="border-l-4 border-indigo-500 pl-6 py-2 bg-indigo-50 rounded-r-lg">
                <p className="italic">"AI adalah ilmu dan rekayasa untuk membuat mesin cerdas, terutama program komputer cerdas."</p>
                <cite className="block text-right mt-2 font-semibold text-indigo-700">- John McCarthy (1956)</cite>
            </blockquote>
            <h3 className="text-2xl font-bold text-slate-800 pt-4">Perbedaan dengan Pemrograman Tradisional</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-md">
                    <thead>
                        <tr className="bg-indigo-600 text-white">
                            <th className="p-4 font-semibold">Aspek</th>
                            <th className="p-4 font-semibold">Pemrograman Tradisional</th>
                            <th className="p-4 font-semibold">Artificial Intelligence</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        <tr className="border-b hover:bg-gray-50"><td className="p-4">Pendekatan</td><td className="p-4">Rule-based, eksplisit</td><td className="p-4">Data-driven, pembelajaran</td></tr>
                        <tr className="border-b hover:bg-gray-50"><td className="p-4">Fleksibilitas</td><td className="p-4">Terbatas pada aturan yang ditetapkan</td><td className="p-4">Adaptif terhadap situasi baru</td></tr>
                        <tr className="hover:bg-gray-50"><td className="p-4">Pembelajaran</td><td className="p-4">Tidak ada pembelajaran otomatis</td><td className="p-4">Belajar dari data dan pengalaman</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const SejarahSection = ({ onBack }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
        <button onClick={onBack} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 mb-8 transition-colors">← Kembali ke Menu</button>
        <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b-2 border-indigo-200 pb-3">Sejarah Perkembangan AI</h2>
        <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
            <p>Perjalanan AI dimulai dari konsep teoretis pada tahun 1940-an, lahir secara resmi pada <strong>Konferensi Dartmouth tahun 1956</strong>, melewati periode optimisme dan "musim dingin AI", hingga revolusi deep learning saat ini yang didorong oleh big data dan kekuatan komputasi.</p>
            <p>Momen penting termasuk kemenangan Deep Blue melawan Garry Kasparov (1997) dan kemenangan AlphaGo melawan Lee Sedol (2016), yang menunjukkan kemajuan pesat dalam kemampuan AI.</p>
        </div>
    </div>
);

const JenisSection = ({ onBack }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in max-w-4xl mx-auto">
        <button onClick={onBack} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 mb-8">← Kembali ke Menu</button>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Jenis-jenis AI</h2>
        <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
            <h3 className="text-2xl font-semibold">Berdasarkan Kemampuan</h3>
            <ul className="list-disc pl-6">
                <li><strong>Narrow AI (ANI):</strong> Fokus pada satu tugas, seperti Siri atau Google Assistant.</li>
                <li><strong>General AI (AGI):</strong> Mampu melakukan berbagai tugas layaknya manusia (masih dikembangkan).</li>
                <li><strong>Super AI (ASI):</strong> Lebih pintar dari manusia (hipotetis).</li>
            </ul>
            <h3 className="text-2xl font-semibold pt-6">Berdasarkan Fungsi</h3>
            <ul className="list-disc pl-6">
                <li><strong>Reactive Machines:</strong> Hanya merespon tanpa ingatan (contoh: Deep Blue).</li>
                <li><strong>Limited Memory:</strong> Menggunakan data masa lalu (contoh: mobil otonom).</li>
                <li><strong>Theory of Mind & Self-aware:</strong> Masih dalam penelitian dan teoretis.</li>
            </ul>
        </div>
    </div>
);

const KomponenSection = ({ onBack }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in max-w-4xl mx-auto">
        <button onClick={onBack} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 mb-8">← Kembali ke Menu</button>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Komponen Utama AI</h2>
        <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
            <h3 className="text-2xl font-semibold">1. Data</h3>
            <p>Data adalah bahan bakar sistem AI.</p>
            <ul className="list-disc pl-6">
                <li>Structured, unstructured, dan semi-structured data</li>
                <li>Kualitas: akurat, lengkap, konsisten, tepat waktu</li>
            </ul>
            <h3 className="text-2xl font-semibold">2. Algoritma</h3>
            <ul className="list-disc pl-6">
                <li>Machine Learning: Supervised, Unsupervised, Reinforcement</li>
                <li>Deep Learning: CNN, RNN, Transformer</li>
            </ul>
            <h3 className="text-2xl font-semibold">3. Computational Power</h3>
            <p>CPU, GPU, TPU, dan Cloud Computing seperti AWS dan GCP</p>
            <h3 className="text-2xl font-semibold">4. Tools & Software</h3>
            <p>Bahasa: Python, R, Java. Framework: TensorFlow, PyTorch, Scikit-learn</p>
        </div>
    </div>
);

const AplikasiSection = ({ onBack }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in max-w-4xl mx-auto">
        <button onClick={onBack} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 mb-8">← Kembali ke Menu</button>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Aplikasi AI dalam Kehidupan</h2>
        <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
            <ul className="list-disc pl-6">
                <li><strong>Kesehatan:</strong> Diagnosa penyakit, pengobatan personalisasi, robot bedah</li>
                <li><strong>Transportasi:</strong> Mobil otonom, prediksi lalu lintas, ride-sharing</li>
                <li><strong>Keuangan:</strong> Deteksi fraud, credit scoring, robo-advisors</li>
                <li><strong>Pendidikan:</strong> Tutor virtual, pembelajaran adaptif</li>
                <li><strong>E-commerce:</strong> Rekomendasi produk, chatbot, visual search</li>
                <li><strong>Manufaktur:</strong> Otomasi, quality control, smart factories</li>
            </ul>
        </div>
    </div>
);

const MasaDepanSection = ({ onBack }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in max-w-4xl mx-auto">
        <button onClick={onBack} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 mb-8">← Kembali ke Menu</button>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Masa Depan AI</h2>
        <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
            <ul className="list-disc pl-6">
                <li>2025-2030: AI narrow superhuman, kendaraan otonom, smart cities</li>
                <li>2030-2040: Menuju AGI, AI multi-domain</li>
                <li>2040-2060: Transformasi sistem pendidikan dan riset</li>
                <li>2060+: Super AI, singularitas teknologi, redefinisi eksistensi</li>
            </ul>
            <h3 className="text-2xl font-semibold">Tantangan & Peluang</h3>
            <ul className="list-disc pl-6">
                <li>Etika, keamanan, privasi, regulasi</li>
                <li>Solusi AI untuk iklim, pendidikan, kesehatan, eksplorasi luar angkasa</li>
            </ul>
        </div>
    </div>
);

const KarirSection = ({ onBack }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in max-w-4xl mx-auto">
        <button onClick={onBack} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 mb-8">← Kembali ke Menu</button>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Peluang Karir di Bidang AI</h2>
        <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
            <ul className="list-disc pl-6">
                <li><strong>Machine Learning Engineer:</strong> Fokus pada model produksi</li>
                <li><strong>Data Scientist:</strong> Analisis dan visualisasi data</li>
                <li><strong>AI Research Scientist:</strong> Penelitian algoritma baru</li>
                <li><strong>AI Product Manager:</strong> Strategi produk AI</li>
                <li><strong>AI Architect:</strong> Arsitektur sistem AI</li>
                <li><strong>AI Ethics Specialist:</strong> Etika dan regulasi AI</li>
            </ul>
            <h3 className="text-2xl font-semibold">Tips Karir AI</h3>
            <ul className="list-disc pl-6">
                <li>Belajar terus-menerus, bangun portofolio</li>
                <li>Networking dan komunitas AI</li>
                <li>Spesialisasi dan soft skills</li>
            </ul>
        </div>
    </div>
);
// For brevity, only the structure is shown above. They follow the same format as DefinisiSection and SejarahSection.

const MenuUtama = ({ onSelect }) => (
    <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border w-full max-w-4xl mx-auto animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-slate-700 mb-8">Pilih Materi yang Ingin Dipelajari:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => onSelect('definisi')} className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Definisi Artificial Intelligence</button>
            <button onClick={() => onSelect('sejarah')} className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Sejarah Perkembangan AI</button>
            <button onClick={() => onSelect('jenis')} className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Jenis-jenis AI</button>
            <button onClick={() => onSelect('komponen')} className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Komponen Utama AI</button>
            <button onClick={() => onSelect('aplikasi')} className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Aplikasi AI dalam Kehidupan</button>
            <button onClick={() => onSelect('masa-depan')} className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Masa Depan AI</button>
            <button onClick={() => onSelect('karir')} className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Peluang Karir di Bidang AI</button>
        </div>
    </div>
);

export default function PengenalanAiPage() {
    const [activeSection, setActiveSection] = useState('menu');

    const renderContent = () => {
        switch (activeSection) {
            case 'definisi':
                return <DefinisiSection onBack={() => setActiveSection('menu')} />;
            case 'sejarah':
                return <SejarahSection onBack={() => setActiveSection('menu')} />;
            case 'jenis':
                return <JenisSection onBack={() => setActiveSection('menu')} />;
            case 'komponen':
                return <KomponenSection onBack={() => setActiveSection('menu')} />;
            case 'aplikasi':
                return <AplikasiSection onBack={() => setActiveSection('menu')} />;
            case 'masa-depan':
                return <MasaDepanSection onBack={() => setActiveSection('menu')} />;
            case 'karir':
                return <KarirSection onBack={() => setActiveSection('menu')} />;
            case 'menu':
            default:
                return <MenuUtama onSelect={setActiveSection} />;
        }
    };

    return (
        <>
            <section className="bg-indigo-600 text-white text-center py-16 px-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <h1 className="text-4xl font-bold">Pengenalan Artificial Intelligence</h1>
                <p className="text-lg mt-2 opacity-90">Memahami dasar-dasar kecerdasan buatan dan perkembangannya</p>
            </section>

            <section className="py-12 px-4 bg-gray-50">
                <div className="container mx-auto">
                    {renderContent()}
                </div>
            </section>
        </>
    );
}
