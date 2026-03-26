import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, HelpCircle, Edit2, Trash2, Filter, CheckCircle2, BookOpen } from 'lucide-react';

export default function QuestionManagement() {
    const [questions, setQuestions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [filters, setFilters] = useState({
        subjectId: '',
        examId: ''
    });

    const [formData, setFormData] = useState({
        text: '',
        options: ['', '', '', ''],
        answer: '',
        subjectId: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchQuestions();
    }, [filters]);

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
        }
    };

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.subjectId) params.append('subjectId', filters.subjectId);
            if (filters.examId) params.append('examId', filters.examId);

            const resp = await axios.get(`http://localhost:4000/question?${params.toString()}`);
            setQuestions(resp.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...formData,
            subjectId: Number(formData.subjectId)
        };
        try {
            if (editingId) {
                await axios.patch(`http://localhost:4000/question/${editingId}`, data);
            } else {
                await axios.post('http://localhost:4000/question', data);
            }
            setShowForm(false);
            resetForm();
            fetchQuestions();
        } catch (err) {
            console.error(err);
            alert('Failed to save question');
        }
    };

    const resetForm = () => {
        setFormData({
            text: '',
            options: ['', '', '', ''],
            answer: '',
            subjectId: ''
        });
        setEditingId(null);
    };

    const handleEdit = (q: any) => {
        setFormData({
            text: q.text,
            options: q.options,
            answer: q.answer,
            subjectId: q.subjectId.toString()
        });
        setEditingId(q.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            await axios.delete(`http://localhost:4000/question/${id}`);
            fetchQuestions();
        } catch (err) {
            console.error(err);
            alert('Failed to delete question');
        }
    };

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)]">Question Bank</h1>
                    <p className="text-[var(--text-secondary)] text-sm">
                        Manage dynamic questions and link them to subjects.
                    </p>
                </div>

                <button
                    onClick={() => { setShowForm(!showForm); resetForm(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] font-semibold text-sm hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                    <Plus size={18} />
                    {showForm ? 'Cancel' : 'Add Question'}
                </button>
            </div>


            {/* Filters */}

            <div className="bg-[var(--bg-card)] p-4 rounded-[var(--radius-xl)] border border-[var(--border-light)] shadow-[var(--shadow-sm)] flex gap-4">

                <div className="flex-1 flex items-center gap-2">
                    <Filter size={16} className="text-[var(--text-muted)]" />

                    <select
                        className="text-sm bg-transparent outline-none font-medium text-[var(--text-secondary)]"
                        value={filters.subjectId}
                        onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}
                    >
                        <option value="">All Subjects</option>
                        {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>

                <div className="flex-1 flex items-center gap-2">
                    <BookOpen size={16} className="text-[var(--text-muted)]" />

                    <select
                        className="text-sm bg-transparent outline-none font-medium text-[var(--text-secondary)]"
                        value={filters.examId}
                        onChange={(e) => setFilters({ ...filters, examId: e.target.value })}
                    >
                        <option value="">All Exams</option>
                        {exams.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                </div>

            </div>


            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-[var(--bg-card)] p-6 rounded-[var(--radius-xl)] border border-[var(--border-light)] shadow-[var(--shadow-sm)] space-y-5 animate-in fade-in slide-in-from-top-4 duration-300"
                >

                    <h2 className="text-lg font-bold text-[var(--text-main)]">
                        {editingId ? 'Edit Question' : 'Define New Question'}
                    </h2>


                    <div className="grid grid-cols-2 gap-4">

                        <div className="col-span-2 space-y-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Question Text
                            </label>

                            <textarea
                                required
                                rows={3}
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-lg)] text-sm outline-none focus:border-[var(--color-primary)]"
                                placeholder="Enter the full question here..."
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            />
                        </div>


                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Subject
                            </label>

                            <select
                                required
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-lg)] text-sm outline-none focus:border-[var(--color-primary)]"
                                value={formData.subjectId}
                                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                            >
                                <option value="">Select Subject</option>
                                {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>


                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Correct Answer
                            </label>

                            <select
                                required
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-lg)] text-sm outline-none focus:border-[var(--color-primary)]"
                                value={formData.answer}
                                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                            >
                                <option value="">Select Correct Option</option>

                                {formData.options.map((opt, i) => (
                                    opt && <option key={i} value={opt}>
                                        Option {i + 1}: {opt}
                                    </option>
                                ))}

                            </select>
                        </div>


                        <div className="col-span-2 grid grid-cols-2 gap-4">

                            {formData.options.map((option, index) => (

                                <div key={index} className="space-y-1">

                                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                        Option {index + 1}
                                    </label>

                                    <input
                                        required
                                        className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-lg)] text-sm outline-none focus:border-[var(--color-primary)]"
                                        placeholder={`Option ${index + 1}`}
                                        value={option}
                                        onChange={(e) => {
                                            const newOptions = [...formData.options];
                                            newOptions[index] = e.target.value;
                                            setFormData({ ...formData, options: newOptions });
                                        }}
                                    />

                                </div>

                            ))}

                        </div>

                    </div>


                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="submit"
                            className="px-8 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] font-bold text-sm tracking-wide shadow-[var(--shadow-lg)] hover:bg-[var(--color-primary-dark)] transition-all active:scale-95"
                        >
                            {editingId ? 'Update Question' : 'Save to Bank'}
                        </button>

                    </div>

                </form>
            )}


            <div className="space-y-4">

                {loading ? (
                    <div className="py-20 text-center text-[var(--text-muted)] italic">
                        Accessing question vaults...
                    </div>

                ) : questions.length === 0 ? (

                    <div className="py-20 text-center text-[var(--text-muted)]">
                        No questions match your filters.
                    </div>

                ) : questions.map((q: any) => (

                    <div
                        key={q.id}
                        className="bg-[var(--bg-card)] p-5 rounded-[var(--radius-2xl)] border border-[var(--border-light)] shadow-[var(--shadow-sm)] flex items-start gap-4 group hover:border-[var(--color-primary-light)] transition-all"
                    >

                        <div className="w-10 h-10 bg-[var(--bg-light)] rounded-[var(--radius-xl)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-[var(--color-primary-light)] group-hover:text-[var(--color-primary)] transition-colors shrink-0">
                            <HelpCircle size={20} />
                        </div>


                        <div className="flex-1 space-y-3">

                            <div className="flex items-center justify-between">

                                <span className="px-2 py-0.5 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] text-[10px] font-black rounded uppercase tracking-wider">
                                    {q.subject?.name}
                                </span>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                                    <button
                                        onClick={() => handleEdit(q)}
                                        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(q.id)}
                                        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>

                                </div>

                            </div>


                            <p className="text-[var(--text-main)] font-medium text-sm leading-relaxed">
                                {q.text}
                            </p>


                            <div className="grid grid-cols-2 gap-2">

                                {q.options.map((opt: string, i: number) => (

                                    <div
                                        key={i}
                                        className={`px-3 py-2 rounded-[var(--radius-lg)] text-xs flex items-center gap-2 ${
                                            opt === q.answer
                                                ? 'bg-[var(--success-bg)] border border-[var(--success)] text-[var(--success)] font-bold'
                                                : 'bg-[var(--bg-light)] text-[var(--text-secondary)]'
                                        }`}
                                    >

                                        {opt === q.answer && <CheckCircle2 size={12} />}

                                        {opt}

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}