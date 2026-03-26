import { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface Subscription {
    id: number;
    title: string;
    price: string;
    features: string[];
    isRecommended: boolean;
}

export default function SubscriptionManagement() {

    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        features: '',
        isRecommended: false
    });

    const [editId, setEditId] = useState<number | null>(null);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const resp = await axios.get('http://localhost:4000/subscriptions');
            setSubscriptions(resp.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanPrice = formData.price.replace(/[^0-9.]/g, '');

        const data = {
            ...formData,
            price: parseFloat(cleanPrice) || 0,
            features: formData.features.split(',').map(f => f.trim())
        };

        try {
            if (editId) {
                await axios.patch(`http://localhost:4000/subscriptions/${editId}`, data);
            } else {
                await axios.post('http://localhost:4000/subscriptions', data);
            }

            fetchSubscriptions();

            setIsEditing(false);
            setFormData({
                title: '',
                price: '',
                features: '',
                isRecommended: false
            });

            setEditId(null);

        } catch (err) {
            console.error(err);
            alert('Failed to save subscription');
        }
    };

    const handleEdit = (sub: Subscription) => {

        setFormData({
            title: sub.title,
            price: sub.price,
            features: sub.features.join(', '),
            isRecommended: sub.isRecommended
        });

        setEditId(sub.id);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {

        if (!window.confirm('Delete this plan?')) return;

        try {

            await axios.delete(`http://localhost:4000/subscriptions/${id}`);

            setSubscriptions(subscriptions.filter(s => s.id !== id));

        } catch (err) {

            alert('Failed to delete');

        }
    };

    return (

        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)]">
                        Subscription Management
                    </h1>

                    <p className="text-[var(--text-secondary)] text-sm">
                        Design and update premium membership tiers for value-added tools.
                    </p>
                </div>

                <button
                    onClick={() => {
                        setIsEditing(true);
                        setEditId(null);
                        setFormData({
                            title: '',
                            price: '',
                            features: '',
                            isRecommended: false
                        });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                    <Plus size={18} />
                    Create New Plan
                </button>

            </div>


            {isEditing && (

                <div className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-6 border border-[var(--border-muted)] shadow-[var(--shadow-sm)] animate-in fade-in slide-in-from-top-4 duration-300">

                    <h2 className="text-lg font-bold text-[var(--text-main)] mb-4">
                        {editId ? 'Edit' : 'Create'} Subscription Plan
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

                        <div className="space-y-1">

                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Plan Title
                            </label>

                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-[var(--radius-lg)] border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none"
                                placeholder="e.g. Artha Pro Max"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />

                        </div>


                        <div className="space-y-1">

                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Price (Monthly)
                            </label>

                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-[var(--radius-lg)] border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none"
                                placeholder="e.g. ₹999/mo"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                required
                            />

                        </div>


                        <div className="col-span-2 space-y-1">

                            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                                Features (Comma separated)
                            </label>

                            <textarea
                                className="w-full px-4 py-2 rounded-[var(--radius-lg)] border border-[var(--border-light)] focus:ring-2 focus:ring-[var(--color-primary-light)] outline-none h-20"
                                placeholder="AI Roadmaps, 500+ Mocks, Priority Support..."
                                value={formData.features}
                                onChange={e => setFormData({ ...formData, features: e.target.value })}
                                required
                            />

                        </div>


                        <div className="flex items-center gap-2 py-2">

                            <input
                                type="checkbox"
                                id="isRec"
                                className="w-4 h-4 text-[var(--color-primary)] rounded"
                                checked={formData.isRecommended}
                                onChange={e => setFormData({ ...formData, isRecommended: e.target.checked })}
                            />

                            <label htmlFor="isRec" className="text-sm font-semibold text-[var(--text-secondary)]">
                                Recommended Plan
                            </label>

                        </div>


                        <div className="col-span-2 flex justify-end gap-3 mt-2">

                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-light)] rounded-[var(--radius-lg)] transition-colors"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-[var(--radius-lg)] font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
                            >
                                {editId ? 'Update Plan' : 'Publish Plan'}
                            </button>

                        </div>

                    </form>

                </div>

            )}


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {loading ? (

                    <div className="col-span-3 py-20 text-center text-[var(--text-muted)]">
                        Fetching pricing models...
                    </div>

                ) : subscriptions.length === 0 ? (

                    <div className="col-span-3 py-20 text-center text-[var(--text-muted)]">
                        No active subscriptions. Create one to get started.
                    </div>

                ) : (

                    subscriptions.map(sub => (

                        <div
                            key={sub.id}
                            className={`bg-[var(--bg-card)] rounded-[var(--radius-2xl)] p-6 border shadow-[var(--shadow-sm)] relative overflow-hidden transition-all hover:shadow-[var(--shadow-md)] ${
                                sub.isRecommended
                                    ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary-light)]'
                                    : 'border-[var(--border-light)]'
                            }`}
                        >

                            {sub.isRecommended && (

                                <div className="absolute top-0 right-0 bg-[var(--color-primary)] text-white text-[10px] font-black px-3 py-1 rounded-bl-[var(--radius-xl)] uppercase tracking-widest">
                                    Popular
                                </div>

                            )}


                            <div className="flex justify-between items-start mb-4">

                                <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-[var(--color-primary-light)] flex items-center justify-center">
                                    <CreditCard className="text-[var(--color-primary)]" size={24} />
                                </div>

                                <div className="flex gap-1">

                                    <button
                                        onClick={() => handleEdit(sub)}
                                        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] rounded-[var(--radius-lg)] transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(sub.id)}
                                        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--bg-light)] rounded-[var(--radius-lg)] transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                </div>

                            </div>


                            <h3 className="text-xl font-black text-[var(--text-main)] mb-1">
                                {sub.title}
                            </h3>

                            <p className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                                {sub.price}
                            </p>


                            <ul className="space-y-3 mb-8">

                                {sub.features.map((f, i) => (

                                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">

                                        <CheckCircle2
                                            size={14}
                                            className="text-[var(--success)] mt-1 flex-shrink-0"
                                        />

                                        <span>{f}</span>

                                    </li>

                                ))}

                            </ul>

                        </div>

                    ))

                )}

            </div>


            <div className="p-4 bg-[var(--bg-light)] border border-[var(--border-muted)] rounded-[var(--radius-xl)] flex items-start gap-3">

                <AlertCircle size={18} className="text-[var(--warning)] flex-shrink-0 mt-0.5" />

                <p className="text-sm text-[var(--text-secondary)] font-medium">
                    Changes to subscription plans take effect instantly in the User Panel. Ensure pricing and features are peer-reviewed before publishing.
                </p>

            </div>

        </div>

    );
}