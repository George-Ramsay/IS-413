function HeadingSection({ totalTeams }) {
  return (
    <header className="hero">
      <p className="hero-kicker">March Madness MVP</p>
      <h1>NCAA College Basketball Team Directory</h1>
      <p>
        Browse every school in the dataset and quickly see each program&apos;s mascot
        and home location.
      </p>
      <p className="hero-count">Loaded teams: {totalTeams}</p>
    </header>
  );
}

export default HeadingSection;
