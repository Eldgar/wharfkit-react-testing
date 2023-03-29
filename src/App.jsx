import React, { useState, useEffect, useRef } from 'react';
import { SessionKit } from '@wharfkit/session';
import { WebUIRenderer } from '@wharfkit/web-ui-renderer';
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor';
import { WalletPluginCloudWallet } from '@wharfkit/wallet-plugin-cloudwallet';


function App() {
  const [session, setSession] = useState(null);
  const [sessionKit, setSessionKit] = useState(null);
  const uiContainerRef = useRef(null);
    
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ui = new WebUIRenderer({ id: "login" });
      const anchor = new WalletPluginAnchor();
  
      const sessionKit = new SessionKit({
          appName: 'demo',
          chains: [
              {
                  id: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
                  url: 'https://eos.greymass.com',
                  explorer: {
                      prefix: 'https://bloks.io/transaction/',
                      suffix: '',
                  },
              },
              {
                  id: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
                  url: 'https://telos.greymass.com',
                  explorer: {
                      prefix: 'https://explorer.telos.net/transaction/',
                      suffix: '',
                  },
              },
              {
                  id: '8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02',
                  url: 'https://api.uxnetwork.io',
                  explorer: {
                      prefix: 'https://explorer.uxnetwork.io/tx/',
                      suffix: '',
                  },
              },
              {
                  id: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
                  url: 'https://wax.greymass.com',
                  explorer: {
                      prefix: 'https://waxblock.io/transaction/',
                      suffix: '',
                  },
                },
          ],
          container: ui.appendDialogElement(),
          walletPlugins: [
              new WalletPluginAnchor(),
              new WalletPluginCloudWallet(),
          ],
      })
        setSessionKit(sessionKit);
        uiContainerRef.current.appendChild(sessionKit.container);
      }
    }, [uiContainerRef.current]);

    async function login() {
      console.log("sessionKit ", sessionKit)
        const response = await sessionKit.login();
        setSession(response.session);
        console.log(session)
    }
  

  const logout = async () => {
    try {
      await sessionKit.logout(session);
      setSession(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const transact = async () => {
    if (!session) {
      console.error("No session available for the transaction");
      return;
    }

    const action = {
      account: "eosio.token",
      name: "transfer",
      authorization: [session.permissionLevel],
      data: {
        from: session.actor,
        to: "teamgreymass",
        quantity: "0.00000001 WAX",
        memo: "Yay WharfKit! Thank you <3",
      },
    };

    try {
      await session.transact({ action }, { broadcast: false });
    } catch (error) {
      console.error("Error in transaction:", error);
    }
  };

  return (
    <div>
       <div ref={uiContainerRef} />
      {session ? (
        
        <>
          <button onClick={transact}>Test Transaction (No Broadcast)</button>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>

  );
}

export default App
