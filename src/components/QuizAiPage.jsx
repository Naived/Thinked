// components/QuizAIPage.jsx
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'; // Impor query dan where

export default function QuizAIPage({ setStudentPage, db }) { // Menerima 'db' sebagai prop

    // --- State Management ---
    const [quizStage, setQuizStage] = useState('levelSelection'); // 'levelSelection', 'quizInterface', 'results'

    const [currentLevel, setCurrentLevel] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]); // State untuk soal yang diambil dari Firestore
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false); // State untuk indikator loading
    const [error, setError] = useState(null); // State untuk pesan error

    const [correctCount, setCorrectCount] = useState(0);
    const [percentageScore, setPercentageScore] = useState(0);

    // --- Data Quiz Statis (Fallback/Struktur Awal, Akan Diganti dengan Firestore) ---
    // Anda bisa menghapus ini jika semua soal pasti dari Firestore
    // Namun, ini berguna sebagai struktur data yang diharapkan dari Firestore
    const staticQuizDataStructure = {
        beginner: [], // Akan diisi dari Firestore
        intermediate: [], // Akan diisi dari Firestore
        advanced: [] // Akan diisi dari Firestore
    };

    const levelNames = { // Digunakan untuk display nama level
        'beginner': 'Pemula',
        'intermediate': 'Menengah',
        'advanced': 'Lanjutan'
    };

    // --- Firebase Fetching Logic ---
    const fetchQuizQuestions = async (level) => {
        setIsLoadingQuestions(true);
        setError(null);
        try {
            // Pastikan Anda memiliki koleksi 'quizzes' di Firestore
            // Dan setiap dokumen soal memiliki field 'topic' (misal: 'ai') dan 'level' (misal: 'beginner')
            const q = query(
                collection(db, "quizzes"),
                where("topic", "==", "pengenalan-ai"), // Sesuaikan dengan topic yang Anda simpan di Firestore
                where("level", "==", level)
            );
            const querySnapshot = await getDocs(q);
            const questionsList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                // Konversi opsi dari object {A: "...", B: "..."} ke array ["...", "..."]
                // Dan konversi jawaban 'A', 'B' ke indeks 0, 1
                const optionsArray = [data.options.A, data.options.B, data.options.C, data.options.D];
                const correctIndex = data.answer ? data.answer.charCodeAt(0) - 65 : -1; // 'A' -> 0, 'B' -> 1, dst.

                return {
                    id: doc.id,
                    question: data.question,
                    options: optionsArray,
                    correct: correctIndex, // Simpan sebagai indeks
                    explanation: data.explanation || "Tidak ada penjelasan."
                };
            });
            setCurrentQuizQuestions(questionsList);

        } catch (err) {
            console.error("Error fetching quiz questions:", err);
            setError("Gagal memuat soal quiz. Periksa koneksi atau database Anda.");
        } finally {
            setIsLoadingQuestions(false);
        }
    };

    // useEffect untuk memicu pengambilan data saat level dipilih
    useEffect(() => {
        if (currentLevel && db) { // Pastikan db sudah tersedia
            fetchQuizQuestions(currentLevel);
        }
    }, [currentLevel, db]); // Dependensi: currentLevel dan db

    // useEffect untuk pindah stage setelah data pertanyaan dimuat
    useEffect(() => {
        if (currentLevel && !isLoadingQuestions && currentQuizQuestions.length > 0 && quizStage === 'levelSelection') {
            setQuizStage('quizInterface'); // Pindah ke antarmuka quiz setelah soal dimuat
        } else if (currentLevel && !isLoadingQuestions && currentQuizQuestions.length === 0 && quizStage === 'levelSelection') {
            setError("Tidak ada soal untuk level ini. Coba level lain atau hubungi admin.");
            setCurrentLevel(''); // Reset level agar bisa memilih lagi
            setIsLoadingQuestions(false); // Pastikan loading false
        }
    }, [currentLevel, isLoadingQuestions, currentQuizQuestions, quizStage]); // Dependensi untuk efek ini


    // --- Quiz Logic Functions ---

    // Memulai quiz pada level tertentu
    const startQuiz = (level) => {
        setCurrentLevel(level); // Ini akan memicu useEffect untuk fetch data
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setSelectedAnswer(null);
        setError(null); // Reset error saat memulai quiz baru
        // setQuizStage akan diatur oleh useEffect setelah fetch selesai
    };

    // Memilih opsi jawaban
    const selectOption = (optionIndex) => {
        setSelectedAnswer(optionIndex);
    };

    // Pindah ke pertanyaan berikutnya
    const nextQuestion = () => {
        if (selectedAnswer !== null) {
            const updatedAnswers = [...userAnswers];
            updatedAnswers[currentQuestionIndex] = selectedAnswer;
            setUserAnswers(updatedAnswers);

            if (currentQuestionIndex < currentQuizQuestions.length - 1) { // Periksa dari currentQuizQuestions
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                setSelectedAnswer(null); // Reset pilihan untuk pertanyaan baru
            } else {
                // Jika ini pertanyaan terakhir dan sudah dijawab
                finishQuiz();
            }
        }
    };

    // Pindah ke pertanyaan sebelumnya
    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            const updatedAnswers = [...userAnswers];
            // Simpan jawaban saat ini sebelum mundur
            if (selectedAnswer !== null) {
                updatedAnswers[currentQuestionIndex] = selectedAnswer;
            }
            setUserAnswers(updatedAnswers);

            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
            // Muat kembali jawaban sebelumnya jika ada
            setSelectedAnswer(updatedAnswers[currentQuestionIndex - 1] || null);
        }
    };

    // Submit quiz (dipanggil di akhir)
    const submitQuiz = () => {
        if (selectedAnswer !== null) {
            const updatedAnswers = [...userAnswers];
            updatedAnswers[currentQuestionIndex] = selectedAnswer;
            setUserAnswers(updatedAnswers);
        }
        finishQuiz();
    };

    // Menyelesaikan quiz dan menghitung hasil
    const finishQuiz = () => {
        let correct = 0;
        const questions = currentQuizQuestions; // Ambil dari state
        userAnswers.forEach((answer, index) => {
            if (answer === questions[index].correct) {
                correct++;
            }
        });
        setCorrectCount(correct);
        setPercentageScore(Math.round((correct / questions.length) * 100));
        setQuizStage('results');
    };

    // Mengulang quiz
    const restartQuiz = () => {
        setQuizStage('levelSelection');
        setCurrentLevel('');
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setSelectedAnswer(null);
        setCurrentQuizQuestions([]); // Kosongkan soal yang sudah diambil
        setError(null);
    };

    // Kembali ke halaman pilihan quiz topik
    const backToQuizTopics = () => {
        setStudentPage('quiz'); // Kembali ke halaman QuizTopicsPage
    };

    // --- Conditional Rendering ---
    const renderContent = () => {
        if (isLoadingQuestions) { // Tampilkan loading saat soal sedang diambil
            return (
                <div className="text-center text-white mt-8">
                    <div className="spinner" style={{ border: '4px solid rgba(255,255,255,.2)', borderTop: '4px solid #fff', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: 'auto' }}></div>
                    <p style={{ marginTop: '10px' }}>Memuat soal quiz...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            );
        }

        if (error) { // Tampilkan pesan error jika ada
            return (
                <div className="text-center text-red-400 mt-8">
                    <p>{error}</p>
                    <button onClick={restartQuiz} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Coba Lagi</button>
                </div>
            );
        }

        if (quizStage === 'levelSelection') {
            return (
                <div className="level-selection">
                    <div className="quiz-container" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <div className="quiz-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>🤖 Quiz Pengenalan AI</h1>
                            <p style={{ fontSize: '18px', color: '#555' }}>Pilih tingkat kesulitan quiz yang sesuai dengan level pengetahuan Anda</p>
                        </div>

                        <div className="level-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
                            {/* Card Pemula */}
                            <div
                                className="level-card"
                                onClick={() => startQuiz('beginner')}
                                style={{ background: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease', cursor: 'pointer' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div className="level-icon" style={{ fontSize: '36px', marginBottom: '15px', display: 'inline-block' }}>🌱</div>
                                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Pemula</h3>
                                <p style={{ fontSize: '15px', color: '#666', marginBottom: '15px' }}>Konsep dasar AI, sejarah, dan definisi fundamental</p>
                                <div className="level-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span className="question-count" style={{ fontSize: '14px', color: '#888' }}>{staticQuizDataStructure.beginner.length || '?'} Pertanyaan</span>
                                    <span className="difficulty easy" style={{ background: '#d4edda', color: '#155724', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>Mudah</span>
                                </div>
                                <button className="level-btn" style={{ background: '#667eea', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>Mulai Quiz</button>
                            </div>

                            {/* Card Menengah */}
                            <div
                                className="level-card"
                                onClick={() => startQuiz('intermediate')}
                                style={{ background: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease', cursor: 'pointer' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div className="level-icon" style={{ fontSize: '36px', marginBottom: '15px', display: 'inline-block' }}>🎯</div>
                                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Menengah</h3>
                                <p style={{ fontSize: '15px', color: '#666', marginBottom: '15px' }}>Aplikasi AI, algoritma dasar, dan implementasi teknologi</p>
                                <div className="level-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span className="question-count" style={{ fontSize: '14px', color: '#888' }}>{staticQuizDataStructure.intermediate.length || '?'} Pertanyaan</span>
                                    <span className="difficulty medium" style={{ background: '#ffeeba', color: '#856404', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>Sedang</span>
                                </div>
                                <button className="level-btn" style={{ background: '#764ba2', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>Mulai Quiz</button>
                            </div>

                            {/* Card Lanjutan */}
                            <div
                                className="level-card"
                                onClick={() => startQuiz('advanced')}
                                style={{ background: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease', cursor: 'pointer' }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div className="level-icon" style={{ fontSize: '36px', marginBottom: '15px', display: 'inline-block' }}>🚀</div>
                                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>Lanjutan</h3>
                                <p style={{ fontSize: '15px', color: '#666', marginBottom: '15px' }}>Konsep mendalam, etika AI, dan perkembangan terkini</p>
                                <div className="level-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span className="question-count" style={{ fontSize: '14px', color: '#888' }}>{staticQuizDataStructure.advanced.length || '?'} Pertanyaan</span>
                                    <span className="difficulty hard" style={{ background: '#f8d7da', color: '#721c24', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>Sulit</span>
                                </div>
                                <button className="level-btn" style={{ background: '#4facfe', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>Mulai Quiz</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (quizStage === 'quizInterface') {
            const question = currentQuizQuestions[currentQuestionIndex];
            const totalQuestions = currentQuizQuestions.length;
            const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

            return (
                <div className="quiz-interface">
                    <div className="quiz-container" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <div className="quiz-progress" style={{ marginBottom: '20px' }}>
                            <div className="progress-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '16px', color: '#555' }}>
                                <span className="current-question">Pertanyaan <span id="currentQuestionNumber">{currentQuestionIndex + 1}</span></span>
                                <span className="total-questions">dari <span id="totalQuestions">{totalQuestions}</span></span>
                                <span className="quiz-level" style={{ fontWeight: 'bold', color: '#4f46e5' }}>{levelNames[currentLevel]}</span>
                            </div>
                            <div className="progress-bar" style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                                <div className="progress-fill" style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: '4px', transition: 'width 0.5s ease-in-out' }}></div>
                            </div>
                        </div>

                        <div className="question-card" style={{ background: '#fff', borderRadius: '15px', padding: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                            <h2 className="question-title" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>{question.question}</h2>
                            <div className="question-options" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {question.options.map((option, index) => (
                                    <div
                                        key={index}
                                        className={`option ${selectedAnswer === index ? 'selected' : ''}`}
                                        onClick={() => selectOption(index)}
                                        style={{
                                            background: selectedAnswer === index ? '#e6e6fa' : '#f0f0f0',
                                            border: selectedAnswer === index ? '2px solid #667eea' : '1px solid #ddd',
                                            borderRadius: '10px',
                                            padding: '15px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontWeight: selectedAnswer === index ? 'bold' : 'normal',
                                            color: selectedAnswer === index ? '#4f46e5' : '#333'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = selectedAnswer === index ? '#e6e6fa' : '#e9e9e9'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = selectedAnswer === index ? '#e6e6fa' : '#f0f0f0'}
                                    >
                                        <span className="option-letter" style={{
                                            display: 'inline-flex', justifyContent: 'center', alignItems: 'center',
                                            width: '30px', height: '30px', borderRadius: '50%', background: '#667eea', color: 'white',
                                            fontWeight: 'bold', fontSize: '16px', marginRight: '15px'
                                        }}>{String.fromCharCode(65 + index)}</span>
                                        <span className="option-text">{option}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="quiz-controls" style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                            <button
                                className="control-btn secondary"
                                onClick={previousQuestion}
                                disabled={currentQuestionIndex === 0}
                                style={{ background: '#e0e0e0', color: '#333', padding: '12px 25px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s ease', flex: 1, opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
                            >
                                ← Sebelumnya
                            </button>
                            {currentQuestionIndex < totalQuestions - 1 ? (
                                <button
                                    className="control-btn primary"
                                    onClick={nextQuestion}
                                    disabled={selectedAnswer === null}
                                    style={{ background: '#667eea', color: 'white', padding: '12px 25px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s ease', flex: 1, opacity: selectedAnswer === null ? 0.5 : 1 }}
                                >
                                    Selanjutnya →
                                </button>
                            ) : (
                                <button
                                    className="control-btn primary"
                                    onClick={submitQuiz}
                                    disabled={selectedAnswer === null}
                                    style={{ background: '#764ba2', color: 'white', padding: '12px 25px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s ease', flex: 1, opacity: selectedAnswer === null ? 0.5 : 1 }}
                                >
                                    Selesai Quiz
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        } else if (quizStage === 'results') {
            const icon = percentageScore >= 80 ? '🎉' : (percentageScore >= 60 ? '👍' : '📚');
            const titleText = percentageScore >= 80 ? 'Excellent!' : (percentageScore >= 60 ? 'Good Job!' : 'Keep Learning!');
            const subtitleText = percentageScore >= 80 ? 'Prestasi yang luar biasa!' : (percentageScore >= 60 ? 'Hasil yang baik!' : 'Jangan menyerah!');
            const feedbackText = percentageScore >= 80 ?
                'Anda memiliki pemahaman yang sangat baik tentang AI. Siap untuk tantangan yang lebih tinggi!' :
                (percentageScore >= 60 ?
                    'Anda memiliki dasar yang solid. Dengan sedikit latihan lagi, Anda akan mencapai level expert!' :
                    'Ini adalah langkah awal yang baik. Mari pelajari lebih dalam tentang konsep-konsep AI.');

            return (
                <div className="quiz-results">
                    <div className="quiz-container" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <div className="results-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <div className="results-icon" style={{ fontSize: '48px', marginBottom: '15px' }}>{icon}</div>
                            <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>{titleText}</h2>
                            <p style={{ fontSize: '18px', color: '#555' }}>{subtitleText}</p>
                        </div>

                        <div className="results-stats" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px', gap: '20px' }}>
                            <div className="stat-card" style={{ background: '#f0f0f0', borderRadius: '10px', padding: '20px', flex: 1, textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                <div className="stat-number" style={{ fontSize: '36px', fontWeight: 'bold', color: '#4f46e5', marginBottom: '5px' }}>{correctCount}/{currentQuizQuestions.length}</div>
                                <div className="stat-label" style={{ fontSize: '15px', color: '#666' }}>Jawaban Benar</div>
                            </div>
                            <div className="stat-card" style={{ background: '#f0f0f0', borderRadius: '10px', padding: '20px', flex: 1, textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                <div className="stat-number" style={{ fontSize: '36px', fontWeight: 'bold', color: '#764ba2', marginBottom: '5px' }}>{percentageScore}%</div>
                                <div className="stat-label" style={{ fontSize: '15px', color: '#666' }}>Skor Akhir</div>
                            </div>
                        </div>

                        <div className="results-feedback" style={{ background: '#e6e6fa', borderRadius: '10px', padding: '20px', marginBottom: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>Feedback</h3>
                            <p style={{ fontSize: '16px', color: '#555' }}>{feedbackText}</p>
                        </div>

                        <div className="results-actions" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
                            <button
                                className="control-btn secondary"
                                onClick={restartQuiz}
                                style={{ background: '#e0e0e0', color: '#333', padding: '12px 25px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                            >
                                Ulangi Quiz
                            </button>
                            <button
                                className="control-btn secondary"
                                onClick={backToQuizTopics}
                                style={{ background: '#e0e0e0', color: '#333', padding: '12px 25px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                            >
                                Kembali ke Quiz
                            </button>
                        </div>

                        <div className="results-review" style={{ background: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Review Jawaban</h3>
                            <div className="review-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {currentQuizQuestions.map((q, index) => {
                                    const isCorrect = userAnswers[index] === q.correct;
                                    const userAnswerText = userAnswers[index] !== undefined && userAnswers[index] !== null ?
                                                           q.options[userAnswers[index]] : 'Tidak dijawab';
                                    return (
                                        <div key={index} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}
                                             style={{
                                                background: isCorrect ? '#eaf7ed' : '#fbebeb', // Latar belakang hijau/merah
                                                border: isCorrect ? '1px solid #c3e6cb' : '1px solid #f5c6cb', // Border hijau/merah
                                                borderRadius: '10px',
                                                padding: '15px',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                            }}>
                                            <div className="review-question" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <span className="review-number" style={{ fontWeight: 'bold', marginRight: '10px', color: '#555' }}>Q{index + 1}</span>
                                                <span className="review-status" style={{ fontSize: '20px' }}>{isCorrect ? '✅' : '❌'}</span>
                                            </div>
                                            <div className="review-content" style={{ fontSize: '15px', color: '#333' }}>
                                                <p className="review-question-text" style={{ fontWeight: 'bold', marginBottom: '5px' }}>{q.question}</p>
                                                <p className="review-answer" style={{ color: '#28a745' }}>
                                                    <strong>Jawaban Benar:</strong> {q.options[q.correct]}
                                                </p>
                                                {!isCorrect && (
                                                    <p className="review-your-answer" style={{ color: '#dc3545' }}>
                                                        <strong>Jawaban Anda:</strong> {userAnswerText}
                                                    </p>
                                                )}
                                                <p className="review-explanation" style={{ fontSize: '14px', color: '#777', marginTop: '10px', borderLeft: '3px solid #ccc', paddingLeft: '10px' }}>
                                                    {q.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div
            className="main-content"
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Latar belakang untuk seluruh halaman quiz
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite',
                minHeight: '100vh',
                padding: '40px 20px',
                fontFamily: 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start', // Align items to flex-start for top padding
                overflowX: 'hidden'
            }}
        >
            {renderContent()}
        </div>
    );
}