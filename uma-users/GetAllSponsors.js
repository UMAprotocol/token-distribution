/**
 *  @notice For every EMP ever created in the hardcoded list of EMP factories, return all sponsors who ever created a position.
 *
 */

const { getAbi, getAddress, getTruffleContract } = require("@uma/core");
const Web3 = require("web3");

const EMP_FACTORY_ADDRESSES = [
    "0x9a077d4fcf7b26a0514baa4cff0b481e9c35ce87",
    "0xad8fd1f418fb860a383c9d4647880af7f043ef39",
    "0xb3de1e212b49e68f4a68b5993f31f63946fca2a6",
    "0xddfc7e3b4531158acf4c7a5d2c3cb0ee81d018a5",
    "0xdebb91ab3e473025bb8ce278c02361a3c4f13124"
  ];

async function getAllSponsors(url){
  const web3 = new Web3(url);

  // All unique sponsors across all EMP's
  const UNIQUE_SPONSOR_LIST = {};
  // Unique sponsors mapped to EMP's
  const UNIQUE_EMP_LIST = {};

  for (let i = 0; i < EMP_FACTORY_ADDRESSES.length; i++) {
    const ExpiringMultiPartyCreator = getTruffleContract("ExpiringMultiPartyCreator", web3);

    const empFactory = await ExpiringMultiPartyCreator.at(EMP_FACTORY_ADDRESSES[i]);

    // Fetch all created EMP's from EMP factory events:
    const createdEMPEvents = await empFactory.getPastEvents("CreatedExpiringMultiParty", { fromBlock: 0, toBlock: 11830000});

    for (let creationEvent of createdEMPEvents) {

      const ExpiringMultiParty = getTruffleContract("ExpiringMultiParty", web3);

      const emp = await ExpiringMultiParty.at(creationEvent.args.expiringMultiPartyAddress);
      UNIQUE_EMP_LIST[emp.address] = {};

      // Fetch all NewSponsor events from the EMP
      const newSponsorEvents = await emp.getPastEvents("NewSponsor", { fromBlock: 0, toBlock: 11830000});

      for (let newSponsorEvent of newSponsorEvents) {
        const sponsor = newSponsorEvent.args.sponsor.toLowerCase();

        // Add to dictionary.
        UNIQUE_SPONSOR_LIST[sponsor] = true;
        UNIQUE_EMP_LIST[emp.address][sponsor] = true;
      }
    }
  }
  const sponsorAddresses = Object.keys(UNIQUE_SPONSOR_LIST);

  const countSponsors = Object.keys(UNIQUE_SPONSOR_LIST).length;
  const countEmps = Object.keys(UNIQUE_EMP_LIST).length;

  console.log(`There have been ${countSponsors} unique sponsors created across ${countEmps} EMP's`);

  return Object.keys(UNIQUE_SPONSOR_LIST);

  console.log("Successful json output");
}

module.exports = {
  getAllSponsors
};