import logo from './logo.svg';
import './App.css';
import {Container} from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";

//Bootstrap React
import 'bootstrap/dist/css/bootstrap.min.css';

//Pages
import MainPage from './pages/MainPage'
import WatchList from './pages/WatchList'
import DetailedPage from './pages/DetailedPage'

function App() {
  return (
    <div className="App">
      <Container>
        <Router>
          <Switch>
            <Route path="/watchlist" component={WatchList}/>
            <Route path="/detailedpage/:coin_name" component={DetailedPage}/>
            <Route path="/" exact component={MainPage}/>
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default App;
