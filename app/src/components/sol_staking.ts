/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/sol_staking.json`.
 */
export type SolStaking = {
    "address": "AsBfva8FVsE3CUJzahF8txqt8TKxN3thejDfWzwjuDx3",
    "metadata": {
      "name": "solStaking",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "sendSol",
        "discriminator": [
          214,
          24,
          219,
          18,
          3,
          205,
          201,
          179
        ],
        "accounts": [
          {
            "name": "recipient",
            "writable": true
          },
          {
            "name": "systemProgram",
            "address": "11111111111111111111111111111111"
          },
          {
            "name": "signer",
            "writable": true,
            "signer": true
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    ]
  };
  