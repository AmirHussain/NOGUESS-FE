
import './App.css';
//pages imports
import Home from './Components/Home/home';
import Lending from './pages/lending';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {routes} from "./routes"
import { ThemeProvider } from '@mui/styles';
import {CssBaseline} from '@mui/material'
import theme from './theme';


function App() {
  return (
    <ThemeProvider theme={theme}>
    <div className="App">
    <CssBaseline />
      <Router>
        <Switch>
          <Route path="*" exact component={Home}></Route>
          <Route path={routes.lending} exact component={Lending}></Route>
        </Switch>
      </Router>
    </div>
    </ThemeProvider>
  );
}

export default App;