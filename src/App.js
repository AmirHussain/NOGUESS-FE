
import './App.css';
import Home from './Components/Home/home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="*" exact component={Home}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;