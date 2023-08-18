import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from '../Landing/landing';
import homePage from '../Home/home';
import detailPage from '../details/details'
import FormPage from '../create/form';
import { Provider } from 'react-redux';
import store from '../reducer/store';

function App() {


  return (
    <Provider store={store}>
      <Router>
        <Switch>

          <Route path="/land" component={LandingPage} />
          <Route path="/home" component={homePage} />
          <Route path="/details/:id" component={detailPage}></Route>
          <Route path="/create" component={FormPage}></Route>
          <Route path="/" component={LandingPage} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
