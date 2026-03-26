import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, BookOpen, FileText, Edit2, Trash2, Zap } from 'lucide-react';

export default function ExamManagement() {
    const [exams, setExams] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        shortDescription: '',
        longDescription: '',
        pattern: 'SSC',
        eligibility: '',
        noOfQuestions: 100,
        cutoff: 0,
        syllabus: '',
        applicationStatus: 'Application Success',
        subjectIds: [] as number[]
    });

    useEffect(() => {
        fetchExams();
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const resp = await axios.get('http://localhost:4000/subjects');
            setSubjects(resp.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchExams = async () => {
        try {
            const resp = await axios.get('http://localhost:4000/exams');
            setExams(resp.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { subjectIds, id, subjects, createdAt, updatedAt, tests, pyps, applications, ...rest } = formData as any;

            const payload = {
                ...rest,
                cutoff: Number(formData.cutoff),
                noOfQuestions: Number(formData.noOfQuestions),
                subjects: subjectIds,
            };

            if (id) {
                await axios.patch(`http://localhost:4000/exams/${id}`, payload);
            } else {
                await axios.post('http://localhost:4000/exams', payload);
            }

            setShowForm(false);
            setFormData({
                name: '',
                shortDescription: '',
                longDescription: '',
                pattern: 'SSC',
                eligibility: '',
                noOfQuestions: 100,
                cutoff: 0,
                syllabus: '',
                applicationStatus: 'Application Success',
                subjectIds: []
            });

            fetchExams();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this exam and all its associated data (Tests, Applications, etc.)?')) return;
        try {
            await axios.delete(`http://localhost:4000/exams/${id}`);
            fetchExams();
        } catch (err) {
            console.error(err);
            alert('Failed to delete exam. Check backend logs.');
        }
    };

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)]">Exam Management</h1>
                    <p className="text-[var(--text-muted)] text-sm">Define exams, structures, and eligibility criteria.</p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] font-semibold text-sm hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                    <Plus size={18} />
                    {showForm ? 'Cancel Creation' : 'Create New Exam'}
                </button>
            </div>


            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-[var(--bg-card)] p-6 rounded-[var(--radius-xl)] border border-[var(--border-light)] shadow-[var(--shadow-sm)] space-y-5 animate-in fade-in slide-in-from-top-4 duration-300"
                >
                    <h2 className="text-lg font-bold text-[var(--text-main)]">
                        Detailed Exam Configuration
                    </h2>


                    <div className="grid grid-cols-3 gap-4">

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Exam Name
                            </label>

                            <input
                                required
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)] text-sm outline-none focus:border-[var(--color-primary)]"
                                placeholder="e.g. UPSC CSE 2026"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>


                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Exam Pattern
                            </label>

                            <select
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)] text-sm outline-none focus:border-[var(--color-primary)]"
                                value={formData.pattern}
                                onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                            >
                                <option value="SSC">SSC (CGL/CHSL)</option>
                                <option value="UPSC">UPSC (IA/CS)</option>
                                <option value="JEE">JEE (Eng/Tech)</option>
                                <option value="BANKING">Banking (PO/Clerk)</option>
                            </select>
                        </div>


                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                No. of Questions
                            </label>

                            <input
                                required
                                type="number"
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)] text-sm outline-none focus:border-[var(--color-primary)]"
                                value={formData.noOfQuestions}
                                onChange={(e) => setFormData({ ...formData, noOfQuestions: Number(e.target.value) })}
                            />
                        </div>


                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Application Status
                            </label>

                            <select
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)] text-sm outline-none focus:border-[var(--color-primary)]"
                                value={formData.applicationStatus}
                                onChange={(e) => setFormData({ ...formData, applicationStatus: e.target.value })}
                            >
                                <option value="Application Success">Application Success</option>
                                <option value="Admit Card Release">Admit Card Release</option>
                                <option value="Exam key">Exam key</option>
                                <option value="Results">Results</option>
                            </select>
                        </div>


                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Expected Cutoff (%)
                            </label>

                            <input
                                required
                                type="number"
                                step="0.1"
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)] text-sm outline-none focus:border-[var(--color-primary)]"
                                value={formData.cutoff}
                                onChange={(e) => setFormData({ ...formData, cutoff: Number(e.target.value) })}
                            />
                        </div>


                        <div className="col-span-2 space-y-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Short Description (Cards)
                            </label>

                            <input
                                required
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)] text-sm outline-none focus:border-[var(--color-primary)]"
                                placeholder="Tagline for the exam..."
                                value={formData.shortDescription}
                                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                            />
                        </div>

                    </div>


                    <div className="grid grid-cols-2 gap-4">

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Eligibility Criteria
                            </label>

                            <textarea
                                required
                                rows={3}
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)] text-sm outline-none focus:border-[var(--color-primary)]"
                                placeholder="Age, Education, Domicile requirements..."
                                value={formData.eligibility}
                                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                            />
                        </div>


                        <div className="space-y-1">
                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Long Description / About
                            </label>

                            <textarea
                                required
                                rows={3}
                                className="w-full px-3 py-2 border border-[var(--border-light)] rounded-[var(--radius-md)] text-sm outline-none focus:border-[var(--color-primary)]"
                                placeholder="Full details about the exam process..."
                                value={formData.longDescription}
                                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                            />
                        </div>

                    </div>


                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            Included Subjects
                        </label>

                        <div className="flex flex-wrap gap-2">
                            {subjects.map((subject: any) => (
                                <button
                                    key={subject.id}
                                    type="button"
                                    onClick={() => {
                                        const ids = formData.subjectIds.includes(subject.id)
                                            ? formData.subjectIds.filter(id => id !== subject.id)
                                            : [...formData.subjectIds, subject.id];

                                        setFormData({ ...formData, subjectIds: ids });
                                    }}

                                    className={`px-3 py-1.5 rounded-[var(--radius-lg)] text-xs font-bold transition-all ${
                                        formData.subjectIds.includes(subject.id)
                                            ? 'bg-[var(--color-primary)] text-white'
                                            : 'bg-[var(--bg-light)] text-[var(--text-secondary)] hover:bg-[var(--border-light)]'
                                    }`}
                                >
                                    {subject.name}
                                </button>
                            ))}
                        </div>
                    </div>


                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-5 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-light)] rounded-[var(--radius-lg)] transition-colors border border-transparent"
                        >
                            Discard
                        </button>

                        <button
                            type="submit"
                            className="px-8 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] font-bold text-sm tracking-wide shadow-[var(--shadow-lg)] hover:bg-[var(--color-primary-dark)] transition-all active:scale-95"
                        >
                            Publish Exam
                        </button>

                    </div>

                </form>
            )}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {loading ? (
                    <div className="col-span-2 py-20 flex flex-col items-center justify-center text-[var(--text-muted)]">

                        <div className="w-12 h-12 border-4 border-[var(--border-light)] border-t-[var(--color-primary)] rounded-full animate-spin mb-4" />

                        Syncing exam databases...

                    </div>

                ) : exams.length === 0 ? (

                    <div className="col-span-2 py-20 text-center text-[var(--text-muted)]">
                        No exams configured yet.
                    </div>

                ) : exams.map((exam: any) => (

                    <div
                        key={exam.id}
                        className="bg-[var(--bg-card)] p-6 rounded-[var(--radius-2xl)] border border-[var(--border-light)] shadow-[var(--shadow-sm)] hover:border-[var(--color-primary-light)] hover:shadow-[var(--shadow-md)] transition-all group"
                    >

                        <div className="flex items-start justify-between mb-4">

                            <div className="flex items-center gap-4">

                                <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-[var(--radius-xl)] flex items-center justify-center text-[var(--color-primary)] transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white">
                                    <BookOpen size={24} />
                                </div>

                                <div>

                                    <div className="flex items-center gap-2">

                                        <h3 className="font-black text-[var(--text-main)] text-lg">
                                            {exam.name}
                                        </h3>

                                        <span className="px-2 py-0.5 bg-[var(--bg-light)] text-[var(--text-muted)] text-[10px] font-black rounded uppercase tracking-widest">
                                            {exam.pattern}
                                        </span>

                                    </div>

                                    <p className="text-[var(--text-muted)] text-xs font-bold">
                                        {exam.noOfQuestions} Questions • {exam.cutoff}% Cutoff
                                    </p>

                                    <p className="text-[var(--color-primary)] text-xs font-bold mt-1">
                                        Status: {exam.applicationStatus}
                                    </p>

                                </div>

                            </div>


                            <div className="flex gap-1">

                                <button
                                    onClick={() => {
                                        setFormData({
                                            ...exam,
                                            subjectIds: exam.subjects?.map((s: any) => s.id) || []
                                        });

                                        setShowForm(true);
                                        window.scrollTo(0, 0);
                                    }}

                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-[var(--radius-lg)] transition-all"
                                >
                                    <Edit2 size={16} />
                                </button>


                                <button
                                    onClick={() => handleDelete(exam.id)}
                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--bg-light)] rounded-[var(--radius-lg)] transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>

                            </div>

                        </div>


                        <div className="space-y-4">

                            <p className="text-[var(--text-secondary)] text-sm italic font-medium">
                                "{exam.shortDescription}"
                            </p>


                            <div className="grid grid-cols-2 gap-3">

                                <div className="p-3 bg-[var(--bg-light)] rounded-[var(--radius-xl)] border border-[var(--border-light)]">

                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <Zap size={10} /> Eligibility
                                    </p>

                                    <p className="text-[var(--text-secondary)] text-xs line-clamp-2 leading-relaxed">
                                        {exam.eligibility}
                                    </p>

                                </div>


                                <div className="p-3 bg-[var(--bg-light)] rounded-[var(--radius-xl)] border border-[var(--border-light)]">

                                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <FileText size={10} /> About
                                    </p>

                                    <p className="text-[var(--text-secondary)] text-xs line-clamp-2 leading-relaxed">
                                        {exam.longDescription}
                                    </p>

                                </div>

                            </div>


                            <div className="flex flex-wrap gap-1.5 pt-2">

                                {exam.subjects?.map((s: any) => (
                                    <span
                                        key={s.id}
                                        className="px-2 py-1 bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] text-[10px] font-black rounded uppercase tracking-wider transition-colors hover:bg-[var(--border-muted)]"
                                    >
                                        {s.name}
                                    </span>
                                ))}

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}