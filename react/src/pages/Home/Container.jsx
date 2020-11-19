import React from 'react';
import ProtonSDK from '../../utils/proton';
import Home from '.';
import { AppContext } from '../../components/Provider';

class HomeContainer extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      windowWidth: 0,
      isLoggingIn: false,
    };
  }

  componentDidMount() {
    this.updateWindowWidth();
    window.addEventListener('resize', this.updateWindowWidth);
  }

  updateWindowWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  generateLoginRequest = async () => {
    const { setLoggedInState } = this.context;

    try {
      this.setState({ isLoggingIn: true });
      const { auth, accountData } = await ProtonSDK.login();
      setLoggedInState(auth.actor, auth.permission, accountData);
      this.setState({ isLoggingIn: false });
    } catch (e) {
      this.setState({ isLoggingIn: false });
      console.error(e);
    }
  };

  render() {
    const { windowWidth, isLoggingIn } = this.state;

    return (
      <Home
        openLoginModal={this.generateLoginRequest}
        windowWidth={windowWidth}
        isLoggingIn={isLoggingIn}
      />
    );
  }
}

export default HomeContainer;
