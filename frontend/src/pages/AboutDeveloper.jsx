import "./AboutDeveloper.css";

function AboutDeveloper() {
  const highlights = [
    {
      label: "Role",
      value: "Full-stack developer",
    },
    {
      label: "Project",
      value: "IRCTC rail booking clone",
    },
    {
      label: "Focus",
      value: "Search, booking, authentication and PostgreSQL integration",
    },
  ];

  const skills = [
    "React",
    "Node.js",
    "Express",
    "PostgreSQL",
    "REST APIs",
    "Render Deployment",
  ];

  return (
    <main className="dev-page">
      <section className="dev-hero">
        <div className="dev-hero__content">
          <p className="dev-eyebrow">About the app developer</p>
          <h1>Kambam Subba Reddy</h1>
          <p className="dev-lead">
            I built this IRCTC clone as a full-stack railway reservation
            project, bringing together train search, route details, user
            authentication, coach availability, seat selection and booking
            history in one working web app.
          </p>
        </div>

        <div className="dev-profile">
          <div className="dev-profile__avatar">KS</div>
          <div>
            <span className="dev-profile__label">Developer</span>
            <strong>Kambam Subba Reddy</strong>
            <p>Web development and database-driven applications</p>
          </div>
        </div>
      </section>

      <section className="dev-section">
        <div className="dev-grid">
          {highlights.map((item) => (
            <article className="dev-card" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="dev-section dev-story">
        <div>
          <p className="dev-section-label">Project story</p>
          <h2>Built to understand real booking workflows</h2>
        </div>
        <p>
          This app is designed to feel like a practical railway booking system:
          users can register, log in, search station-to-station routes, inspect
          train stops, choose coaches, select seats and manage their bookings.
          The backend is connected to PostgreSQL so trains, routes, seats,
          bookings and users are stored as real application data.
        </p>
      </section>

      <section className="dev-section">
        <p className="dev-section-label">Technology used</p>
        <div className="dev-skills">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>
    </main>
  );
}

export default AboutDeveloper;
