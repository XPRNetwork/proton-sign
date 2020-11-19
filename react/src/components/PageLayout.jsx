import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import { AppContext } from './Provider';

const Afterwords = () => (
  <div className="afterwords">
    Don't have a Proton wallet? Get one&nbsp;
    <a
      className="lav nolinkdecoration"
      href="http://www.protonchain.com/"
      rel="noreferrer"
      target="_blank">
      here
    </a>
  </div>
);

const PageLayout = ({
  children,
  firstTitleLine,
  secondTitleLine,
  hasAfterwords,
}) => {
  const { actor, accountData, logout } = useContext(AppContext);
  const avatarOrLoginButton = actor ? (
    <img
      src={accountData.avatar
        ? `data:image/jpeg;base64,${accountData.avatar}`
        : './images/default-avatar.png'}
      alt="avatar"
      className="header-avatar"
      onClick={logout}
    />
  ) : (
    <button className="lavbutton header-buttons">Connect Wallet</button>
  );

  return (
    <div className="page">
      <header className="titleline">
        <h1>
          Proton<font color="#4d5dc1">Sign</font>
        </h1>
        {avatarOrLoginButton}
      </header>
      <div className="titlebox">
        <div className="title">
          <div>
            {firstTitleLine}
            <br />
            {secondTitleLine}
          </div>
        </div>
        <div className="contentparent">
          <div className="imageshape1"></div>
          <div className="contentbox">{children}</div>
          <div className="imageshape2"></div>
        </div>
      </div>
      {hasAfterwords && <Afterwords />}
    </div>
  );
};

export default PageLayout;

PageLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  firstTitleLine: PropTypes.string.isRequired,
  secondTitleLine: PropTypes.string.isRequired,
  openConfirmModal: PropTypes.func,
  hasAfterwords: PropTypes.bool,
};

PageLayout.defaultProps = {
  openConfirmModal: null,
  firstTitleLine: '',
  secondTitleLine: '',
  hasAfterwords: false,
};
