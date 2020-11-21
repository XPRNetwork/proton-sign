import { ConnectWallet } from '@protonprotocol/proton-web-sdk';
import Logo from '../logo.svg';
class ProtonSDK {
  constructor() {
    this.chainId = '384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0';
    this.endpoints = ['https://proton.greymass.com'];
    this.appName = 'ProtonSign';
    this.requestAccount = 'protonsign';
    this.session = null;
    this.link = null;
  }
  
  connect = async (options) => {
    const walletOptions = {
      restoreSession: false,
      showSelector: true,
      ...options
    };
    
    const { link, session } = await ConnectWallet({
      linkOptions: {
        chainId: this.chainId,
        endpoints: this.endpoints,
        restoreSession: walletOptions.restoreSession,
      },
      transportOptions: {
        requestAccount: this.requestAccount,
        backButton: true,
      },
      selectorOptions: {
        appName: this.appName,
        appLogo: Logo,
        showSelector: walletOptions.showSelector,
      },
    });
    this.link = link;
    this.session = session;
  };
  
  login = async () => {
    try {
      await this.connect();
      const { auth, accountData } = this.session;
      
      localStorage.setItem('savedUserAuth-sign', JSON.stringify(auth));
      return {
        auth,
        accountData: accountData[0]
      };
    } catch (e) {
      return e;
    }
  };
  
  sendTransaction = async (actions) => {
    try {
      const result = await this.session.transact(
        { actions: actions },
        { broadcast: true }
      );
      return result;
    } catch (e) {
      return e;
    }
  };
  
  logout = async () => {
    await this.link.removeSession(this.requestAccount, this.session.auth);
    localStorage.removeItem('savedUserAuth-sign');
  };

  restoreSession = async () => {
    try {
      await this.connect({ restoreSession: true, showSelector: false });
      if (this.session) {
        const { auth, accountData } = this.session;
        return {
          auth,
          accountData: accountData[0],
        };
      }
    } catch (e) {
      return e;
    }
    return {
      auth: {
        actor: '',
        permission: ''
      },
      accountData: {}
    };
  };
}

export default  new ProtonSDK();
