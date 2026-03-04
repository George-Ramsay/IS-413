import teamData from '../CollegeBasketballTeams.json';
import HeadingSection from './components/HeadingSection';
import TeamCardList from './components/TeamCardList';

function App() {
  const teams = teamData.teams.map((team) => ({
    ...team,
    school: team.school.trim(),
    name: team.name.trim(),
    city: team.city.trim(),
    state: team.state.trim(),
  }));

  return (
    <main className="page-shell">
      <HeadingSection totalTeams={teams.length} />
      <TeamCardList teams={teams} />
    </main>
  );
}

export default App;
