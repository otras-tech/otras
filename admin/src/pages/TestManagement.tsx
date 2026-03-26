import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ClipboardList, Target, Layers } from 'lucide-react';

export default function TestManagement() {
    const [tests, setTests] = useState<any[]>([]);
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', examId: '', questions: [] });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [testsResp, examsResp] = await Promise.all([
                axios.get('http://localhost:4000/test'),
                axios.get('http://localhost:4000/exams'),
            ]);
            setTests(Array.isArray(testsResp.data) ? testsResp.data : []);
            setExams(examsResp.data);
        } catch (err) {
            console.error(err);
            setTests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            if (editingId) {
                await axios.patch(`http://localhost:4000/test/${editingId}`, {
                    name: formData.name,
                    examId: Number(formData.examId),
                });
            } else {
                await axios.post('http://localhost:4000/test', {
                    name: formData.name,
                    examId: Number(formData.examId),
                });
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', examId: '', questions: [] });
            fetchData();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} test. Please check requirements.`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (test: any) => {
        setFormData({
            name: test.name,
            examId: test.examId,
            questions: []
        });
        setEditingId(test.id);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this test? All questions and results tied to it will be removed.')) return;
        try {
            await axios.delete(`http://localhost:4000/test/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to delete test.');
        }
    };

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)]">
                        Test Management
                    </h1>
                    <p className="text-[var(--text-secondary)] text-sm">
                        Create mock tests and manage question banks.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        if (showForm) {
                            setEditingId(null);
                            setFormData({ name: '', examId: '', questions: [] });
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] font-semibold text-sm hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                    <Plus size={18} />
                    {showForm ? 'Cancel Creation' : 'Create New Test'}
                </button>
            </div>


            {showForm && (
                <form className="bg-[var(--bg-card)] p-6 rounded-[var(--radius-xl)] border border-[var(--border-light)] shadow-[var(--shadow-sm)] space-y-4" onSubmit={handleSubmit}>

                    <div className="grid grid-cols-2 gap-4">

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-[var(--text-secondary)]">
                                Test Name
                            </label>

                            <input
                                required
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-lg)] text-sm focus:border-[var(--color-primary)] outline-none"
                                placeholder="e.g. Mock Test #1"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>


                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-[var(--text-secondary)]">
                                Associated Exam
                            </label>

                            <select
                                required
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-lg)] text-sm focus:border-[var(--color-primary)] outline-none"
                                value={formData.examId}
                                onChange={(e) => setFormData({ ...formData, examId: e.target.value })}
                            >
                                <option value="">Select Exam</option>

                                {exams.map((exam: any) => (
                                    <option key={exam.id} value={exam.id}>
                                        {exam.name}
                                    </option>
                                ))}

                            </select>
                        </div>

                    </div>


                    <div className="p-4 bg-[var(--color-primary-light)] rounded-[var(--radius-lg)] border border-[var(--border-muted)]">

                        <p className="text-sm text-[var(--color-primary-dark)] font-semibold mb-1 flex items-center gap-1.5 uppercase">
                            <Layers size={14} />
                            Subject Coverage Requirement
                        </p>

                        <p className="text-[var(--color-primary)] text-xs">
                            A test must contain at least one question from each subject associated with the exam.
                        </p>

                    </div>


                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-[var(--radius-lg)] animate-in fade-in zoom-in duration-200">
                            {error}
                        </div>
                    )}


                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            disabled={submitting}
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setFormData({ name: '', examId: '', questions: [] });
                            }}
                            className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-light)] rounded-[var(--radius-lg)] disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] font-semibold text-sm hover:bg-[var(--color-primary-dark)] disabled:bg-slate-400 flex items-center gap-2"
                        >
                            {submitting && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                            {submitting ? (editingId ? 'Saving...' : 'Generating...') : (editingId ? 'Update Test' : 'Generate Test')}
                        </button>

                    </div>

                </form>
            )}


            <div className="grid grid-cols-1 gap-4">

                {loading ? (
                    <div className="h-32 flex items-center justify-center text-[var(--text-muted)] italic">
                        Syncing test modules...
                    </div>

                ) : (Array.isArray(tests) && tests.length === 0) ? (

                    <div className="h-32 flex items-center justify-center text-[var(--text-muted)]">
                        No tests found for the selected criteria.
                    </div>

                ) : Array.isArray(tests) && tests.map((test: any) => (

                    <div
                        key={test.id}
                        className="bg-[var(--bg-card)] p-5 rounded-[var(--radius-xl)] border border-[var(--border-light)] shadow-[var(--shadow-sm)] flex items-center justify-between group hover:border-[var(--border-muted)] transition-all"
                    >

                        <div className="flex items-center gap-4">

                            <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-[var(--radius-xl)] flex items-center justify-center text-[var(--color-cyan)]">
                                <ClipboardList size={22} />
                            </div>

                            <div>

                                <h3 className="font-bold text-[var(--text-main)] text-lg">
                                    {test.name}
                                </h3>

                                <div className="flex items-center gap-3 text-xs font-semibold text-[var(--text-muted)]">

                                    <span className="flex items-center gap-1.5 text-[var(--color-primary)]">
                                        <Target size={14} /> Exam ID: {test.examId}
                                    </span>

                                    <span className="bg-[var(--bg-light)] px-2 py-0.5 rounded-full">
                                        {test._count?.questions || test.questions?.length || 0} Questions
                                    </span>

                                </div>

                            </div>

                        </div>


                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(test)}
                                className="px-3 py-2 border border-[var(--border-light)] text-[var(--color-primary)] rounded-[var(--radius-lg)] text-sm font-semibold hover:bg-[var(--color-primary-light)] transition-colors"
                            >
                                Edit Test
                            </button>
                            <button
                                onClick={() => handleDelete(test.id)}
                                className="px-3 py-2 border border-red-100 text-red-600 bg-red-50 rounded-[var(--radius-lg)] text-sm font-semibold hover:bg-red-100 hover:border-red-200 transition-colors"
                            >
                                Delete
                            </button>
                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}