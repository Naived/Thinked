import React from 'react';

export default function AboutUsPage() {
    const team = [
        {
          fullName: 'Farrel Zhafif Kusumadhana',
          nickname: 'Farrel',
          role: 'Product Owner',
          contribution: `Farrel berperan sebagai pengarah utama dalam pengembangan produk. Ia menetapkan prioritas fitur dan memastikan produk yang dikembangkan sesuai dengan kebutuhan pengguna. Selain itu, ia mengelola backlog, menyampaikan visi produk kepada tim, serta menjaga koordinasi dengan pihak eksternal.`,
          personality: `Farrel dikenal sebagai sosok visioner dengan kemampuan komunikasi yang kuat, meskipun terkadang perlu diarahkan kembali agar ruang lingkup proyek tetap realistis dan sesuai dengan kapasitas serta waktu tim.`,
        },
        {
          fullName: 'Devin Branwen',
          nickname: 'Devin',
          role: 'Scrum Master',
          contribution: `Devin bertugas sebagai fasilitator tim, memastikan proses kerja sesuai dengan prinsip Agile. Ia memimpin daily stand-up, perencanaan sprint, dan retrospektif. Ia juga membantu menyelesaikan hambatan yang muncul serta menjaga kestabilan ritme kerja tim.`,
          personality: `Devin dikenal sebagai pribadi yang tenang, terorganisir, dan konsisten dalam menciptakan alur kerja yang sehat.`,
        },
        {
          fullName: 'Daffa Fadhil Rajendra',
          nickname: 'Fadhil',
          role: 'Development Team',
          contribution: `Fadhil memimpin pengembangan antarmuka pengguna aplikasi, mencakup halaman login, dashboard siswa, leaderboard, dan modul materi. Ia fokus menciptakan desain yang ramah pengguna, konsisten, dan responsif di berbagai perangkat.`,
          personality: `Fadhil dikenal sebagai developer yang teliti dan detail-oriented, selalu mengutamakan kenyamanan pengguna dalam merancang tampilan.`,
        },
        {
          fullName: 'Ida Bagus Gede Krisna Arsana',
          nickname: 'Krisna',
          role: 'Development Team',
          contribution: `Krisna bertanggung jawab atas sistem backend, termasuk fitur login, manajemen data pengguna, penyimpanan nilai kuis, serta integrasi antara frontend dan database.`,
          personality: `Krisna dikenal sebagai sosok yang teliti, berpikir logis, dan andal dalam merancang arsitektur backend yang dapat diskalakan.`,
        },
        {
          fullName: 'Bima Handriano Putra',
          nickname: 'Bima',
          role: 'Development Team',
          contribution: `Bima mendukung pengembangan frontend tambahan dan membantu integrasi data dari backend ke antarmuka. Ia juga berkontribusi dalam pengembangan fitur kuis dan leaderboard.`,
          personality: `Bima dikenal sebagai individu yang cepat belajar, adaptif, dan selalu siap membantu berbagai tugas teknis sesuai kebutuhan sprint.`,
        },
      ];

  return (
    <div className="w-full px-4 py-8 mx-auto max-w-3xl text-center">
  <div className="mb-8">
    <h1 className="text-4xl font-bold text-slate-800 mb-4">Tentang Kami</h1>
    <p className="text-slate-600 leading-relaxed">
      Kami adalah tim pengembang yang berdedikasi untuk menciptakan platform pembelajaran interaktif berbasis teknologi terkini.
      Misi kami adalah menjadikan proses belajar lebih menyenangkan, mudah diakses, dan relevan dengan kebutuhan masa kini.
    </p>
  </div>

  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-slate-800 mb-2">Apa yang Kami Lakukan?</h2>
    <ul className="list-disc list-inside text-slate-600 space-y-1 text-left inline-block">
      <li>Mengembangkan sistem kuis interaktif untuk pembelajaran mandiri</li>
      <li>Menyediakan dashboard analitik untuk siswa dan pengajar</li>
      <li>Integrasi materi pembelajaran berbasis AI</li>
      <li>Mendukung pengalaman belajar yang adaptif</li>
    </ul>
  </div>

  <div className="mb-8">
    <h2 className="text-2xl font-semibold text-slate-800 mb-4">Tim Kami</h2>
    <div className="space-y-4">
      {team.map((member, index) => (
        <div
          key={index}
          className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-all duration-200 text-left"
        >
          <h3 className="text-xl font-bold text-slate-800">
            {member.fullName} <span className="text-sm font-normal text-slate-500">({member.nickname})</span>
          </h3>
          <p className="text-sm text-blue-600 font-medium mb-1">{member.role}</p>
          <p className="text-slate-600 mb-1">{member.contribution}</p>
          <p className="italic text-slate-500">{member.personality}</p>
        </div>
      ))}
    </div>
  </div>

  <div>
    <h2 className="text-2xl font-semibold text-slate-800 mb-2">Kontak</h2>
    <p className="text-slate-600">
      Jika Anda memiliki pertanyaan, saran, atau ingin bekerja sama, silakan hubungi kami melalui email di{' '}
      <span className="text-blue-600 underline cursor-pointer">thinked.edu@gmail.com</span>.
    </p>
  </div>
</div>
  );
}
