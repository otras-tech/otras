import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  PlayCircle,
  Loader2,
  Sparkles,
  Target,
  AlertCircle
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

import { useAuthStore } from "../store/authStore";
import { useOtrCheck } from "../hooks/useOtrCheck";
import OtrRequiredModal from "../components/OtrRequiredModal";

import { useQuery, useMutation } from "@tanstack/react-query";
import { getExams } from "../services/examApi";
import { getRandomTest } from "../services/arthaApi";

export default function MockTests() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { checkOtr, isOtrModalOpen, closeOtrModal } = useOtrCheck();

  const { data: exams = [], isLoading: loading } = useQuery({
    queryKey: ['mockExams'],
    queryFn: async () => {
      const allExams = await getExams();
      return allExams.filter((e: any) => {
        const name = (e.name || "").toLowerCase().trim();
        return !name.includes("tier 1") && !name.includes("tier1");
      });
    }
  });

  const startExamMutation = useMutation({
    mutationFn: (examId: string) => getRandomTest(examId),
    onSuccess: (data) => {
      navigate('/artha-test', { state: { testData: { ...data, isMockTest: true } } });
    },
    onError: (err: any) => {
      console.error("Failed to fetch random test:", err);
      alert(t("noTestsAvailable"));
    }
  });

  const fetchingTest = startExamMutation.isPending ? "loading" : null;

  const handleStartExam = (examId: string) => {
    if (!checkOtr()) return;
    startExamMutation.mutate(examId);
  };


  /* ---------------- LOADING ---------------- */

  if (loading) {

    return (

      <div className="app-card p-10 text-center">

        <Loader2
          size={36}
          style={{ color: "var(--color-primary)" }}
          className="mx-auto mb-3 animate-spin"
        />

        <p className="text-subtle">
          {t("loadingOfficialExams")}
        </p>

      </div>

    );

  }


  /* ---------------- PAGE ---------------- */

  return (

    <div className="p-6 space-y-6">


      {/* TITLE */}

      <div>

        <h1 className="page-title">
          {t("officialAssessmentHub")}
        </h1>

        <p className="text-subtle">
          {t("selectOfficialExam")}
        </p>

      </div>



      {/* EXAMS GRID */}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {exams.length > 0 ? (

          exams.map((exam: any) => (

            <div
              key={exam.id}
              className="app-card p-6 hover-lift flex flex-col justify-between"
            >

              <div>

                <span className="label">
                  {t("officialExam")}
                </span>

                <h3 className="card-title mt-2 mb-3">
                  {exam.name}
                </h3>

                <p className="text-subtle mb-6">
                  {exam.shortDescription || t("defaultExamDesc")}
                </p>


                <div className="flex flex-wrap gap-4 text-sm mb-6">

                  <span className="flex items-center gap-1">

                    <Clock size={16} />
                    60 {t("mins")}

                  </span>

                  <span className="flex items-center gap-1">

                    <Target size={16} />
                    {t("multiTier")}

                  </span>

                </div>

              </div>



              {/* START BUTTON */}

              <button
                onClick={() => handleStartExam(exam.id)}
                disabled={startExamMutation.isPending}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >

                {startExamMutation.isPending
                  ? <Loader2 size={18} className="animate-spin" />
                  : <PlayCircle size={18} />
                }

                {startExamMutation.isPending
                  ? t("initializing")
                  : t("startAssessment")
                }

              </button>

            </div>

          ))

        ) : (

          <div className="col-span-full app-card p-10 text-center">

            <AlertCircle
              size={32}
              className="mx-auto mb-3"
              style={{ color: "var(--text-muted)" }}
            />

            <p className="text-subtle">
              {t("noExamsAvailable")}
            </p>

          </div>

        )}

      </div>

      <OtrRequiredModal isOpen={isOtrModalOpen} onClose={closeOtrModal} />
    </div>

  );

}
