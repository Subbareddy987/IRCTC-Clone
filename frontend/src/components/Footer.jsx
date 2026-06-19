import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <h3>IRCTC Railway Reservation System</h3>

      <p>
        Book train tickets, check PNR status and manage reservations online.
      </p>

      <div className="footer-links">
        <span>Home</span>
        <span>Search Trains</span>
        <span>PNR Status</span>
        <span>My Bookings</span>
      </div>

      <p>© 2026 IRCTC Clone Project</p>
    </footer>
  );
}

export default Footer;
