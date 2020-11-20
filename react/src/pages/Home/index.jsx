import React, { useContext } from 'react';
import PageLayout from '../../components/PageLayout';
import { AppContext } from '../../components/Provider';

const Home = () => {
  const { login } = useContext(AppContext);

  return (
    <PageLayout
      isHomePage
      firstTitleLine="Free document signing on the"
      secondTitleLine="Proton Blockchain">
      <div className="uploadbox">
        <div className="loginlink center" onClick={login}>
          <img src="./images/wallet.png" alt="login" />
          <p className="center">Login to get started</p>
        </div>
        <div className="center grey">You will need to connect a wallet</div>
        <div className="center grey">that supports Proton.</div>
      </div>
    </PageLayout>
    );
};
export default Home;
