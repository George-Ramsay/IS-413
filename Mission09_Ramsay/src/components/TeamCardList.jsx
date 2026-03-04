import TeamCard from './TeamCard';

function TeamCardList({ teams }) {
  return (
    <section aria-label="Team list" className="team-list">
      {teams.map((team) => (
        <TeamCard key={`${team.tid}-${team.school}`} team={team} />
      ))}
    </section>
  );
}

export default TeamCardList;
