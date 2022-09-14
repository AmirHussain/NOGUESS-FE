
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
import { Web3Provider } from './Components/walletConnect/walletConnect';


function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={custome_theme}>

        <Web3Provider>
          <div className="App">
            <CssBaseline />
            <Router>
              <Switch>
                <Route path="*" exact component={Home}></Route>
                {/* <Route path={routes.lending} exact component={Lending}></Route> */}
              </Switch>
            </Router>
          </div>
        </Web3Provider>
      </ThemeProvider>

    </React.Fragment >
  );
}

export default App;