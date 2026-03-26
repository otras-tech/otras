import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';

export default function SubjectManagement() {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', examId: '' });
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [subResp, examResp] = await Promise.all([
                axios.get('http://localhost:4000/subjects'),
                axios.get('http://localhost:4000/exams')
            ]);
            setSubjects(subResp.data);
            setExams(examResp.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async () => {
        try {
            const resp = await axios.get('http://localhost:4000/subjects');
            setSubjects(resp.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            examId: formData.examId ? Number(formData.examId) : undefined
        };
        try {
            if (editingId) {
                await axios.patch(`http://localhost:4000/subjects/${editingId}`, payload);
            } else {
                await axios.post('http://localhost:4000/subjects', payload);
            }
            setShowForm(false);
            setFormData({ name: '', examId: '' });
            setEditingId(null);
            fetchSubjects();
        } catch (err) {
            console.error(err);
            alert('Failed to save subject');
        }
    };

    const handleEdit = (subject: any) => {
        setFormData({
            name: subject.name,
            examId: subject.exams && subject.exams.length > 0 ? subject.exams[0].id.toString() : ''
        });
        setEditingId(subject.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this subject?')) return;
        try {
            await axios.delete(`http://localhost:4000/subjects/${id}`);
            fetchSubjects();
        } catch (err) {
            console.error(err);
            alert('Failed to delete subject');
        }
    };

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)]">Subject Management</h1>
                    <p className="text-[var(--text-secondary)] text-sm">
                        Define and manage subjects for exams and questions.
                    </p>
                </div>

                <button
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', examId: '' }); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] font-semibold text-sm hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                    <Plus size={18} />
                    {showForm ? 'Cancel' : 'Add New Subject'}
                </button>
            </div>


            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-[var(--bg-card)] p-6 rounded-[var(--radius-xl)] border border-[var(--border-light)] shadow-[var(--shadow-sm)] space-y-4 animate-in fade-in slide-in-from-top-4 duration-300"
                >
                    <h2 className="text-lg font-bold text-[var(--text-main)]">
                        {editingId ? 'Edit Subject' : 'New Subject Configuration'}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 max-w-2xl">

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Subject Name
                            </label>

                            <input
                                required
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-lg)] text-sm outline-none focus:border-[var(--color-primary)]"
                                placeholder="e.g. Mathematics"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>


                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Associate Exam (Optional)
                            </label>

                            <select
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-lg)] text-sm outline-none focus:border-[var(--color-primary)]"
                                value={formData.examId}
                                onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                            >
                                <option value="">No Exam Link</option>
                                {exams.map((exam: any) => (
                                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className="flex justify-start gap-3 pt-2">

                        <button
                            type="submit"
                            className="px-8 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] font-bold text-sm tracking-wide shadow-[var(--shadow-lg)] hover:bg-[var(--color-primary-dark)] transition-all active:scale-95"
                        >
                            {editingId ? 'Update Subject' : 'Save Subject'}
                        </button>

                    </div>
                </form>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {loading ? (
                    <div className="col-span-2 py-20 flex flex-col items-center justify-center text-[var(--text-muted)]">
                        <div className="w-12 h-12 border-4 border-[var(--border-light)] border-t-[var(--color-primary)] rounded-full animate-spin mb-4" />
                        Fetching subjects...
                    </div>

                ) : subjects.length === 0 ? (

                    <div className="col-span-2 py-20 text-center text-[var(--text-muted)]">
                        No subjects found.
                    </div>

                ) : subjects.map((subject: any) => (

                    <div
                        key={subject.id}
                        className="bg-[var(--bg-card)] p-6 rounded-[var(--radius-2xl)] border border-[var(--border-light)] shadow-[var(--shadow-sm)] hover:border-[var(--color-primary-light)] hover:shadow-[var(--shadow-md)] transition-all group"
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-4">

                                <div className="w-10 h-10 bg-[var(--color-primary-light)] rounded-[var(--radius-lg)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                                    <Tag size={20} />
                                </div>

                                <div className="flex-1 min-w-0">

                                    <h3 className="font-bold text-[var(--text-main)] truncate">
                                        {subject.name}
                                    </h3>

                                    <div className="flex flex-wrap gap-1 mt-1">

                                        {subject.exams?.map((e: any) => (
                                            <span
                                                key={e.id}
                                                className="px-1.5 py-0.5 bg-[var(--bg-light)] text-[var(--text-secondary)] text-[9px] font-black rounded uppercase tracking-tighter"
                                            >
                                                {e.name}
                                            </span>
                                        )) || (
                                            <span className="text-[var(--text-muted)] text-[10px] italic">
                                                No Exam Linked
                                            </span>
                                        )}

                                    </div>

                                </div>

                            </div>


                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">

                                <button
                                    onClick={() => handleEdit(subject)}
                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-[var(--radius-lg)] transition-all"
                                >
                                    <Edit2 size={16} />
                                </button>

                                <button
                                    onClick={() => handleDelete(subject.id)}
                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--bg-light)] rounded-[var(--radius-lg)] transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}