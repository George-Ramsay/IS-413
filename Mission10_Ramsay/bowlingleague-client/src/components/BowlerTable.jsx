import { useEffect, useState } from "react";

function BowlerTable() {
  const [bowlers, setBowlers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBowlers() {
      try {
        const response = await fetch("/api/bowlers", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load bowlers from the API.");
        }

        const data = await response.json();
        setBowlers(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    loadBowlers();

    return () => controller.abort();
  }, []);

  if (loading) {
    return <p className="status">Loading bowlers...</p>;
  }

  if (error) {
    return <p className="status error">{error}</p>;
  }

  return (
    <section className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>First</th>
            <th>Middle</th>
            <th>Last</th>
            <th>Team</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Zip</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {bowlers.map((bowler, index) => (
            <tr key={`${bowler.lastName}-${bowler.firstName}-${index}`}>
              <td>{bowler.firstName}</td>
              <td>{bowler.middleInitial || "-"}</td>
              <td>{bowler.lastName}</td>
              <td>{bowler.teamName}</td>
              <td>{bowler.address}</td>
              <td>{bowler.city}</td>
              <td>{bowler.state}</td>
              <td>{bowler.zip}</td>
              <td>{bowler.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default BowlerTable;