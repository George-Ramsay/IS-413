function TeamCard({ team }) {
  return (
    <article className="team-card">
      <h2>{team.school}</h2>
      <p>
        <strong>Mascot:</strong> {team.name}
      </p>
      <p>
        <strong>Location:</strong> {team.city}, {team.state}
      </p>
    </article>
  );
}

export default TeamCard;
