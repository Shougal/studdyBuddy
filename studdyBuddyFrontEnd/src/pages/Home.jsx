import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast";
import SessionCard from "../components/cards/Sessioncard";
import api from "../services/api";

const UVA_NAVY = "#232D4B";

const Home = ({ user }) => {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (user?.computingID) fetchMyGroups();
    else setLoading(false);
  }, [user]);

  const fetchMyGroups = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${user.computingID}/groups`);
      const groups = res.data || [];
      
      const now = new Date();
      const upcoming = [], past = [];

      groups.forEach(g => {
        
        const isOwner = g.owner_computingID === user.computingID;
        const enriched = { ...g, isOwner };
        if (g.date && g.end_time) {
          new Date(`${g.date}T${g.end_time}`) > now ? upcoming.push(enriched) : past.push(enriched);
        } else {
          upcoming.push(enriched);
        }
      });

      upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
      past.sort((a, b) => new Date(b.date) - new Date(a.date));
      setUpcomingSessions(upcoming);
      setPastSessions(past);
    } catch {
      toast.error("Could not load your sessions");
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async (g) => {
    try {
      await api.post(`/groups/${g.groupID}/leave`, { computingID: user.computingID });
      toast.success("Left group successfully");
      fetchMyGroups();
    } catch {
      toast.error("Could not leave group");
    }
  };

  const handleDelete = async (g) => {
    try {
      await api.delete(`/groups/${g.groupID}`, { data: { ownerID: user.computingID } });
      toast.success("Group deleted");
      fetchMyGroups();
    } catch {
      toast.error("Could not delete group");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "60px", color: "#6c757d" }}>Loading your sessions...</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ color: UVA_NAVY, marginBottom: "24px", fontWeight: 600 }}>
        Welcome back, {user?.name || user?.computingID}
      </h2>

      {/* Upcoming Sessions */}
      <section style={{ marginBottom: "40px" }}>
        <SectionHeader title="Upcoming Sessions" count={upcomingSessions.length} />
        
        {upcomingSessions.length === 0 ? (
          <EmptyState>
            No upcoming sessions. <Link to="/groups" style={{ color: UVA_NAVY, fontWeight: 600 }}>Find a study group</Link> to join.
          </EmptyState>
        ) : (
          upcomingSessions.map((s, i) => (
            <SessionCard
              key={`up-${s.groupID}-${i}`}
              groupID={s.groupID}
              mnemonic={s.mnemonic_num}
              courseName={s.course_name}
              description={s.description}
              date={s.date}
              start_time={s.start_time}
              end_time={s.end_time}
              building={s.building}
              room_number={s.room_number}
              members={s.members}
              ownerName={s.owner_name}
              isOwner={s.isOwner}
              isMember={true}
              showLeave={!s.isOwner}
              showDelete={s.isOwner}
              onLeave={() => handleLeave(s)}
              onDelete={() => handleDelete(s)}
            />
          ))
        )}
      </section>

      {/* Past Sessions */}
      <section>
        <SectionHeader title="Past Sessions" count={pastSessions.length} muted />
        
        {pastSessions.length === 0 ? (
          <p style={{ color: "#adb5bd" }}>No past sessions yet.</p>
        ) : (
          pastSessions.map((s, i) => (
            <SessionCard
              key={`past-${s.groupID}-${i}`}
              groupID={s.groupID}
              mnemonic={s.mnemonic_num}
              courseName={s.course_name}
              description={s.description}
              date={s.date}
              start_time={s.start_time}
              end_time={s.end_time}
              building={s.building}
              room_number={s.room_number}
              members={s.members}
              ownerName={s.owner_name}
              isOwner={s.isOwner}
              isMember={true}
              isPast={true}
              showFeedback={!s.isOwner}
              showViewFeedback={s.isOwner}
              onFeedback={() => navigate(`/feedback/${s.groupID}`)}
              onViewFeedback={() => navigate(`/feedback/${s.groupID}?view=summary`)}
            />
          ))
        )}
      </section>
    </div>
  );
};

const SectionHeader = ({ title, count, muted }) => (
  <h3 style={{
    color: muted ? "#6c757d" : UVA_NAVY,
    borderBottom: `2px solid ${muted ? "#dee2e6" : UVA_NAVY}`,
    paddingBottom: "10px",
    marginBottom: "16px",
    fontWeight: 600,
    display: "flex",
    justifyContent: "space-between"
  }}>
    {title}
    <span style={{ fontWeight: 400, color: "#6c757d" }}>{count}</span>
  </h3>
);

const EmptyState = ({ children }) => (
  <div style={{ background: "#fff", padding: "32px", borderRadius: "10px", textAlign: "center", color: "#6c757d" }}>
    {children}
  </div>
);

export default Home;