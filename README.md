# token-distribution

This repository contains the queries necessary to reproduce the lists of UMA KPI Options airdrop recipients. 

## Airdrop Criteria

Any action listed below must occur before (or at) Etherum block number 11830000, which is Unix Timestamp 1612976449 (Feb-10-2021 05:00:49 PM UTC).

### Governance Recipients

90 KPI Options go to:
- Any address that has voted in one of the Yearn, BadgerDAO, Sushi, Balancer or YAM [snapshot.page](https://snapshot.page/#/) spaces. These addresses are shown [here](./outputs/governance_recipients.json).

### UMA Tokenholders

60 KPI Options go to:
- Any address holding a balance of 10 or more [UMA](https://etherscan.io/token/0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828) at Feb-10-2021 05:00:49 PM UTC. These addresses are shown [here](./outputs/uma_holder_recipients.json).

### UMA Users

120 KPI Options go to:
- Any address that has voted in UMA governance.
- Any address that has minted an UMA [synthetic token](https://docs.umaproject.org/synthetic-tokens/what-are-synthetic-assets). These addresses are shown [here](./outputs/uma_user_recipients.json).

## Reproduction

### Installing dependencies

You'll need to install nodejs v14 and yarn. Assuming that's done, run:

```
yarn
```

### Setting up Google Cloud

The `GetAllTokenholders.js` query uses Google Big Query. To run this script, you will need to:

1. Create a Google Cloud project.
2. Navigate to `IAM & Admin` and then the `Service Accounts` dashboard.
3. Create a Service Account.
4. Create a new key pair.
5. Download your key as a JSON file and move it to an easy to find location locally.
6. Create an environment variable by running `export GOOGLE_APPLICATION_CREDENTIALS=~/file_path_to_your_key`.
7. Run `printenv` to verify that the environment variable was correctly set.

### Running the script

To run the script, use:

```
node collectAddresses.js --url your.node.url.io
```

## More information

- This [article](https://medium.com/uma-project/uma-kpi-options-and-airdrop-bae86be16ce4) gives a high level description of KPI Options.
- This [doc](https://docs.umaproject.org/community/KPI-options) will help get you kicked off on your own KPI Options experiment!








