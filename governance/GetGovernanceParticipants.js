const { default: axios } = require("axios");
const fs = require("fs");

// This address list was collected from https://beta.mcdgov.info
const MakerAddresses = require("./Maker_Governance.json");

// Edit this URL to query different Snapshot DAOs
const url =
  "https://hub.snapshot.page/api/voters?to=1612976449&spaces=yam.eth,Sushi,badgerdao.eth,yearn";

// Gathers addresses from snapshot URL
async function getGovernanceParticipants() {
  let governanceParticipants = {};

  let snapshotVoters = await axios.get(url);
  snapshotVoters = snapshotVoters.data;

  // Adds snapshot result to voters
  snapshotVoters.forEach((voter) => {
    voter = voter.address.toLowerCase();

    governanceParticipants[voter] = 80;
  });

  MakerAddresses.forEach((voter) => {
    if (voter.Since < "2021-02-10") {
      voter = voter.Address;
      voter = voter.toLowerCase();

      governanceParticipants[voter] = 80;
    }
  });

  governanceParticipants = JSON.stringify(governanceParticipants, null, 2);

  // Writes to a json file in ./outputs
  fs.writeFileSync('./outputs/governance_recipients.json', governanceParticipants);
  console.log("Successfully gathered governance participant addresses for Maker, Yam, Sushi, BadgerDAO and Yearn");
}

module.exports = {
  getGovernanceParticipants
};
