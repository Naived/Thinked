import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-end">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

// --- Main QuizEditPage Component ---
export default function QuizEditPage() {
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state for new question
    const [newQuestion, setNewQuestion] = useState('');
    const [optionA, setOptionA] = useState('');
    const [optionB, setOptionB] = useState('');
    const [optionC, setOptionC] = useState('');
    const [optionD, setOptionD] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('A');

    const db = getFirestore();

    // Fetch existing questions from Firestore
    const fetchQuestions = async () => {
        setIsLoading(true);
        const querySnapshot = await getDocs(collection(db, "quizzes"));
        const questionsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuestions(questionsList);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    // Handle adding a new question
    const handleAddQuestion = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "quizzes"), {
                question: newQuestion,
                options: { A: optionA, B: optionB, C: optionC, D: optionD },
                answer: correctAnswer
            });
            // Reset form and close modal
            setNewQuestion('');
            setOptionA('');
            setOptionB('');
            setOptionC('');
            setOptionD('');
            setCorrectAnswer('A');
            setIsModalOpen(false);
            // Refetch questions to update the list
            fetchQuestions();
        } catch (error) {
            console.error("Error adding question: ", error);
            alert("Failed to add question.");
        }
    };

    return (
        <div className="w-full px-6 py-6 mx-auto">
            <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border">
                <div className="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent flex justify-between items-center">
                    <h6 className="text-slate-700 font-bold">Manajemen Soal Quiz</h6>
                    <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">+ Tambah Soal</button>
                </div>
                <div className="flex-auto px-0 pt-0 pb-2">
                    <div className="p-0 overflow-x-auto">
                        <table className="items-center w-full mb-0 align-top border-collapse text-slate-500">
                            <thead className="align-bottom">
                                <tr>
                                    <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">No</th>
                                    <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Pertanyaan</th>
                                    <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">A</th>
                                    <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">B</th>
                                    <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">C</th>
                                    <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">D</th>
                                    <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Kunci</th>
                                    <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="8" className="p-4 text-center">Loading questions...</td></tr>
                                ) : questions.length > 0 ? (
                                    questions.map((q, index) => (
                                        <tr key={q.id}>
                                            <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent"><p className="mb-0 text-xs font-semibold leading-tight px-4">{index + 1}</p></td>
                                            <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent"><p className="mb-0 text-xs font-semibold leading-tight">{q.question}</p></td>
                                            <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent"><p className="mb-0 text-xs leading-tight text-center">{q.options.A}</p></td>
                                            <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent"><p className="mb-0 text-xs leading-tight text-center">{q.options.B}</p></td>
                                            <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent"><p className="mb-0 text-xs leading-tight text-center">{q.options.C}</p></td>
                                            <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent"><p className="mb-0 text-xs leading-tight text-center">{q.options.D}</p></td>
                                            <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent"><p className="mb-0 text-xs font-bold leading-tight text-center">{q.answer}</p></td>
                                            <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent text-center"><a href="#" className="text-xs font-semibold leading-tight text-slate-400">Edit</a></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="8" className="p-4 text-center">No questions found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Question Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h3 className="text-lg font-bold mb-4">Tambah Soal Baru</h3>
                <form onSubmit={handleAddQuestion} className="space-y-4">
                    <div>
                        <label htmlFor="question" className="block text-sm font-medium text-gray-700">Pertanyaan</label>
                        <input type="text" id="question" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="optionA" className="block text-sm font-medium text-gray-700">Opsi A</label>
                        <input type="text" id="optionA" value={optionA} onChange={(e) => setOptionA(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                     <div>
                        <label htmlFor="optionB" className="block text-sm font-medium text-gray-700">Opsi B</label>
                        <input type="text" id="optionB" value={optionB} onChange={(e) => setOptionB(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                     <div>
                        <label htmlFor="optionC" className="block text-sm font-medium text-gray-700">Opsi C</label>
                        <input type="text" id="optionC" value={optionC} onChange={(e) => setOptionC(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                     <div>
                        <label htmlFor="optionD" className="block text-sm font-medium text-gray-700">Opsi D</label>
                        <input type="text" id="optionD" value={optionD} onChange={(e) => setOptionD(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="answer" className="block text-sm font-medium text-gray-700">Kunci Jawaban</label>
                        <select id="answer" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option>A</option>
                            <option>B</option>
                            <option>C</option>
                            <option>D</option>
                        </select>
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Simpan Soal</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
