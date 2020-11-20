import React from 'react';
import Home from '.';

class HomeContainer extends React.Component {
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

  render() {
    const { windowWidth, isLoggingIn } = this.state;

    return (
      <Home
        windowWidth={windowWidth}
        isLoggingIn={isLoggingIn}
      />
    );
  }
}

export default HomeContainer;
