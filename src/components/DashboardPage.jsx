import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, where, Timestamp, orderBy, limit } from 'firebase/firestore';

// --- Reusable Sub-Components ---
const StatCard = ({ title, value, change, icon, iconBg }) => (
    <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
        <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl rounded-2xl bg-clip-border">
            <div className="flex-auto p-4">
                <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                        <div>
                            <p className="mb-0 font-sans text-sm font-semibold leading-normal uppercase">{title}</p>
                            <h5 className="mb-2 font-bold">{value}</h5>
                            <p className="mb-0">
                                <span className={`text-sm font-bold leading-normal ${change.includes('+') ? 'text-emerald-500' : 'text-slate-500'}`}>{change}</span>
                            </p>
                        </div>
                    </div>
                    <div className="px-3 text-right basis-1/3">
                        <div className={`inline-flex items-center justify-center w-12 h-12 text-center rounded-full text-lg text-white ${iconBg}`}>
                            {icon}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Dashboard Content Component ---
export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalQuizSolve: 5, // Placeholder
        totalUserPlay: 0,
        newUserPlay: 0,
        highestStrike: 70, // Placeholder
    });
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const db = getFirestore();
            const usersCollectionRef = collection(db, "users");
            
            // --- Fetch Stats ---
            const userSnapshot = await getDocs(usersCollectionRef);
            const totalUsers = userSnapshot.size;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayTimestamp = Timestamp.fromDate(today);
            const newUsersQuery = query(usersCollectionRef, where("createdAt", ">=", todayTimestamp));
            const newUsersSnapshot = await getDocs(newUsersQuery);
            const newUsersCount = newUsersSnapshot.size;

            setStats(prevStats => ({
                ...prevStats,
                totalUserPlay: totalUsers,
                newUserPlay: newUsersCount,
            }));
            
            // --- Fetch Leaderboard ---
            const leaderboardQuery = query(
                usersCollectionRef, 
                where("role", "==", "student"),
                orderBy("score", "desc"), 
                limit(10)
            );
            const leaderboardSnapshot = await getDocs(leaderboardQuery);
            const leaderboardData = leaderboardSnapshot.docs.map(doc => doc.data());
            setLeaderboard(leaderboardData);

            setIsLoading(false);
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="w-full px-6 py-6 mx-auto">
            {/* Stat Cards */}
            <div className="flex flex-wrap -mx-3">
                <StatCard title="Total Quiz Solve" value={isLoading ? '...' : stats.totalQuizSolve} change="+1 since yesterday" icon="📚" iconBg="bg-gradient-to-tl from-blue-500 to-violet-500" />
                <StatCard title="Total User Play" value={isLoading ? '...' : stats.totalUserPlay} change="+2% since last week" icon="👥" iconBg="bg-gradient-to-tl from-red-600 to-orange-600" />
                <StatCard title="New User Play" value={isLoading ? '...' : stats.newUserPlay} change={`+${stats.newUserPlay} since yesterday`} icon="👤" iconBg="bg-gradient-to-tl from-emerald-500 to-teal-400" />
                <StatCard title="Highest Strike" value={isLoading ? '...' : stats.highestStrike} change="+50% than last month" icon="🔥" iconBg="bg-gradient-to-tl from-orange-500 to-yellow-500" />
            </div>

            {/* Leaderboard Table */}
            <div className="flex flex-wrap -mx-3">
                <div className="w-full max-w-full px-3 mt-6">
                    <div className="border-black/12.5 shadow-xl relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border">
                        <div className="border-black/12.5 mb-0 rounded-t-2xl border-b-0 border-solid p-6 pb-0">
                            <h6 className="capitalize text-slate-800 text-lg font-semibold">Top 10 Leaderboard</h6>
                        </div>
                        <div className="flex-auto p-4">
                            <table className="w-full text-left border-collapse text-black">
                                <thead>
                                    <tr className="bg-gray-100 text-sm">
                                        <th className="px-4 py-3 font-semibold w-16">Peringkat</th>
                                        <th className="px-4 py-3 font-semibold">Nama</th>
                                        <th className="px-4 py-3 font-semibold text-right">Skor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr><td colSpan="3" className="p-4 text-center">Loading...</td></tr>
                                    ) : leaderboard.length > 0 ? (
                                        leaderboard.map((player, index) => (
                                            <tr key={player.email} className="border-b border-gray-200">
                                                <td className="p-4 font-bold text-center">{index + 1}</td>
                                                <td className="p-4">{player.fullName}</td>
                                                <td className="p-4 text-right font-semibold">{player.score}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="p-4 text-center" colSpan="3">Belum Ada data...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
