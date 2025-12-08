import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast";
import api from "../services/api";

const UVA_NAVY = "#232D4B";

const Feedback = ({ user }) => {
  const { groupID } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const viewMode = searchParams.get("view") === "summary";

  const [group, setGroup] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroup();
    viewMode ? fetchSummary() : fetchQuestions();
  }, [groupID, viewMode]);

  const fetchGroup = async () => {
    try { setGroup((await api.get(`/groups/${groupID}`)).data); } catch {}
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setQuestions((await api.get("/survey/questions")).data || []);
    } catch { toast.error("Could not load questions"); }
    finally { setLoading(false); }
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setSummary((await api.get(`/survey/groups/${groupID}/summary`)).data || []);
    } catch { toast.error("Could not load feedback"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const [qID, resp] of Object.entries(responses)) {
        if (resp) await api.post("/survey/feedback", { questionID: Number(qID), computingID: user.computingID, groupID: Number(groupID), response: resp });
      }
      toast.success("Feedback submitted. Thank you!");
      setTimeout(() => navigate("/"), 1500);
    } catch { toast.error("Could not submit feedback"); }
  };

  if (!user) return <div style={{ textAlign: "center", padding: "60px", color: "#6c757d" }}>Please log in</div>;
  if (loading) return <div style={{ textAlign: "center", padding: "60px", color: "#6c757d" }}>Loading...</div>;

  const formatDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: UVA_NAVY, cursor: "pointer", marginBottom: "20px", fontSize: "0.95rem", fontWeight: 500 }}>
        ← Back
      </button>

      {group && (
        <div style={{ background: "#e8f4fd", padding: "16px 20px", borderRadius: "10px", marginBottom: "24px", borderLeft: `4px solid ${UVA_NAVY}` }}>
          <h3 style={{ margin: "0 0 4px 0", color: UVA_NAVY, fontWeight: 600 }}>{group.mnemonic_num}</h3>
          <p style={{ margin: 0, color: "#495057", fontSize: "0.9rem" }}>{formatDate(group.date)} · {group.start_time} - {group.end_time}</p>
        </div>
      )}

      {viewMode ? (
        <div>
          <h2 style={{ color: UVA_NAVY, marginBottom: "20px", fontWeight: 600 }}>Feedback Summary</h2>
          {summary.length === 0 ? (
            <div style={{ background: "#fff", padding: "40px", borderRadius: "10px", textAlign: "center", color: "#6c757d" }}>
              No feedback received yet.
            </div>
          ) : (
            summary.map((s, i) => (
              <div key={`s-${i}`} style={{ background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                <p style={{ fontWeight: 500, marginBottom: "12px", color: "#212529" }}>{s.question}</p>
                <div style={{ display: "inline-block", background: UVA_NAVY, color: "#fff", padding: "6px 14px", borderRadius: "20px", fontSize: "0.9rem", fontWeight: 600 }}>
                  {s.responses} responses
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div>
          <h2 style={{ color: UVA_NAVY, marginBottom: "20px", fontWeight: 600 }}>Submit Feedback</h2>
          <form onSubmit={handleSubmit} style={{ background: "#fff", padding: "28px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            {questions.length === 0 ? (
              <p style={{ color: "#6c757d" }}>No survey questions available.</p>
            ) : (
              questions.map((q, i) => (
                <div key={`q-${q.questionID}-${i}`} style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontWeight: 500, marginBottom: "10px", color: "#212529" }}>{q.question}</label>

                  {q.type_is === "rating" ? (
                    <div style={{ display: "flex", gap: "8px" }}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} type="button" onClick={() => setResponses({...responses, [q.questionID]: String(n)})}
                          style={{
                            width: "48px", height: "48px", borderRadius: "8px",
                            border: responses[q.questionID] === String(n) ? `2px solid ${UVA_NAVY}` : "1px solid #dee2e6",
                            background: responses[q.questionID] === String(n) ? UVA_NAVY : "#fff",
                            color: responses[q.questionID] === String(n) ? "#fff" : "#495057",
                            fontSize: "1.1rem", cursor: "pointer", fontWeight: 600
                          }}>
                          {n}
                        </button>
                      ))}
                    </div>
                  ) : q.type_is === "yes/no" ? (
                    <div style={{ display: "flex", gap: "12px" }}>
                      {["Yes", "No"].map(opt => (
                        <button key={opt} type="button" onClick={() => setResponses({...responses, [q.questionID]: opt.toLowerCase()})}
                          style={{
                            padding: "12px 32px", borderRadius: "8px",
                            border: responses[q.questionID] === opt.toLowerCase() ? `2px solid ${UVA_NAVY}` : "1px solid #dee2e6",
                            background: responses[q.questionID] === opt.toLowerCase() ? UVA_NAVY : "#fff",
                            color: responses[q.questionID] === opt.toLowerCase() ? "#fff" : "#495057",
                            cursor: "pointer", fontWeight: 500
                          }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      value={responses[q.questionID] || ""}
                      onChange={(e) => setResponses({...responses, [q.questionID]: e.target.value})}
                      rows={3}
                      placeholder="Your response..."
                      style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #dee2e6", fontSize: "1rem", boxSizing: "border-box" }}
                    />
                  )}
                </div>
              ))
            )}

            {questions.length > 0 && (
              <button type="submit" style={{ width: "100%", padding: "14px", background: UVA_NAVY, color: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", fontWeight: 600, cursor: "pointer" }}>
                Submit Feedback
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default Feedback;