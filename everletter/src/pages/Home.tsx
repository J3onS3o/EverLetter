import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="home-container">
      {/* Welcome Banner Animation */}
        <div className="banner-container">
           <img
                src="src/assets/violet_eve_banner.jpg"
                alt="EverLetter Banner"
                className="banner-image width-full centered-image animate-float"
            />
        </div> 
      {/* Welcome Section */}
      <div className="welcome-section">
        <h2 className="welcome-title">Welcome to EverLetter</h2>
        <p className="welcome-subtitle">A place to cherish your letters and memories</p>
        <img src="src/assets/everletter.png" alt="EverLetter Banner" className="welcome-decorative" />
      </div>

      {/* Action Buttons Grid - Now using Links for navigation */}
      <div className="actions-grid">
        <Link to="/letters" className="action-card">
          <span className="action-icon">✉️</span>
          <span className="action-text">Write a Letter</span>
        </Link>
        <Link to="/mailroom" className="action-card">
          <span className="action-icon">📬</span>
          <span className="action-text">View Mailroom</span>
        </Link>
        <Link to="/keepsakes" className="action-card">
          <span className="action-icon">🎁</span>
          <span className="action-text">View Keepsakes</span>
        </Link>
        <Link to="/doll" className="action-card">
          <span className="action-icon">👩‍💼</span>
          <span className="action-text">Auto Memory Doll</span>
        </Link>
      </div>

      {/* Recent Letters Section */}
      <div className="section">
        <h3 className="section-title">Recent Letters</h3>
        <div className="letters-list">
          <div className="letter-item">
            <div className="letter-avatar">L</div>
            <div className="letter-content">
              <h4 className="letter-sender">Luke Snyder</h4>
              <p className="letter-preview">Thank you</p>
            </div>
            <span className="letter-date">Jun 5</span>
          </div>
          <div className="letter-item">
            <div className="letter-avatar">M</div>
            <div className="letter-content">
              <h4 className="letter-sender">Maria Lee</h4>
              <p className="letter-preview">Miss you</p>
            </div>
            <span className="letter-date">May 22</span>
          </div>
        </div>
      </div>

        {/* Recent Keepsakes Section */}
        <div className="section">
        <h3 className="section-title">Recent Keepsakes</h3>
        <div className="keepsakes-list">
            <div className="keepsake-item">
                <div className="keepsake-thumbnail">📸</div>
                <div className="keepsake-info">
                    <h4 className="keepsake-title">Vacation Photo</h4>
                    <p className="keepsake-date">Jun 1</p>
                    </div>
            </div>
            <div className="keepsake-item">
                <div className="keepsake-thumbnail">🎥</div>
                <div className="keepsake-info">
                    <h4 className="keepsake-title">Birthday Video</h4>
                    <p className="keepsake-date">May 20</p>
                    </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Home