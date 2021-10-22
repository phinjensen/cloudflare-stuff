import { useCallback, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";
import Feed from "./Feed";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(localStorage.getItem("user"));

  const filter = useCallback((post) => post.username === user, [user]);

  return user ? (
    <Router>
      <div className="app">
        <div className="sidebar">
          <nav>
            <h3>Welcome, {user}!</h3>
            <ul>
              <li>
                <Link to="/">Feed</Link>
              </li>
              <li>
                <Link to="/me">Me</Link>
              </li>
              <li>
                <Link
                  to="/"
                  onClick={() => {
                    setUsername("");
                    setUser(null);
                    window.localStorage.removeItem("user");
                  }}
                >
                  Log out
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="content">
          <Switch>
            <Route path="/me">
              <Feed filter={filter} user={user} />
            </Route>
            <Route path="/">
              <Feed user={user} />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  ) : (
    <div className="app login">
      <p>Enter your username to log in:</p>
      <input
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <button
        onClick={() => {
          setUser(username);
          window.localStorage.setItem("user", username);
        }}
      >
        Log in
      </button>
    </div>
  );
}

export default App;
