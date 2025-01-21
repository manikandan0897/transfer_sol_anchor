import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolStaking } from "../target/types/sol_staking";

describe("sol_staking", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SendsolSolana as Program<SolStaking>;

  async function printAccountBalance(account) {
    const balance = await anchor.getProvider().connection.getBalance(account);
    console.log(`${account} has ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`);
  }

  it("Transmit SOL", async () => {
    // Add your test here.
    const recipient = anchor.web3.Keypair.generate();

    await printAccountBalance(recipient.publicKey);

    let amount = new anchor.BN(0.1 * anchor.web3.LAMPORTS_PER_SOL);
    const tx = await program.methods.sendSol(amount)
      .accounts({recipient: recipient.publicKey})
      .rpc();
    await printAccountBalance(recipient.publicKey);
  });
});
