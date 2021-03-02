/**
 * @notice Gather the addresses of all governance participants from YAM, Sushi, BadgerDAO, Yearn and Maker
 * 
 * @dev Prequisites: before running, you will need to set a GOOGLE_APPLICATIONS_CREDENTIALS environment variable for a service account.
 * @dev This service account will need GCP admin or BigQuery permissions. This guide provides further instructions: https://cloud.google.com/docs/authentication/getting-started
 * 
 * Example: `node collectAddresses.js`
 */

const { getGovernanceParticipants } = require("./governance/GetGovernanceParticipants.js");
const { getAllTokenholders } = require("./uma-holders/GetAllTokenholders.js");

async function collectAddresses(){
    await getGovernanceParticipants();
    await getAllTokenholders();
}

collectAddresses();