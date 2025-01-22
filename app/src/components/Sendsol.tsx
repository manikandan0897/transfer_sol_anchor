import React,{useEffect, useState} from 'react'
import { useWallet,useConnection,useAnchorWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets"
import { PublicKey, Keypair } from "@solana/web3.js";
import { Program, AnchorProvider, setProvider } from '@coral-xyz/anchor';
import idl from './idl.json'
import type { SolStaking } from './sol_staking';
import * as solanaWeb3 from "@solana/web3.js";

import BN from 'bn.js';

export default function Sendsol() {
  
  const { connected, select, publicKey } = useWallet()
  const { connection } = useConnection();
  const [value, setvalue] = useState(0);
  const [usrbalance, setusrbalance] = useState(0);
  const [recipientaddress, setrecipientaddress] = useState("");
  const [recipientbal, setrecipientbal] = useState(0);
  const wallet = useAnchorWallet();

  const onConnect = () => {
    select(PhantomWalletName)
  }

  const getsolanaamt = async(e:any) => {
    e.preventDefault()
    setvalue(e.target.value)
  }

  const getreceipientbal = async(e:any) => {
    e.preventDefault()
    setrecipientaddress(e.target.value)
    const publicKeyreceipt = new solanaWeb3.PublicKey(e.target.value);
    const balance = await connection.getBalance(publicKeyreceipt);
    setrecipientbal(balance/solanaWeb3.LAMPORTS_PER_SOL);
  }


  useEffect(() => {
    const getbalance = async() => {
      if(wallet) {
        const balance = await connection.getBalance(wallet.publicKey);
        setusrbalance(balance/solanaWeb3.LAMPORTS_PER_SOL)
      }
    }
    getbalance()
  })

  const transfersolana = async() => {
    if(wallet) {
      const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" });
      setProvider(provider);
      const program = new Program(idl as SolStaking, provider);

      const amount = new BN(value * solanaWeb3.LAMPORTS_PER_SOL);

      await program.methods.sendSol(amount).accounts({
        recipient: recipientaddress,
      })
      .rpc();
    }
  }
  

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="#">SOL</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className='nav-item mx-lg-3 mt-lg-2'>
                {
                  connected ? <>
                    <div>Balance : {usrbalance} Sol</div>
                  </>:<>
                    <div></div>
                  </>
                }
              </li>
              <li className="nav-item">{
                  connected ? <>
                  <button className="btn btn-primary">{publicKey?.toBase58()}</button>
                  </> : <>
                    <button className="btn btn-primary" onClick={onConnect}>Connect Wallet</button>
                  </>
                }                
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className='container mt-lg-4'>
          <div className='text-center'>
            <h4>Solana send app</h4>
          </div>
        <div className='inputbox'>
           <div className='mb-3 mt-3 inputpanel'>
              <label  className="form-label">Enter Sol</label>
              <input type="text" 
                className="form-control" 
                id="exampleFormControlInput1" 
                placeholder=""
                value={value}
                onChange={e => getsolanaamt(e)}
                />
           </div>
           <div className='mb-3 inputpanel'>
              <label  className="form-label">Recipient address</label>
              <input type="text" className="form-control" 
                id="exampleFormControlInput1" 
                placeholder=""
                value={recipientaddress}
                onChange={e => getreceipientbal(e)}
                />
           </div>
           <div className='mb-3 inputpanel'>
              <label  className="form-label">Recipient Balance</label>
              <input  className="form-control" 
                id="exampleFormControlInput1" 
                placeholder=""
                value={recipientbal}
                readOnly
                />
           </div>
            <div className='mt-4 counterbutton'>
              <button className='btn btn-primary px-4' onClick={transfersolana}>Send</button>
            </div>
        </div>
      </div>

      <div className='container mt-4'>
          
          
      </div>
    </>
  )
}
