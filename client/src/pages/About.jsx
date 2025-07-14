import styles from "./AboutStyle.module.css";

const About = () => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.heading}>About Hand Cricket</h1>

      <section className={styles.section}>
        <h2>🎮 What is Hand Cricket?</h2>
        <p>
          Hand Cricket is a digital version of the popular childhood game where players
          use fingers to represent runs ranging from 1 to 6. This web application brings
          that nostalgic experience online, enabling users to enjoy the game anytime,
          anywhere. Whether you want to play against a smart computer, challenge a
          friend, or track your career stats — this platform offers it all.
        </p>
        <p>
          The rules are simple: both players simultaneously choose a number between 1 and 6.
          If the numbers match, the batter is out; otherwise, the batter scores that many runs.
          The game continues until all wickets fall or the target is achieved in the second innings.
        </p>
      </section>

      <section className={styles.section}>
        <h2>🕹️ Game Modes</h2>
        <p>
          To make the game accessible and challenging for all types of players, we offer four modes:
        </p>
        <ul className={styles.list}>
          <li><b>Easy Mode:</b> The computer plays randomly. Great for beginners or casual players.</li>
          <li><b>Medium Mode:</b> The computer uses a basic machine learning model to adapt based on your playing pattern.</li>
          <li><b>Hard Mode:</b> A more advanced model is used, attempting to outthink your strategy by analyzing patterns over multiple games.</li>
          <li><b>Player vs Player (PvP):</b> Invite a friend using a room code and enjoy real-time hand cricket over the internet using sockets.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>🧠 Machine Learning & AI</h2>
        <p>
          One of the standout features of this game is the incorporation of AI in the form of
          machine learning. The system learns from user behavior and makes predictive choices based on past data.
        </p>
        <p>
          Depending on the difficulty level selected, different ML strategies are used:
        </p>
        <ul className={styles.list}>
          <li>
            <b>Medium Mode:</b> Uses a Logistic Regression model trained on player history
            to predict the most likely user move.
          </li>
          <li>
            <b>Hard Mode:</b> Utilizes a Random Forest Classifier that considers not only your
            current pattern but also your overall playing style across sessions.
          </li>
        </ul>
        <p>
          The prediction API is served from a Python backend (using FastAPI), which receives your
          batting and bowling histories and returns a predicted move based on model inference.
        </p>
      </section>

      <section className={styles.section}>
        <h2>🌐 Real-Time Multiplayer with Socket.IO</h2>
        <p>
          Multiplayer functionality is powered by Socket.IO, allowing players to create or join rooms.
          Once two players are in the same room, the game synchronizes toss results, move submissions,
          and decisions like batting/bowling in real-time.
        </p>
        <p>
          Every event — from toss selection to each ball played — is handled using socket listeners
          and emitters, ensuring a smooth and responsive experience without delays.
        </p>
        <p>
          We use event-based architecture where player choices, game decisions, and disconnections
          are communicated instantly across both clients via the server.
        </p>
      </section>

      <section className={styles.section}>
        <h2>👤 Player Profiles & Stats</h2>
        <p>
          Every user has a dedicated profile that keeps track of their overall and mode-specific stats.
          This includes total games, runs, wickets taken, tosses won, and a breakdown for each difficulty level.
        </p>
        <ul className={styles.list}>
          <li><b>Total games played</b> across all modes</li>
          <li><b>Wins and losses</b> (mode-wise and overall)</li>
          <li><b>Batting & bowling history</b> for ML training</li>
          <li><b>Tosses won</b> count</li>
          <li><b>Last 10 matches</b> and their summaries</li>
        </ul>
        <p>
          These stats are stored in MongoDB, and updated after each match automatically.
          You can visit your profile at any time and view your progress.
        </p>
      </section>

      <section className={styles.section}>
        <h2>🏆 Leaderboard & High Scores</h2>
        <p>
          The homepage features a leaderboard showcasing the top players based on criteria
          like total runs, number of wins, or longest win streak. This encourages friendly competition and gives players a reason to come back and play more.
        </p>
        <p>
          Whether you're a beginner or a veteran, you can work your way up the ranks by improving your
          performance in both solo and multiplayer games.
        </p>
      </section>

      <section className={styles.section}>
        <h2>🛠️ Technology Stack</h2>
        <ul className={styles.list}>
          <li><b>Frontend:</b> React.js, CSS Modules for styling, React Router for navigation</li>
          <li><b>Backend:</b> Node.js, Express.js for API routing</li>
          <li><b>Database:</b> MongoDB with Mongoose ORM</li>
          <li><b>Real-time Engine:</b> Socket.IO for multiplayer</li>
          <li><b>ML Service:</b> FastAPI (Python) using scikit-learn models served via REST</li>
        </ul>
        <p>
          The application is designed to be modular and scalable, with clean separation between
          frontend, backend, and ML services.
        </p>
      </section>

      <section className={styles.section}>
        <h2>🧪 Future Enhancements</h2>
        <ul className={styles.list}>
          <li>Global tournaments and seasonal leaderboards</li>
          <li>Player achievements and badges</li>
          <li>Support for 3+ player lobbies</li>
          <li>Advanced player analysis dashboard</li>
        </ul>
      </section>

      <p className={styles.footer}>
        🚀 Dive into nostalgia with a touch of modern AI. Challenge yourself, compete with others,
        and become the Hand Cricket Champion!
      </p>
    </div>
  );
};

export default About;
