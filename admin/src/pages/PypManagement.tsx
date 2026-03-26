import { useState, useEffect } from "react";
import { FileText, Plus, Trash2, Link as LinkIcon, Download } from "lucide-react";
import axios from "axios";

interface PYP {
  id: number;
  year: number;
  fileUrl: string;
  examId: number;
  exam: { name: string };
}

interface Exam {
  id: number;
  name: string;
}

export default function PypManagement() {
  const [pyps, setPyps] = useState<PYP[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    fileUrl: "",
    examId: 0,
  });

  useEffect(() => {
    fetchPyps();
    fetchExams();
  }, []);

  const fetchPyps = async () => {
    try {
      const resp = await axios.get("http://localhost:4000/pyps");
      setPyps(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchExams = async () => {
    try {
      const resp = await axios.get("http://localhost:4000/exams");
      setExams(resp.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/pyps", {
        ...formData,
        year: +formData.year,
        examId: +formData.examId,
      });

      fetchPyps();
      setIsEditing(false);
      setFormData({ year: new Date().getFullYear(), fileUrl: "", examId: 0 });
    } catch {
      alert("Failed to save paper");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this paper?")) return;

    try {
      await axios.delete(`http://localhost:4000/pyps/${id}`);
      setPyps(pyps.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Previous Year Papers</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Upload and manage previous exam papers for practice.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Paper
        </button>
      </div>

      {/* Form */}
      {isEditing && (
        <div className="app-card p-6">
          <h2 className="text-lg font-semibold mb-4">Add Previous Paper</h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">

            <div>
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">
                Exam
              </label>

              <select
                className="input w-full"
                value={formData.examId}
                onChange={(e) =>
                  setFormData({ ...formData, examId: +e.target.value })
                }
                required
              >
                <option value={0}>Select Exam</option>

                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">
                Year
              </label>

              <input
                type="number"
                className="input w-full"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: +e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[var(--text-muted)]">
                PDF Link
              </label>

              <div className="relative">
                <LinkIcon
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="url"
                  className="input w-full !pl-8"
                  placeholder="https://storage.example.com/paper.pdf"
                  value={formData.fileUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, fileUrl: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="col-span-3 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary !px-8"
              >
                Cancel
              </button>

              <button type="submit" className="btn-primary">
                Publish Paper
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="app-card overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-[var(--bg-light)] text-xs uppercase font-bold text-[var(--text-muted)]">
              <tr>
                <th className="px-6 py-4">Paper</th>
                <th className="px-6 py-4">Exam</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                    Loading papers...
                  </td>
                </tr>
              ) : pyps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                    No papers added yet
                  </td>
                </tr>
              ) : (
                pyps.map((pyp) => (
                  <tr key={pyp.id} className="hover:bg-[var(--bg-light)]">

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                          <FileText className="text-red-600" size={18} />
                        </div>

                        <div>
                          <p className="font-semibold">
                            Question Paper {pyp.year}
                          </p>

                          <p className="text-xs text-[var(--text-muted)]">
                            PDF Resource
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="badge-success">
                        {pyp.exam.name}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="badge-success">
                        Live
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">

                        <a
                          href={pyp.fileUrl}
                          target="_blank"
                          className="p-2 rounded-lg hover:bg-slate-100"
                        >
                          <Download size={18} />
                        </a>

                        <button
                          onClick={() => handleDelete(pyp.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}