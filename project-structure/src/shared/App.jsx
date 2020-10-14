import './App.scss';
import React, { Component, Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import routes from './routes';

@withRouter
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sidebar: {},
      modal: {}
    };
  }

  componentDidMount () {
    //эмиттеры
  }

//методы на открытие модальных окон и сайдбарво

  render() {
    return (
      <Fragment>
        <Aside/>
        <main id="main">
          <Header/>
          <div id="content">
            <Switch>
              {routes.map(({ path, exact, component: Component, initialAction }, i) => {
                return <Route key={i} {...{ path, exact } } render={props => <Component { ...{ initialAction, ...props }}/>} />;
              })}
            </Switch>
            <Footer/>
          </div>
        </main>
        //модальные окна,сайдбары,куки
      </Fragment>
    );
  }
}

export default App;
