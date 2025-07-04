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

// --- Main Menu Component ---
const MenuUtama = ({ onSelect }) => (
    <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border w-full max-w-4xl mx-auto animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-slate-700 mb-8">Pilih Materi yang Ingin Dipelajari:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => onSelect('definisi')} className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Definisi Artificial Intelligence</button>
            <button onClick={() => onSelect('sejarah')} className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Sejarah Perkembangan AI</button>
            <button className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Jenis-jenis AI</button>
            <button className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Komponen Utama AI</button>
            <button className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Aplikasi AI dalam Kehidupan</button>
            <button className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Masa Depan AI</button>
            <button className="text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300 font-semibold text-slate-700">Peluang Karir di Bidang AI</button>
        </div>
    </div>
);


// --- Main Pengenalan AI Page Component ---
export default function PengenalanAiPage() {
    const [activeSection, setActiveSection] = useState('menu');

    const renderContent = () => {
        switch (activeSection) {
            case 'definisi':
                return <DefinisiSection onBack={() => setActiveSection('menu')} />;
            case 'sejarah':
                return <SejarahSection onBack={() => setActiveSection('menu')} />;
            // Add cases for other sections here
            case 'menu':
            default:
                return <MenuUtama onSelect={setActiveSection} />;
        }
    };

    return (
        <>
            {/* Header Section */}
            <section className="bg-indigo-600 text-white text-center py-16 px-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <h1 className="text-4xl font-bold">Pengenalan Artificial Intelligence</h1>
                <p className="text-lg mt-2 opacity-90">Memahami dasar-dasar kecerdasan buatan dan perkembangannya</p>
            </section>

            {/* Content Section */}
            <section className="py-12 px-4 bg-gray-50">
                <div className="container mx-auto">
                    {renderContent()}
                </div>
            </section>
        </>
    );
}
