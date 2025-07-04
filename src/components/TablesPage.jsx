import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// --- Reusable Sub-Components ---
const UserRow = ({ user }) => (
    <tr>
        <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
            <div className="flex px-2 py-1">
                <div>
                    <div className="inline-flex items-center justify-center mr-4 text-sm text-white transition-all duration-200 ease-in-out h-9 w-9 rounded-xl bg-slate-500">
                        {user.fullName.charAt(0)}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <h6 className="mb-0 text-sm leading-normal">{user.fullName}</h6>
                    <p className="mb-0 text-xs leading-tight text-slate-400">{user.email}</p>
                </div>
            </div>
        </td>
        <td className="p-2 text-sm leading-normal text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
            <span className="bg-gradient-to-tl from-emerald-500 to-teal-400 px-2.5 text-xs rounded-1.8 py-1.4 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">Online</span>
        </td>
        <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
            <span className="text-xs font-semibold leading-tight text-slate-400">
                {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
            </span>
        </td>
        <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
            <a href="#" className="text-xs font-semibold leading-tight text-slate-400"> Edit </a>
        </td>
    </tr>
);

const ActivityRow = ({ user }) => (
    <tr className="border-t">
        <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
            <div className="flex px-2">
                <div>
                     <div className="inline-flex items-center justify-center mr-2 text-sm text-white transition-all duration-200 ease-in-out rounded-full h-9 w-9 bg-slate-500">
                        {user.fullName.charAt(0)}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <h6 className="mb-0 text-sm leading-normal">{user.fullName}</h6>
                </div>
            </div>
        </td>
        <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
            <p className="mb-0 text-sm font-semibold leading-normal">5</p>
        </td>
        <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
            <span className="text-xs font-semibold leading-tight">progress</span>
        </td>
        <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
            <div className="flex items-center justify-center">
                <span className="mr-2 text-xs font-semibold leading-tight">5.5%</span>
                <div>
                    <div className="text-xs h-0.75 w-30 m-0 flex overflow-visible rounded-lg bg-gray-200">
                        <div className="flex flex-col justify-center w-1/5 h-auto overflow-hidden text-center text-white transition-all bg-blue-500 rounded duration-600 ease bg-gradient-to-tl from-blue-700 to-cyan-500 whitespace-nowrap" role="progressbar"></div>
                    </div>
                </div>
            </div>
        </td>
    </tr>
);


// --- Main TablesPage Component ---
export default function TablesPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const db = getFirestore();
            const usersCollectionRef = collection(db, "users");
            const userSnapshot = await getDocs(usersCollectionRef);
            const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(userList);
            setIsLoading(false);
        };

        fetchUsers();
    }, []);

    return (
        <div className="w-full px-6 py-6 mx-auto">
            {/* User Table */}
            <div className="flex flex-wrap -mx-3">
                <div className="flex-none w-full max-w-full px-3">
                    <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border">
                        <div className="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                            <h6 className="text-slate-700">User table</h6>
                        </div>
                        <div className="flex-auto px-0 pt-0 pb-2">
                            <div className="p-0 overflow-x-auto">
                                <table className="items-center w-full mb-0 align-top border-collapse text-slate-500">
                                    <thead className="align-bottom">
                                        <tr>
                                            <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">User</th>
                                            <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Status</th>
                                            <th className="px-6 py-3 font-bold text-center uppercase align-middle bg-transparent border-b border-collapse shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Register Date</th>
                                            <th className="px-6 py-3 font-semibold capitalize align-middle bg-transparent border-b border-collapse border-solid shadow-none tracking-none whitespace-nowrap text-slate-400 opacity-70"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr><td colSpan="4" className="p-4 text-center">Loading users...</td></tr>
                                        ) : (
                                            users.map(user => <UserRow key={user.id} user={user} />)
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity User Table */}
            <div className="flex flex-wrap -mx-3">
                <div className="flex-none w-full max-w-full px-3">
                    <div className="relative flex flex-col min-w-0 mb-6 break-words bg-white border-0 border-transparent border-solid shadow-xl rounded-2xl bg-clip-border">
                        <div className="p-6 pb-0 mb-0 border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
                            <h6 className="text-slate-700">Activity User</h6>
                        </div>
                        <div className="flex-auto px-0 pt-0 pb-2">
                            <div className="p-0 overflow-x-auto">
                                <table className="items-center justify-center w-full mb-0 align-top border-collapse text-slate-500">
                                    <thead className="align-bottom">
                                        <tr>
                                            <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">User</th>
                                            <th className="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Level</th>
                                            <th className="px-6 py-3 pl-2 font-bold text-left uppercase align-middle bg-transparent border-b shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Status</th>
                                            <th className="px-6 py-3 pl-2 font-bold text-center uppercase align-middle bg-transparent border-b shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">Completion</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <tr><td colSpan="4" className="p-4 text-center">Loading activity...</td></tr>
                                        ) : (
                                            users.map(user => <ActivityRow key={user.id} user={user} />)
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
