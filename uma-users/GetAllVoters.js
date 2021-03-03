/**
 * @notice For all UMA Voting Contracts, return all voters who ever revealed a vote.
 *
 * Example: `node uma-users/GetAllVoters.js --url "INFURA_URL"`
 */
const { getAbi } = require("@uma/core");
const Web3 = require("web3");
const fs = require('fs');

const argv = require("minimist")(process.argv.slice(), {
    string: ["url"]
  });

  const VOTING_CONTRACT_ADDRESSES = [
    { address: "0x1d847fb6e04437151736a53f09b6e49713a52aad", version: "latest" },
    { address: "0x9921810C710E7c3f7A7C6831e30929f19537a545", version: "1.2.2" },
    { address: "0xfe3c4f1ec9f5df918d42ef7ed3fba81cc0086c5f", version: "1.2.2" },
    { address: "0x8B1631ab830d11531aE83725fDa4D86012eCCd77", version: "1.2.2" }
  ];

async function getAllVoters() {
  const web3 = new Web3(argv.url);

  // All unique voters across all Voting Contracts
  const UNIQUE_VOTER_LIST = {};

  for (const { address, version } of VOTING_CONTRACT_ADDRESSES) {

    const voting = new web3.eth.Contract(
      getAbi("Voting", version),
      address
    );

    // Fetch all vote reveal events from Voting Contracts
    // This line is breaking and only working for the most recent voting contract. 
    const voteRevealEvents = await voting.getPastEvents("VoteRevealed", { fromBlock: 0});

    for (let voteRevealEvent of voteRevealEvents) {

      const voter = voteRevealEvent.returnValues.voter;

      // Add to dictionary.
      UNIQUE_VOTER_LIST[voter] = 120;
    }
  }

  const countVoters = Object.keys(UNIQUE_VOTER_LIST).length;

  console.log(`There have been ${countVoters} unique voters`);

  fs.writeFileSync('./outputs/uma_voters.json', JSON.stringify(UNIQUE_VOTER_LIST, null, 2));
  console.log("success");

  // Uncomment below to print out the lists:
  console.log(UNIQUE_VOTER_LIST);
}

getAllVoters().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});