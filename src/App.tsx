import React from "react";
import "./App.css";
import Homepage from "./homepage/index";
import PrivatePage from "./privatepage/index";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Homepage} />
        <Route exact path='/private' component={PrivatePage} />
      </Switch>
    </Router>
  );
}

export default App;
