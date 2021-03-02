/**
 * @notice For all UMA Voting Contracts, return all voters who ever revealed a vote.
 *
 * Example: `node uma-users/GetAllVoters.js --url "INFURA_URL"`
 */
const { getAbi, getAddress, getTruffleContract } = require("@uma/core");
const Web3 = require("web3");
const fs = require('fs');

const argv = require("minimist")(process.argv.slice(), {
    string: ["url"]
  });

  const VOTING_CONTRACT_ADDRESSES = [
    "0x1d847fb6e04437151736a53f09b6e49713a52aad",
    "0x9921810C710E7c3f7A7C6831e30929f19537a545",
    "0xfe3c4f1ec9f5df918d42ef7ed3fba81cc0086c5f",
    "0x8B1631ab830d11531aE83725fDa4D86012eCCd77"
  ];

async function getAllVoters(){
    try {

        const web3 = new Web3(argv.url);

        // All unique voters across all Voting Contracts
        const UNIQUE_VOTER_LIST = {};
    
        for (let i = 0; i < VOTING_CONTRACT_ADDRESSES.length; i++) {
          const Voting = getTruffleContract("Voting", web3);

          const voting = await Voting.at(VOTING_CONTRACT_ADDRESSES[i]);
    
          // Fetch all vote reveal events from Voting Contracts
          // This line is breaking and only working for the most recent voting contract. 
          const voteRevealEvents = await voting.getPastEvents("VoteRevealed", { fromBlock: 0});

          for (let voteRevealEvent of voteRevealEvents) {

            const voter = voteRevealEvent.args.voter;
    
              // Add to dictionary.
              UNIQUE_VOTER_LIST[voter] = 120;
          }
        }
        const voterAddresses = Object.keys(UNIQUE_VOTER_LIST);
    
        const countVoters = Object.keys(UNIQUE_VOTER_LIST).length;
 
        console.log(`There have been ${countVoters} unique voters`);
    
        fs.writeFile('./uma_voters.json', JSON.stringify(voterAddresses, null, 2), err => {
          if(err){
              console.log(err);
          } else {
              console.log("success");
          }
      })
    
        // Uncomment below to print out the lists:
        console.log(
            UNIQUE_VOTER_LIST
        )

      } catch (err) {
        console.log(err);
      }
}

getAllVoters();