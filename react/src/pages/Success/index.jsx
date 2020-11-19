import React, { useContext } from 'react';
import { PropTypes } from 'prop-types';
import PageLayout from '../../components/PageLayout';
import { AppContext } from '../../components/Provider';

const Success = ({
  firstTitleLine,
  secondTitleLine,
  firstLabelLine,
  secondLabelLine
}) => {
  const { accountData } = useContext(AppContext);

  return (
    <PageLayout
      avatar={accountData.avatar}
      firstTitleLine={firstTitleLine}
      secondTitleLine={secondTitleLine}>
      <div className="uploadbox center">
        <div>
          <img src="./images/check.png" alt="Success!" />
        </div>
        <p>Success!!</p>
        <label className="grey">
          {firstLabelLine}
          <br />
          {secondLabelLine}
        </label>
      </div>
    </PageLayout>
  );
};

export default Success;

Success.propTypes = {
  firstTitleLine: PropTypes.string.isRequired,
  secondTitleLine: PropTypes.string.isRequired,
  firstLabelLine: PropTypes.string.isRequired,
  secondLabelLine: PropTypes.string.isRequired,
};

Success.defaultProps = {
  firstTitleLine: '',
  secondTitleLine: '',
  firstLabelLine: '',
  secondLabelLine: '',
};
