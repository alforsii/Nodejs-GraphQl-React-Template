import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./components/auth/Login";
import Navbar from "./components/nav/Navbar";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h2>Hello</h2>
      <Navbar />
      <Switch>
        <Redirect from="/" to="/auth" exact />
        <Route path="/auth" component={null} />
        <Route path="/login" component={Login} />
      </Switch>
    </div>
  );
}

export default App;
