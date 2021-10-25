import { useCallback, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";
import Feed from "./Feed";

function App() {
  return (
    <Router>
      <div className="app">
        <div className="content">
          <Switch>
            <Route path="/me">
              <Feed />
            </Route>
            <Route path="/">
              <Feed />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
