import { useState, useEffect } from 'react';
import { Users, Mail, Shield, Trash2, Edit2, Search, Filter } from 'lucide-react';
import axios from 'axios';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    otrId: string;
    category: string;
    highestDegree: string;
    careerPreference: string;
    createdAt: string;
}

export default function UserManagement() {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');

            const resp = await axios.get('http://localhost:4000/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers(resp.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {

        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {

            const token = localStorage.getItem('adminToken');

            await axios.delete(`http://localhost:4000/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers(users.filter(u => u.id !== id));

        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.otrId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (

        <div className="space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)]">
                        User Management
                    </h1>

                    <p className="text-sm text-[var(--text-muted)]">
                        Monitor and manage candidate accounts across the ecosystem.
                    </p>
                </div>

                <div className="px-4 py-2 rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--color-primary-light)] flex items-center gap-2">
                    <Users size={18} className="text-[var(--color-primary)]" />
                    <span className="font-bold text-[var(--color-primary)]">
                        {users.length} Total Users
                    </span>
                </div>

            </div>


            {/* Table Card */}

            <div className="app-card overflow-hidden">

                {/* Toolbar */}

                <div className="p-4 border-b border-[var(--border-light)] bg-[var(--bg-light)] flex flex-col md:flex-row gap-4 justify-between items-center">

                    <div className="relative w-full md:w-96">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                        />

                        <input
                            type="text"
                            placeholder="Search by name, email or OTR ID..."
                            className="input w-full text-sm !pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                    </div>


                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--text-secondary)] bg-[var(--bg-card)] border border-[var(--border-light)] rounded-[var(--radius-lg)] hover:bg-[var(--bg-light)] transition-[var(--transition-fast)]">
                        <Filter size={16} />
                        Filter
                    </button>

                </div>


                {/* Table */}

                <div className="overflow-x-auto">

                    <table className="w-full text-left border-collapse">

                        <thead>

                            <tr className="bg-[var(--bg-light)] text-[var(--text-muted)] text-xs uppercase tracking-wider font-semibold border-b border-[var(--border-light)]">

                                <th className="px-6 py-4">Candidate</th>
                                <th className="px-6 py-4">OTR ID / Category</th>
                                <th className="px-6 py-4">Preference</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-[var(--border-light)]">

                            {loading ? (

                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-[var(--text-muted)]">
                                        Loading users...
                                    </td>
                                </tr>

                            ) : filteredUsers.length === 0 ? (

                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-[var(--text-muted)]">
                                        No users found.
                                    </td>
                                </tr>

                            ) : filteredUsers.map((user) => (

                                <tr
                                    key={user.id}
                                    className="hover:bg-[var(--bg-light)] transition-[var(--transition-fast)]"
                                >

                                    {/* Candidate */}

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-3">

                                            <div className="w-9 h-9 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center text-[var(--color-primary)] font-bold text-sm">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>

                                            <div>

                                                <p className="font-bold text-sm text-[var(--text-main)]">
                                                    {user.firstName} {user.lastName}
                                                </p>

                                                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] mt-0.5">
                                                    <Mail size={12} />
                                                    {user.email}
                                                </div>

                                            </div>

                                        </div>

                                    </td>


                                    {/* OTR */}

                                    <td className="px-6 py-4">

                                        <p className="text-sm font-mono text-[var(--text-secondary)] bg-[var(--bg-light)] px-2 py-0.5 rounded inline-block">
                                            {user.otrId || 'NOT_GEN'}
                                        </p>

                                        <p className="text-xs text-[var(--text-muted)] mt-1">
                                            {user.category}
                                        </p>

                                    </td>


                                    {/* Preference */}

                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                        {user.careerPreference || '—'}
                                    </td>


                                    {/* Status */}

                                    <td className="px-6 py-4">

                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--success-bg)] text-[var(--success)]">
                                            <Shield size={10} /> Active
                                        </span>

                                    </td>


                                    {/* Actions */}

                                    <td className="px-6 py-4 text-right">

                                        <div className="flex items-center justify-end gap-2">

                                            <button className="p-2 text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-[var(--radius-md)] transition-[var(--transition-fast)]">
                                                <Edit2 size={16} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[rgba(239,68,68,0.08)] rounded-[var(--radius-md)] transition-[var(--transition-fast)]"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}