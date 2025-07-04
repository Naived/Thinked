// components/QuizAiPage.jsx
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

export default function QuizAiPage({ setStudentPage, db }) {

    // --- State Management ---
    const [quizStage, setQuizStage] = useState('levelSelection');
    const [currentLevel, setCurrentLevel] = useState(''); // Akan menyimpan 'beginner', 'intermediate', 'advanced'
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
    const [error, setError] = useState(null);

    const [correctCount, setCorrectCount] = useState(0);
    const [percentageScore, setPercentageScore] = useState(0);

    // NEW STATE: Menyimpan jumlah pertanyaan untuk setiap level
    const [levelQuestionCounts, setLevelQuestionCounts] = useState({});

    // Map internal level codes ('beginner') ke nama level di Firestore ('beginner') dan display name
    const levelMap = {
        'beginner': { firestoreName: 'beginner', displayName: 'Pemula', icon: '🌱' }, // Pastikan ini 'beginner'
        'intermediate': { firestoreName: 'intermediate', displayName: 'Menengah', icon: '🎯' },
        'advanced': { firestoreName: 'advanced', displayName: 'Lanjutan', icon: '🚀' }
    };

    // --- Firebase Fetching Logic ---

    // Fungsi untuk mengambil soal kuis berdasarkan level
    const fetchQuizQuestions = async (levelCode) => {
        setIsLoadingQuestions(true);
        setError(null);

        const firestoreLevelName = levelMap[levelCode]?.firestoreName;
        if (!firestoreLevelName) {
            console.error("Level tidak valid dipilih:", levelCode);
            setError("Level yang dipilih tidak valid.");
            setIsLoadingQuestions(false);
            return;
        }

        try {
            const q = query(
                collection(db, "quizzes"),
                where("topic", "==", "ai"),
                where("level", "==", firestoreLevelName)
            );
            const querySnapshot = await getDocs(q);
            const questionsList = querySnapshot.docs.map(doc => {
                const data = doc.data();
                let optionsArray = [];
                let correctIndex = -1;

                // Menangani format 'option' sebagai array string murni (tanpa "0: A. ")
                if (Array.isArray(data.option)) {
                    optionsArray = data.option.map(opt => opt.trim()); // Hanya trim jika ada spasi
                }
                // Jika Anda juga memiliki format 'options' sebagai objek (dari QuizEditPage.jsx)
                else if (data.options && typeof data.options === 'object') {
                    optionsArray = [data.options.A, data.options.B, data.options.C, data.options.D].filter(Boolean);
                }

                // Pastikan selalu ada 4 slot opsi (bisa null jika kurang)
                while (optionsArray.length < 4) {
                    optionsArray.push(null);
                }

                // Menangani 'answer' yang hanya berupa huruf ('A', 'B', 'C', 'D')
                if (data.answer && typeof data.answer === 'string' && data.answer.length === 1) {
                    correctIndex = data.answer.charCodeAt(0) - 'A'.charCodeAt(0);
                    // Pastikan opsi pada indeks yang benar ada dan tidak null
                    if (correctIndex < 0 || correctIndex >= optionsArray.length || optionsArray[correctIndex] === null) {
                        correctIndex = -1; // Tandai sebagai tidak valid jika opsi tidak ditemukan
                    }
                }

                console.log(`--- Debugging Question ID: ${doc.id} ---`); // Tambahkan ini
                console.log(`  Raw data.answer:`, data.answer); // Tambahkan ini
                console.log(`  Parsed optionsArray:`, optionsArray); // Tambahkan ini
                console.log(`  Calculated correctIndex:`, correctIndex); // Tambahkan ini
                console.log(`  Options valid count:`, optionsArray.filter(Boolean).length); // Tambahkan ini
                console.log(`  Passes correct index check (!= -1):`, correctIndex !== -1); // Tambahkan ini
                console.log(`  Passes options count check (>=3):`, optionsArray.filter(Boolean).length >= 3); // Tambahkan ini
                console.log(`-------------------------------------`); // Tambahkan ini

                return {
                    id: doc.id,
                    question: data.question,
                    options: optionsArray,
                    correct: correctIndex, // Simpan sebagai indeks (0, 1, 2, 3)
                    explanation: data.explanation || "Tidak ada penjelasan."
                };
            })
            // Filter: pastikan ada setidaknya 3 opsi valid dan kunci jawaban teridentifikasi
            .filter(q => q.options.filter(Boolean).length >= 3 && q.correct !== -1);

            console.log("Jumlah pertanyaan setelah filtering:", questionsList.length); // Ini sudah ada, bagus
            console.log("Pertanyaan yang akan digunakan:", questionsList); // Ini sudah ada, bagus

            setCurrentQuizQuestions(questionsList);

        } catch (err) {
            console.error("Error fetching quiz questions:", err);
            setError("Gagal memuat soal quiz. Periksa koneksi atau database Anda. Detail: " + err.message);
        } finally {
            setIsLoadingQuestions(false);
        }
    };

    // useEffect untuk memuat jumlah pertanyaan untuk setiap level saat komponen pertama kali dimuat
    useEffect(() => {
        const fetchAllLevelCounts = async () => {
            if (!db) return;

            const counts = {};
            for (const levelCode in levelMap) {
                const firestoreLevelName = levelMap[levelCode].firestoreName;
                try {
                    const q = query(
                        collection(db, "quizzes"),
                        where("topic", "==", "ai"),
                        where("level", "==", firestoreLevelName)
                    );
                    const querySnapshot = await getDocs(q);

                    const filteredQuestionsCount = querySnapshot.docs.filter(doc => {
                        const data = doc.data();
                        let optionsArray = [];
                        let correctIndex = -1;

                        if (Array.isArray(data.option)) {
                            optionsArray = data.option.map(opt => opt.trim());
                        } else if (data.options && typeof data.options === 'object') {
                            optionsArray = [data.options.A, data.options.B, data.options.C, data.options.D].filter(Boolean);
                        }
                        while (optionsArray.length < 4) {
                            optionsArray.push(null);
                        }

                        if (data.answer && typeof data.answer === 'string' && data.answer.length === 1) {
                            correctIndex = data.answer.charCodeAt(0) - 'A'.charCodeAt(0);
                            if (correctIndex < 0 || correctIndex >= optionsArray.length || optionsArray[correctIndex] === null) {
                                correctIndex = -1;
                            }
                        }
                        return optionsArray.filter(Boolean).length >= 3 && correctIndex !== -1;
                    }).length;

                    counts[levelCode] = filteredQuestionsCount;
                } catch (err) {
                    console.error(`Error fetching count for level ${firestoreLevelName}:`, err);
                    counts[levelCode] = 0;
                }
            }
            setLevelQuestionCounts(counts);
        };

        fetchAllLevelCounts();
    }, [db]); // Dependensi: db


    // useEffect untuk memicu pengambilan data saat level dipilih
    // useEffect(() => {
    //     if (currentLevel && db) {
    //         fetchQuizQuestions(currentLevel);
    //     }
    // }, [currentLevel, db]);

    // useEffect untuk pindah stage setelah data pertanyaan dimuat
    useEffect(() => {
        
        console.log('--- useEffect Stage Transition Dipicu ---');
        console.log('currentLevel saat useEffect:', currentLevel);
        console.log('isLoadingQuestions saat useEffect:', isLoadingQuestions);
        console.log('currentQuizQuestions.length saat useEffect:', currentQuizQuestions.length);
        console.log('quizStage saat useEffect:', quizStage);
        console.log('----------------------------------------');
        if (!isLoadingQuestions && quizStage === 'levelSelection' && currentLevel) {
            if (currentQuizQuestions.length > 0) {
                console.log('Kondisi transisi terpenuhi: Mengatur quizStage ke "quizInterface"');
                setQuizStage('quizInterface');
                setError(null); // Penting: Bersihkan error jika berhasil
            } else {
                // Ini akan terpicu jika fetch selesai tapi tidak ada soal yang ditemukan
                console.log('Kondisi error terpenuhi: Mengatur error "Tidak ada soal..."');
                setError("Tidak ada soal yang valid ditemukan untuk level ini. Coba level lain atau hubungi admin.");
                setCurrentLevel(''); // Reset level agar bisa memilih lagi
            }
        }
    }, [currentLevel, isLoadingQuestions, currentQuizQuestions, quizStage]);


    // --- Quiz Logic Functions ---
    const startQuiz = (levelCode) => {
        setCurrentLevel(levelCode);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setSelectedAnswer(null);
        setError(null);
        setCurrentQuizQuestions([]); // Kosongkan soal yang sudah diambil sebelumnya
        fetchQuizQuestions(levelCode);
    };

    const selectOption = (optionIndex) => {
        setSelectedAnswer(optionIndex);
    };

    const nextQuestion = () => {
        if (selectedAnswer !== null) {
            const updatedAnswers = [...userAnswers];
            updatedAnswers[currentQuestionIndex] = selectedAnswer;
            setUserAnswers(updatedAnswers);

            if (currentQuestionIndex < currentQuizQuestions.length - 1) {
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                setSelectedAnswer(null);
            } else {
                finishQuiz();
            }
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            const updatedAnswers = [...userAnswers];
            if (selectedAnswer !== null) {
                updatedAnswers[currentQuestionIndex] = selectedAnswer;
            }
            setUserAnswers(updatedAnswers);

            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
            setSelectedAnswer(updatedAnswers[currentQuestionIndex - 1] || null);
        }
    };

    const submitQuiz = () => {
        if (selectedAnswer !== null) {
            const updatedAnswers = [...userAnswers];
            updatedAnswers[currentQuestionIndex] = selectedAnswer;
            setUserAnswers(updatedAnswers);
        }
        finishQuiz();
    };

    const finishQuiz = () => {
        let correct = 0;
        const questions = currentQuizQuestions;
        userAnswers.forEach((answer, index) => {
            if (answer === questions[index]?.correct) { // Tambahkan nullish coalescing untuk keamanan
                correct++;
            }
        });
        setCorrectCount(correct);
        setPercentageScore(questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0);
        setQuizStage('results');
    };

    const restartQuiz = () => {
        setQuizStage('levelSelection');
        setCurrentLevel('');
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setSelectedAnswer(null);
        setCurrentQuizQuestions([]);
        setError(null);
    };

    const backToQuizTopics = () => {
        setStudentPage('quiz');
    };

    // --- Conditional Rendering ---
    const renderContent = () => {
        if (isLoadingQuestions) {
            return (
                <div className="text-center text-white mt-8">
                    <div className="spinner" style={{ border: '4px solid rgba(255,255,255,.2)', borderTop: '4px solid #fff', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: 'auto' }}></div>
                    <p style={{ marginTop: '10px' }}>Memuat soal quiz...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center text-white mt-8 p-6 rounded-lg shadow-lg" style={{ backgroundColor: 'rgba(220, 38, 38, 0.8)' }}>
                    <p className="font-bold text-lg mb-4">Terjadi Kesalahan!</p>
                    <p>{error}</p>
                    <button onClick={restartQuiz} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Coba Lagi</button>
                    {quizStage !== 'levelSelection' && (
                        <button onClick={backToQuizTopics} className="mt-2 ml-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Kembali ke Topik</button>
                    )}
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
                                <div className="level-icon" style={{ fontSize: '36px', marginBottom: '15px', display: 'inline-block' }}>{levelMap.beginner.icon}</div>
                                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>{levelMap.beginner.displayName}</h3>
                                <p style={{ fontSize: '15px', color: '#666', marginBottom: '15px' }}>Konsep dasar AI, sejarah, dan definisi fundamental</p>
                                <div className="level-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span className="question-count" style={{ fontSize: '14px', color: '#888' }}>{levelQuestionCounts.beginner !== undefined ? levelQuestionCounts.beginner : '?'} Pertanyaan</span>
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
                                <div className="level-icon" style={{ fontSize: '36px', marginBottom: '15px', display: 'inline-block' }}>{levelMap.intermediate.icon}</div>
                                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>{levelMap.intermediate.displayName}</h3>
                                <p style={{ fontSize: '15px', color: '#666', marginBottom: '15px' }}>Aplikasi AI, algoritma dasar, dan implementasi teknologi</p>
                                <div className="level-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span className="question-count" style={{ fontSize: '14px', color: '#888' }}>{levelQuestionCounts.intermediate !== undefined ? levelQuestionCounts.intermediate : '?'} Pertanyaan</span>
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
                                <div className="level-icon" style={{ fontSize: '36px', marginBottom: '15px', display: 'inline-block' }}>{levelMap.advanced.icon}</div>
                                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>{levelMap.advanced.displayName}</h3>
                                <p style={{ fontSize: '15px', color: '#666', marginBottom: '15px' }}>Konsep mendalam, etika AI, dan perkembangan terkini</p>
                                <div className="level-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span className="question-count" style={{ fontSize: '14px', color: '#888' }}>{levelQuestionCounts.advanced !== undefined ? levelQuestionCounts.advanced : '?'} Pertanyaan</span>
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

            if (!question) {
                return <p className="text-center text-red-400 mt-4">Soal tidak ditemukan atau tidak valid.</p>;
            }

            return (
                <div className="quiz-interface">
                    <div className="quiz-container" style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <div className="quiz-progress" style={{ marginBottom: '20px' }}>
                            <div className="progress-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '16px', color: '#555' }}>
                                <span className="current-question">Pertanyaan <span id="currentQuestionNumber">{currentQuestionIndex + 1}</span></span>
                                <span className="total-questions">dari <span id="totalQuestions">{totalQuestions}</span></span>
                                <span className="quiz-level" style={{ fontWeight: 'bold', color: '#4f46e5' }}>{levelMap[currentLevel]?.displayName || currentLevel}</span>
                            </div>
                            <div className="progress-bar" style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                                <div className="progress-fill" style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #667eea, #764ba2)', borderRadius: '4px', transition: 'width 0.5s ease-in-out' }}></div>
                            </div>
                        </div>

                        <div className="question-card" style={{ background: '#fff', borderRadius: '15px', padding: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                            <h2 className="question-title" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>{question.question}</h2>
                            <div className="question-options" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {/* Ubah kondisi ini agar mengizinkan minimal 1 opsi valid */}
                                {question.options && question.options.filter(Boolean).length >= 1 ? (
                                    question.options.map((option, index) => (
                                        // Hanya render jika opsi tidak null
                                        option !== null ? (
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
                                        ) : null
                                    ))
                                ) : (
                                    <p className="text-red-500">Error: Opsi pertanyaan tidak valid atau tidak lengkap. Harap periksa database.</p>
                                )}
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
                                style={{
                                    background: '#e0e0e0',
                                    color: '#333',
                                    padding: '12px 25px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                                >
                                Ulangi Quiz
                            </button>
                            <button
                                className="control-btn secondary"
                                onClick={backToQuizTopics}
                                style={{
                                    background: '#e0e0e0',
                                    color: '#333',
                                    padding: '12px 25px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                Kembali ke Quiz
                            </button>
                        </div>

                        <div className="results-review" style={{ background: '#fff', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Review Jawaban</h3>
                            <div className="review-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {currentQuizQuestions.map((q, index) => {
                                    const isCorrect = userAnswers[index] === q.correct;
                                    const userAnswerText = (userAnswers[index] !== undefined && userAnswers[index] !== null && q.options[userAnswers[index]] !== null) ?
                                                           q.options[userAnswers[index]] : 'Tidak dijawab';
                                    return (
                                        <div key={index} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}
                                             style={{
                                                background: isCorrect ? '#eaf7ed' : '#fbebeb',
                                                border: isCorrect ? '1px solid #c3e6cb' : '1px solid #f5c6cb',
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
                                                <p className="review-explanation" style={{ fontSize: '14px', color: '#777', marginTop: '10px', borderLeft: '3px solid #ccc', paddingLeft: '10px'}}>
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite',
                minHeight: '100vh',
                padding: '40px 20px',
                fontFamily: 'Inter, Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflowX: 'hidden'
            }}
        >
            {renderContent()}
        </div>
    );
}