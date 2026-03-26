import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, AlertCircle, XCircle, Zap } from 'lucide-react';
import FormField, { TextInput, SelectInput } from '../components/FormField';
import { useTranslation } from '../hooks/useTranslation';

export default function Eligibility() {
  const { t } = useTranslation();

  const [age, setAge] = useState('24');
  const [qual, setQual] = useState("Bachelor's Degree");
  const [cat, setCat] = useState('General');
  const [state, setState] = useState('Maharashtra');

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {

      const [examsResp, jobsResp] = await Promise.all([
        axios.get('http://localhost:4000/exams'),
        axios.get('http://localhost:4000/jobs'),
      ]);

      setExams(examsResp.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getResults = () => {

    const fully = [];
    const almost = [];
    const inel = [];

    exams.forEach(exam => {

      const examQual = exam.eligibility?.toLowerCase() || '';
      const userQual = qual.toLowerCase();

      const qualMatch = examQual.includes(userQual) || userQual.includes('bachelor');
      const ageNum = parseInt(age);
      const ageMatch = ageNum >= 18 && ageNum <= 32;

      if (qualMatch && ageMatch) {

        fully.push({
          name: exam.name,
          desc: exam.shortDescription
        });

      }
      else if (qualMatch || ageMatch) {

        almost.push({
          name: exam.name,
          reason: `Requirement mismatch: ${exam.eligibility || 'Check details'}`,
          bullets: [
            `Minimum Age: 18`,
            `Requirement: ${exam.eligibility}`
          ]
        });

      }
      else {

        inel.push({
          name: exam.name,
          reason: 'Criteria not met for this exam profile.'
        });

      }

    });

    return { fully, almost, inel };

  };

  const {
    fully: fullyEligible,
    almost: almostEligible,
    inel: ineligible
  } = getResults();

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <div className="flex items-center gap-2 mb-2">

          <Zap size={14} style={{ color: "var(--color-cyan)" }} />

          <span
            className="label"
            style={{ color: "var(--color-cyan)" }}
          >
            {t("arthaIntelligenceEngine")}
          </span>

        </div>

        <h1 className="page-title">
          {t("advancedEligibilityEngine")}
        </h1>

        <p className="text-subtle">
          {t("eligibilityMapDesc")}
        </p>

      </div>


      <div className="grid grid-cols-3 gap-6">

        {/* FORM */}

        <div>

          <div className="app-card p-6">

            <h2 className="card-title mb-1">
              {t("yourCriteria")}
            </h2>

            <p className="text-subtle mb-4">
              {t("updateDetails")}
            </p>

            <div className="space-y-4">

              <FormField label={t("currentAge")}>
                <TextInput
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </FormField>

              <FormField label={t("highestQualification")}>
                <SelectInput
                  value={qual}
                  onChange={(e) => setQual(e.target.value)}
                  options={[
                    "Bachelor's Degree",
                    "Master's Degree",
                    "12th / HSC",
                    "10th / SSC"
                  ]}
                />
              </FormField>

              <FormField label={t("reservationCategory")}>
                <SelectInput
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  options={[
                    'General',
                    'OBC',
                    'SC',
                    'ST',
                    'EWS'
                  ]}
                />
              </FormField>

              <FormField label={t("domicileState")}>
                <TextInput
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </FormField>

              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <Zap size={16} />
                {t("checkEligibilityBtn")}
              </button>

            </div>

          </div>

        </div>


        {/* RESULTS */}

        <div className="col-span-2 space-y-6">

          {loading ? (

            <div className="app-card p-10 text-center">

              <p className="text-subtle">
                {t("analyzingEligibility")}
              </p>

            </div>

          ) : (

            <>

              {/* FULLY ELIGIBLE */}

              <div>

                <div className="flex items-center gap-2 mb-3">

                  <CheckCircle
                    size={18}
                    style={{ color: "var(--success)" }}
                  />

                  <h3 className="section-title !text-xl">
                    {t("fullyEligible")} ({fullyEligible.length})
                  </h3>

                </div>

                <div className="space-y-3">

                  {fullyEligible.length === 0 ? (

                    <p className="text-subtle italic">
                      {t("noMatchesFound")}
                    </p>

                  ) : (

                    fullyEligible.map((exam) => (

                      <div
                        key={exam.name}
                        className="app-card p-4 flex items-start justify-between hover-lift"
                      >

                        <div className="flex-1 pr-4">

                          <p className="card-title text-sm">
                            {exam.name}
                          </p>

                          <p className="text-subtle mt-1">
                            {exam.desc}
                          </p>

                        </div>

                        <span className="badge-success">
                          {t("readyToApply")}
                        </span>

                      </div>

                    ))

                  )}

                </div>

              </div>


              {/* ALMOST ELIGIBLE */}

              <div>

                <div className="flex items-center gap-2 mb-3">

                  <AlertCircle
                    size={18}
                    style={{ color: "var(--warning)" }}
                  />

                  <h3 className="section-title !text-xl">
                    {t("almostEligible")} ({almostEligible.length})
                  </h3>

                </div>

                <div className="space-y-3">

                  {almostEligible.map((exam) => (

                    <div
                      key={exam.name}
                      className="app-card p-4 hover-lift"
                      style={{ borderColor: "var(--warning)" }}
                    >

                      <div className="flex items-start justify-between mb-2">

                        <p className="card-title text-sm">
                          {exam.name}
                        </p>

                        <span
                          className="label px-2 py-1 rounded-full"
                          style={{
                            background: "#fff7ed",
                            color: "var(--warning)"
                          }}
                        >
                          {t("actionRequired")}
                        </span>

                      </div>

                      <p
                        className="text-xs mb-2"
                        style={{ color: "var(--warning)" }}
                      >
                        {exam.reason}
                      </p>

                      {exam.bullets?.map((b, j) => (

                        <p key={j} className="text-subtle text-xs">
                          • {b}
                        </p>

                      ))}

                    </div>

                  ))}

                </div>

              </div>


              {/* INELIGIBLE */}

              <div>

                <div className="flex items-center gap-2 mb-3">

                  <XCircle
                    size={18}
                    style={{ color: "var(--danger)" }}
                  />

                  <h3 className="section-title !text-xl">
                    {t("ineligible")} ({ineligible.length})
                  </h3>

                </div>

                <div className="space-y-3">

                  {ineligible.map((exam) => (

                    <div
                      key={exam.name}
                      className="app-card p-4 hover-lift"
                    >

                      <div className="flex items-start justify-between mb-1">

                        <p className="card-title text-sm">
                          {exam.name}
                        </p>

                        <span
                          className="label px-2 py-1 rounded-full"
                          style={{
                            background: "var(--bg-light)",
                            color: "var(--text-muted)"
                          }}
                        >
                          {t("locked")}
                        </span>

                      </div>

                      <p
                        className="text-xs"
                        style={{ color: "var(--danger)" }}
                      >
                        {exam.reason}
                      </p>

                    </div>

                  ))}

                </div>

              </div>

            </>

          )}

        </div>

      </div>

    </div>

  );
}
