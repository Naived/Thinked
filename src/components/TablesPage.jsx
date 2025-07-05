import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

const UserRow = ({ user, onDelete }) => (
    <tr>
      <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
        <div className="flex px-2 py-1">
          <div>
            <div className="inline-flex items-center justify-center mr-4 text-sm text-white transition-all duration-200 ease-in-out h-9 w-9 rounded-xl bg-slate-500">
              {user.fullName?.charAt(0) || 'U'}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h6 className="mb-0 text-sm leading-normal">{user.fullName || 'Unnamed'}</h6>
            <p className="mb-0 text-xs leading-tight text-slate-400">{user.email || 'No email'}</p>
          </div>
        </div>
      </td>
      <td className="p-2 text-sm leading-normal text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
        <span className="bg-gradient-to-tl from-emerald-500 to-teal-400 px-2.5 text-xs rounded py-1 inline-block font-bold uppercase text-white">Online</span>
      </td>
      <td className="p-2 text-center">
        <button
          onClick={() => {
            const confirmDelete = window.confirm(`Yakin ingin menghapus ${user.fullName || 'user ini'}?`);
            if (confirmDelete) {
              console.log("Confirmed delete:", user.id);
              onDelete(user.id);
            }
          }}
          className="text-red-500 text-xs underline"
        >
          Hapus
        </button>
      </td>
    </tr>
  );

const ActivityRow = ({ user }) => {
  const progress = user.learningProgress ?? 0;
  const quizzesCompleted = user.totalQuizzesCompleted ?? 0;
  const status = progress >= 100 ? 'Completed' : 'Learning';

  return (
    <tr className="border-t">
      <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
        <div className="flex px-2">
          <div>
            <div className="inline-flex items-center justify-center mr-2 text-sm text-white rounded-full h-9 w-9 bg-slate-500">
              {user.fullName?.charAt(0) || 'U'}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h6 className="mb-0 text-sm leading-normal">{user.fullName || 'Unknown User'}</h6>
          </div>
        </div>
      </td>
      <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
        <p className="mb-0 text-sm font-semibold leading-normal">{quizzesCompleted}</p>
      </td>
      <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
        <span className={`text-xs font-semibold leading-tight ${status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
          {status}
        </span>
      </td>
      <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
        <div className="flex items-center justify-center">
          <span className="mr-2 text-xs font-semibold leading-tight">{progress}%</span>
          <div className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, minWidth: progress > 0 ? '4px' : '0' }}
            />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default function TablesPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    const db = getFirestore();
    const usersCollectionRef = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollectionRef);
    const userList = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(userList);
    setIsLoading(false);
  };

  const deleteUser = async (userId) => {
    const db = getFirestore();
    const userRef = doc(db, 'users', userId);

    try {
      await deleteDoc(userRef);
      console.log('Deleted user:', userId);
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error.message);
      alert("Gagal menghapus user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="w-full px-6 py-6 mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h6 className="text-slate-700 !text-3xl font-bold">User Table</h6>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Tambah User
        </button>
      </div>

      {/* User Table */}
      <div className="flex flex-wrap -mx-3">
        <div className="w-full max-w-full px-3">
          <div className="flex flex-col mb-6 bg-white shadow-xl rounded-2xl">
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-slate-500">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xxs font-bold uppercase text-slate-400">User</th>
                    <th className="px-6 py-3 text-center text-xxs font-bold uppercase text-slate-400">Status</th>
                    <th className="px-6 py-3 text-center text-xxs font-bold uppercase text-slate-400">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="3" className="p-4 text-center">Loading users...</td></tr>
                  ) : (
                    users.map(user => (
                      <UserRow key={user.id} user={user} onDelete={deleteUser} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Table */}
      <div className="flex flex-wrap -mx-3">
        <div className="w-full max-w-full px-3">
          <div className="flex flex-col mb-6 bg-white shadow-xl rounded-2xl">
            <div className="p-6 pb-0 mb-0">
              <h6 className="text-slate-700 text-xl font-bold">Activity User</h6>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-slate-500">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xxs font-bold uppercase text-slate-400">User</th>
                    <th className="px-6 py-3 text-left text-xxs font-bold uppercase text-slate-400">Quiz Strike</th>
                    <th className="px-6 py-3 text-left text-xxs font-bold uppercase text-slate-400">Status</th>
                    <th className="px-6 py-3 text-center text-xxs font-bold uppercase text-slate-400">Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="4" className="p-4 text-center">Loading activity...</td></tr>
                  ) : (
                    users.map(user => (
                      <ActivityRow key={user.id} user={user} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add User */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center mt-4">Tambah Pengguna Baru</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const fullName = e.target.fullName.value;
                const email = e.target.email.value;
                const username = e.target.username.value;
                const password = e.target.password.value;

                if (!fullName || !email || !username || !password) return;

                try {
                  const auth = getAuth();
                  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                  const uid = userCredential.user.uid;

                  const newUser = {
                    fullName,
                    email,
                    username,
                    learningProgress: 0,
                    totalQuizzesCompleted: 0,
                    TotalScoreSum: 0,
                    score: 0,
                    role: "student",
                    ai_material_progress: [],
                  };

                  const db = getFirestore();
                  await setDoc(doc(db, "users", uid), newUser);
                  e.target.reset();
                  setShowModal(false);
                  fetchUsers();
                } catch (error) {
                  console.error("Error creating user:", error.message);
                  alert(error.message);
                }
              }}
              className="flex flex-col gap-3 px-6 pb-6"
            >
              <input name="fullName" placeholder="Full Name" className="border p-2 rounded" />
              <input name="email" placeholder="Email" type="email" className="border p-2 rounded" />
              <input name="username" placeholder="Username" className="border p-2 rounded" />
              <input name="password" placeholder="Password" type="password" className="border p-2 rounded" />
              <button
                type="submit"
                className="bg-blue-600 text-black py-2 rounded hover:bg-blue-700 transition"
              >
                Simpan Pengguna
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
