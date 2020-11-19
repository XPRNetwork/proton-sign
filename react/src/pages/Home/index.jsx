import React from 'react';
import PropTypes from 'prop-types';
import PageLayout from '../../components/PageLayout';

const Home = ({ openLoginModal }) => (
  <PageLayout
    hasAfterwords
    firstTitleLine="Free document signing on the"
    secondTitleLine="Proton Blockchain">
    <div className="uploadbox">
      <div className="loginlink center" onClick={openLoginModal}>
        <img src="./images/wallet.png" alt="login" />
        <p className="center">Login to get started</p>
      </div>
      <div className="center grey">You will need to connect a wallet</div>
      <div className="center grey">that supports Proton.</div>
    </div>
  </PageLayout>
);

export default Home;

Home.propTypes = {
  openLoginModal: PropTypes.func.isRequired,
};
