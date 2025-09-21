import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import "./Home.css";

const Home = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Hero image scale (slight zoom on scroll)
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  // Hero overlay fade in
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <motion.img
          src="src/assets/violet_eve_banner.jpg"
          alt="EverLetter Banner"
          className="hero-image"
          style={{ scale: heroScale }}
        />

        {/* Floating letters */}
        <div className="floating-letters">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.span
              key={i}
              className="letter-icon"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: `-50px`,
              }}
              animate={{ y: [-50, -600], opacity: [0, 1, 0] }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            >
              ✉️
            </motion.span>
          ))}
        </div>

        {/* Overlay text */}
        <motion.div className="hero-overlay" style={{ opacity: overlayOpacity }}>
          <h1>Welcome to <span className="highlight">EverLetter</span></h1>
          <p>A place to cherish your letters and memories</p>
        </motion.div>
      </section>

      {/* Action buttons */}
      <div className="actions-grid">
        <Link to="/letters" className="action-card">✉️ Write a Letter</Link>
        <Link to="/mailroom" className="action-card">📬 Mailroom</Link>
        <Link to="/keepsakes" className="action-card">🎁 Keepsakes</Link>
        <Link to="/doll" className="action-card">👩‍💼 Memory Doll</Link>
      </div>

      {/* Recent Letters */}
      <div className="section">
        <h3>Recent Letters</h3>
        <div className="letters-list">
          <div className="letter-item">
            <div className="avatar">L</div>
            <div className="content">
              <h4>Luke Snyder</h4>
              <p>Thank you</p>
            </div>
            <span className="date">Jun 5</span>
          </div>
          <div className="letter-item">
            <div className="avatar">M</div>
            <div className="content">
              <h4>Maria Lee</h4>
              <p>Miss you</p>
            </div>
            <span className="date">May 22</span>
          </div>
        </div>
      </div>

      {/* Recent Keepsakes */}
      <div className="section">
        <h3>Recent Keepsakes</h3>
        <div className="keepsakes-list">
          <div className="keepsake-item">
            <div className="thumbnail">📸</div>
            <div className="info">
              <h4>Vacation Photo</h4>
              <p>Jun 1</p>
            </div>
          </div>
          <div className="keepsake-item">
            <div className="thumbnail">🎥</div>
            <div className="info">
              <h4>Birthday Video</h4>
              <p>May 20</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
