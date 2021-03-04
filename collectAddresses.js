/**
 * @notice Gathers the addresses of all snapshot governance participants from Balancer, YAM, Sushi, BadgerDAO and Yearn before timestamp 1612976449
 * @notice Also gathers the addresses all UMA tokenholders with >= 10 UMA at timestamp 1612976449.
 * @notice Finally gathers the addresses of all UMA voters and synthetic sponsors who participated in either action before block 11830000.
 * 
 * @dev Prequisites: before running, you will need to set a GOOGLE_APPLICATIONS_CREDENTIALS environment variable for a service account.
 * @dev This service account will need GCP admin or BigQuery permissions. This guide provides further instructions: https://cloud.google.com/docs/authentication/getting-started
 * 
 * Example: `node collectAddresses.js --url "INFURA_NODE_URL"`
 */

const { getGovernanceParticipants } = require("./governance/GetGovernanceParticipants.js");
const { getAllTokenholders } = require("./uma-holders/GetAllTokenholders.js");
const { getAllVoters } = require("./uma-users/GetAllVoters.js");
const { getAllSponsors } = require("./uma-users/GetAllSponsors.js");

const fs = require('fs');

const argv = require("minimist")(process.argv.slice(), {
    string: ["url"]
  });

async function collectAddresses(){

    console.log("Running airdrop queries");

    let SPONSORS_AND_VOTERS = {};

    await getGovernanceParticipants();
    await getAllTokenholders();

    const sponsors = await getAllSponsors(argv.url);

    sponsors.forEach((sponsor) => { 
        SPONSORS_AND_VOTERS[sponsor] = 120;
    });

    const voters = await getAllVoters(argv.url);

    voters.forEach((voter) => { 
        SPONSORS_AND_VOTERS[voter] = 120;
    });

    const countUmaUsers = Object.keys(SPONSORS_AND_VOTERS).length;

    console.log(`There have been ${countUmaUsers} UMA users who voted or minted a synthetic before block #11830000`);

    fs.writeFileSync('./outputs/uma_user_recipients.json', JSON.stringify(SPONSORS_AND_VOTERS, null, 2));

    console.log("Airdrop recipients added to outputs");

}

collectAddresses();