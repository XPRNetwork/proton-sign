import React from 'react';
import { PropTypes } from 'prop-types';

const Afterwords = () => (
  <div className="center afterwords">
    <div>
      Don't have a Proton wallet? Get one{' '}
      <a
        className="lav nolinkdecoration"
        href="http://www.protonchain.com/"
        rel="noreferrer"
        target="_blank">
        here
      </a>
    </div>
  </div>
);

const PageLayout = ({
  children,
  avatar,
  firstTitleLine,
  secondTitleLine,
  hasAfterwords,
}) => (
  <div className="page">
    <div className="page-wrapper">
      <div>
        <table className="titleline">
          <tr>
            <td>
              <h1>
                Proton<font color="#4d5dc1">Sign</font>
              </h1>
            </td>
            <td
              style={{
                backgroundImage:
                  typeof avatar !== 'undefined'
                    ? `url('data:image/jpeg;base64,${avatar}')`
                    : `url('./images/default-avatar.png')`,
              }}
              alt="avatar"
              className="header-avatar"></td>
          </tr>
        </table>
        <div className="titlebox">
          <div className="title">
            <div>
              {firstTitleLine}
              <br />
              {secondTitleLine}
            </div>
          </div>
          <div className="contentparent">
            <div className="contentchild imageshape1"></div>
            <div className="contentchild imageshape2"></div>
            <div className="contentchild contentbox">{children}</div>
          </div>
        </div>
        {hasAfterwords && <Afterwords />}
      </div>
    </div>
  </div>
);

export default PageLayout;

PageLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  avatar: PropTypes.string,
  firstTitleLine: PropTypes.string.isRequired,
  secondTitleLine: PropTypes.string.isRequired,
  openConfirmModal: PropTypes.func,
  hasAfterwords: PropTypes.bool,
};

PageLayout.defaultProps = {
  avatar: '',
  openConfirmModal: null,
  firstTitleLine: '',
  secondTitleLine: '',
  hasAfterwords: false,
};
