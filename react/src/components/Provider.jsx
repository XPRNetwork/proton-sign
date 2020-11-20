import React, { createContext } from 'react';
import { withRouter } from 'react-router-dom';
import ProtonSDK from '../utils/proton';

export const AppContext = createContext({
  actor: '',
  permission: '',
  session: '',
  accountData: {},
  docInfo: {},
  setLoggedInState: () => {},
  setDocInfo: () => {},
  login: () => {},
  logout: () => {},
});

class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actor: '',
      permission: '',
      session: '',
      accountData: {},
      docInfo: {},
    };
  }

  componentDidMount = async () => {
    this.checkIfLoggedIn();
  };

  checkIfLoggedIn = async () => {
    const { auth, accountData } = await ProtonSDK.restoreSession();
    const { history } = this.props;

    if (auth && auth.actor && auth.permission) {
      this.setLoggedInState(auth.actor, auth.permission, accountData);
    } else {
      if (
        window.location.search.includes('doc') &&
        !window.location.href.includes('/sign')
      ) {
        history.push({
          pathname: '/sign',
          search: window.location.search,
        });
      }
    }
  };

  setDocInfo = async (docInfo) => {
    this.setState({ docInfo });
  };

  setLoggedInState = async (actor, permission, accountData) => {
    const { history } = this.props;
    this.setState({ actor, permission, accountData });

    if (window.location.search.includes('doc')) {
      history.push({
        pathname: '/sign',
        search: window.location.search,
      });
    } else {
      history.push({
        pathname: '/uploaddoc',
        search: window.location.search,
      });
    }
  };

  login = async () => {
    try {
      const { auth, accountData } = await ProtonSDK.login();
      this.setLoggedInState(auth.actor, auth.permission, accountData);
    } catch (e) {
      console.error(e);
    }
  };

  logout = async () => {
    const { accountData } = this.state;
    const { history } = this.props;
    if (accountData && accountData.acc) {
      await ProtonSDK.logout();
      this.setState({ actor: '', accountData: {}, session: '' });
    }
    history.push('/');
  };

  render() {
    const { children } = this.props;
    const contextValue = {
      ...this.state,
      setLoggedInState: this.setLoggedInState,
      setDocInfo: this.setDocInfo,
      logout: this.logout,
      login: this.login
    };

    return (
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    );
  }
}

export default withRouter(Provider);
