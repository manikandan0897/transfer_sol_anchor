use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("AsBfva8FVsE3CUJzahF8txqt8TKxN3thejDfWzwjuDx3");

#[program]
pub mod sol_staking {
    use super::*;

    pub fn send_sol(ctx: Context<SendSol>, amount: u64) -> Result<()> {
        // Get rent information
        let rent = Rent::get()?;

        let recipient_balance = ctx.accounts.recipient.lamports();

        // Calculate the minimum lamports required for the staking account to be rent-exempt
        let required_rent_exempt_balance = rent.minimum_balance(ctx.accounts.recipient.data_len());

        if recipient_balance < required_rent_exempt_balance {
            // If not, fund the staking account with enough SOL to make it rent-exempt
            let additional_lamports_needed = required_rent_exempt_balance - recipient_balance;

            // Create a CPI context to transfer SOL into the staking account
            let cpi_context = CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.signer.to_account_info(),  // User's account
                    to: ctx.accounts.recipient.to_account_info(), // Staking account
                },
            );

            // Transfer the additional SOL needed for rent exemption
            system_program::transfer(cpi_context, additional_lamports_needed)?;
        }

        // Now perform the actual stake transfer (transfer the amount specified)
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.signer.to_account_info(),  // User's account
                to: ctx.accounts.recipient.to_account_info(), // Staking account
            },
        );

        // Transfer the stake amount to the staking account
        system_program::transfer(cpi_context, amount)?;

        Ok(())
    }
}


#[derive(Accounts)]
pub struct SendSol<'info> {
    /// CHECK: we do not read or write the data of this account
    #[account(mut)]
    recipient: AccountInfo<'info>,
    
    system_program: Program<'info, System>,

    #[account(mut)]
    signer: Signer<'info>,
}

#[account]
pub struct StakingAccount {
    pub amount_staked: u64,  // Internal state to track staked amount
}
