import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
import ProtonSDK from '../../utils/proton';
import PageLayout from '../../components/PageLayout';
import FileInfo from '../../components/FileInfo';
import { AppContext } from '../../components/Provider';

class SignContainer extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      isLoggingIn: false,
      docInfo: { hash: '', filename: '', filesize: '', signer_name: '' },
      downloadlink: '/psignapi/download.php' + this.props.location.search,
    };
    this.loadDocInfo();
  }

  loadDocInfo = async () => {
    const parsed = queryString.parse(window.location.search);
    const formData = new FormData();
    formData.append('doc', parsed.doc);
    formData.append('sig', parsed.sig);

    const res = await axios.post('/psignapi/docinfo.php', formData);
    const isValidResponse =
      typeof res === 'object' && res !== null && 'data' in res;
    const isValidData = typeof res.data === 'object' && res.data !== null;
    const isError = isValidResponse && isValidData && 'error' in res.data;
    const isResult = isValidResponse && isValidData && 'result' in res.data;

    if (isError) {
      alert('Error: ' + res.data['error']);
      return;
    }

    if (!isResult) {
      alert('Unable to load document. Please try again.');
      return;
    }

    this.setState({ docInfo: res.data['result'] });
  }

  signDocument = async () => {
    const { actor, permission } = this.context;
    const { history } = this.props;
    const { docInfo } = this.state;

    try {
      const date = new Date();
      const memo = `Signed ${docInfo.filename} with hash ${docInfo.hash} on ProtonSign (${date.toLocaleString()})`;
      const actions = [
        {
          account: 'xtokens',
          name: 'transfer',
          authorization: [
            {
              actor: actor,
              permission: permission,
            },
          ],
          data: {
            from: actor,
            to: ProtonSDK.requestAccount,
            quantity: '1.000000 FOOBAR',
            memo,
          },
        },
      ];

      const tx = await ProtonSDK.sendTransaction(actions);

      if (!tx.processed.id) {
        throw new Error('Unable to send transaction.');
      }

      const parsed = queryString.parse(window.location.search);
      const formData = new FormData();
      formData.append('doc', parsed.doc);
      formData.append('sig', parsed.sig);
      formData.append('tx', tx.processed.id);

      const res = await axios.post('/psignapi/logsignature.php', formData);
      const isValidResponse = typeof res === 'object' && res !== null && 'data' in res;
      const isValidData = typeof res.data === 'object' && res.data !== null;
      const isError = isValidResponse && isValidData && 'error' in res.data;
      const isResult = isValidResponse && isValidData && 'result' in res.data;

      if (isError) {
        alert('Error: ' + res.data['error']);
        return;
      }
      
      if (!isResult) {
        alert('Unable to sign. Please try again.');
        return;
      }

      history.push('/signaturecompleted');
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { accountData, login } = this.context;
    const { docInfo, downloadlink } = this.state;
    const { hash, filename, filesize } = docInfo;
    const isLoggedIn = accountData && accountData.hasOwnProperty('name');
    const signer = isLoggedIn ? `I, ${accountData.name},` : `I`;

    return (
      <PageLayout isSignPage firstTitleLine="Please Sign Document">
        <div className="checksumbox little">Checksum: {hash}</div>

        <FileInfo filename={filename} filesize={filesize.toString()}>
          <td className="right">
            <p>
              <a className="lav nolinkdecoration little" href={downloadlink}>
                Download
              </a>
            </p>
          </td>
        </FileInfo>

        <p className="grey">
          {signer} agree to sign the following file on the Proton Blockchain and
          <br />
          understand that this action can't be undone.
        </p>

        <button
          className="lavbutton"
          type="button"
          onClick={isLoggedIn ? this.signDocument : login}>
          {isLoggedIn ? 'Sign document' : 'Connect Wallet'}
        </button>
      </PageLayout>
    );
  }
}

export default SignContainer;
