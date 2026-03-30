import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, createJob, deleteJob } from '../services/adminApi';
import { Plus, Trash2, Calendar, Briefcase } from 'lucide-react';

export default function JobManagement() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: ''
    });

    const { data: jobs = [], isLoading: loading } = useQuery({
        queryKey: ['adminJobs'],
        queryFn: getJobs,
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => createJob(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
            setShowForm(false);
            setFormData({ title: '', description: '', deadline: '' });
        },
        onError: (err: any) => {
            console.error(err);
            alert('Failed to post job');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteJob(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminJobs'] });
            queryClient.invalidateQueries({ queryKey: ['adminStats'] });
        },
        onError: (err: any) => {
            console.error(err);
            alert('Failed to delete job');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            ...formData,
            deadline: new Date(formData.deadline).toISOString(),
        });
    };

    const handleDelete = (id: number) => {
        if (!window.confirm('Are you sure?')) return;
        deleteMutation.mutate(id);
    };

    return (

        <div className="space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-[var(--text-main)]">
                        Job Management
                    </h1>

                    <p className="text-sm text-[var(--text-muted)]">
                        Post and manage recruitment notifications.
                    </p>

                </div>


                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 btn-primary text-sm"
                >
                    <Plus size={18} />
                    Post New Job
                </button>

            </div>


            {/* Form */}

            {showForm && (

                <form
                    onSubmit={handleSubmit}
                    className="app-card p-6 space-y-4"
                >

                    <div className="grid grid-cols-2 gap-4">

                        <div className="space-y-1">

                            <label className="text-sm font-semibold text-[var(--text-secondary)]">
                                Job Title
                            </label>

                            <input
                                required
                                className="input w-full text-sm"
                                placeholder="e.g. Assistant Section Officer"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                            />

                        </div>


                        <div className="space-y-1">

                            <label className="text-sm font-semibold text-[var(--text-secondary)]">
                                Deadline
                            </label>

                            <input
                                required
                                type="date"
                                className="input w-full text-sm"
                                value={formData.deadline}
                                onChange={(e) =>
                                    setFormData({ ...formData, deadline: e.target.value })
                                }
                            />

                        </div>

                    </div>


                    <div className="space-y-1">

                        <label className="text-sm font-semibold text-[var(--text-secondary)]">
                            Description
                        </label>

                        <textarea
                            required
                            rows={3}
                            className="input w-full text-sm"
                            placeholder="Enter job details and requirements..."
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                        />

                    </div>


                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-light)] rounded-[var(--radius-lg)]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn-primary text-sm px-6 py-2"
                        >
                            Save Job
                        </button>

                    </div>

                </form>

            )}


            {/* Job List */}

            <div className="grid grid-cols-1 gap-4">

                {loading ? (

                    <div className="h-32 flex items-center justify-center text-[var(--text-muted)]">
                        Loading jobs...
                    </div>

                ) : jobs.map((job: any) => (

                    <div
                        key={job.id}
                        className="app-card p-5 flex items-start justify-between"
                    >

                        <div className="flex gap-4">

                            <div className="w-12 h-12 bg-[var(--color-primary-light)] rounded-[var(--radius-xl)] flex items-center justify-center text-[var(--color-primary)]">
                                <Briefcase size={24} />
                            </div>


                            <div>

                                <h3 className="font-bold text-[var(--text-main)] text-lg">
                                    {job.title}
                                </h3>

                                <p className="text-sm text-[var(--text-muted)] mb-2">
                                    {job.description}
                                </p>


                                <div className="flex items-center gap-4 text-xs font-semibold text-[var(--text-muted)]">

                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        Deadline: {new Date(job.deadline).toLocaleDateString()}
                                    </span>


                                    <span
                                        className={`px-2 py-0.5 rounded-full ${
                                            job.status === 'Open'
                                                ? 'bg-[var(--success-bg)] text-[var(--success)]'
                                                : 'bg-[rgba(239,68,68,0.1)] text-[var(--danger)]'
                                        }`}
                                    >
                                        {job.status}
                                    </span>

                                </div>

                            </div>

                        </div>


                        <button
                            onClick={() => handleDelete(job.id)}
                            className="p-2 text-[var(--text-muted)] hover:text-[var(--danger)] transition-[var(--transition-fast)]"
                        >

                            <Trash2 size={18} />

                        </button>

                    </div>

                ))}

            </div>

        </div>

    );
}