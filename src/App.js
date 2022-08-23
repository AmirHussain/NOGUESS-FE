
import './App.css';
//pages imports
import Home from './pages/home/index';
import Lending from './pages/lending';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { routes } from "./routes"
import { ThemeProvider } from '@mui/styles';
import { CssBaseline } from '@mui/material'
import custome_theme from './theme';
import React from 'react'


function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={custome_theme}>
        <div className="App">
          <CssBaseline />
          <Router>
            <Switch>
              <Route path="*" exact component={Home}></Route>
              {/* <Route path={routes.lending} exact component={Lending}></Route> */}
            </Switch>
          </Router>
        </div>
      </ThemeProvider>
    </React.Fragment >
  );
}

export default App;