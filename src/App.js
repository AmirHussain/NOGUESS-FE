
import './App.css';
//pages imports
import Home from './Components/Home/home';
import Lending from './pages/lending';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {routes} from "./routes"
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="*" exact component={Home}></Route>
          <Route path={routes.lending} exact component={Lending}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;