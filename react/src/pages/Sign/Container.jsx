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

  loadDocInfo() {
    const parsed = queryString.parse(window.location.search);
    const formData = new FormData();
    formData.append('doc', parsed.doc);
    formData.append('sig', parsed.sig);

    axios
      .post('/psignapi/docinfo.php', formData)
      .then((res) => {
        if (typeof res === 'object' && res !== null && 'data' in res) {
          const data = res.data;
          if (typeof data === 'object' && data !== null && 'error' in data) {
            alert('error: ' + data['error']);
          }
          if (
            typeof data === 'object' &&
            data !== null &&
            'result' in res.data
          ) {
            this.setState({ docInfo: res.data['result'] });
          } else {
            console.warn("didn't make it to res processing");
            console.warn(data);
          }
        } else {
          console.warn('unsuccessful post');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  signDocument = async () => {
    const { actor, permission } = this.context;
    const { history } = this.props;
    const { docInfo } = this.state;

    try {
      const date = new Date();
      const memo = `Signed ${docInfo.filename} on ProtonSign (${date.toLocaleString()})`;
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
      if (tx.processed.id) {
        const parsed = queryString.parse(window.location.search);
        const formData = new FormData();
        formData.append('doc', parsed.doc);
        formData.append('sig', parsed.sig);
        formData.append('tx', tx.processed.id);

        axios
          .post('/psignapi/logsignature.php', formData)
          .then((res) => {
            const isValidResponse = typeof res === 'object' && res !== null && 'data' in res;

            if (isValidResponse) {
              const data = res.data;
              const isObject = typeof data === 'object' && data !== null;
              const isError = isObject && 'error' in data;
              const isResult = isObject && 'result' in res.data;

              if (isError) {
                console.error('error: ' + data['error']);
              }

              if (isResult) {
                history.push({
                  pathname: '/signaturecompleted',
                  search: window.location.search,
                });
              } else {
                console.warn(data);
              }
            } else {
              console.warn('unsuccessful post');
            }
          })
          .catch((err) => {
            console.warn(err);
          });
      } else {
        console.warn(tx);
      }
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
