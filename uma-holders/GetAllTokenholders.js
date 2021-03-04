const {BigQuery} = require('@google-cloud/bigquery');
const highland = require('highland');
const fs = require('fs');

const { createTokenBalanceQuery } = require("./TokenBalanceQuery.js");

const UMA_TOKEN_ADDRESS = "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828";

const client = new BigQuery();

async function submitQuery(query){
  
    // returns a node read stream
    const stream = await client.createQueryStream({query})
    // highland wraps a stream and adds utilities simlar to lodash
    // https://caolan.github.io/highland/
    return highland(stream)
      
      // from here you can map or reduce or whatever you need for down stream processing
      // we are just going to "collect" stream into an array for display
      .collect()
      // emit the stream as a promise when the stream ends
      // this is the start of a data pipeline so you can imagine 
      // this could also "pipe" into some other processing pipeline or write to a file
      .toPromise(Promise)
}

// Runs a series of BQ queries to get all UMA holders or LPers on 2021-02-10 12:00:00 UTC
async function getAllTokenholders() {
    let umaHolders = {};

    // Parameterize BQ query with synth address and minSynthBalance
    let query = createTokenBalanceQuery(UMA_TOKEN_ADDRESS.toLowerCase());

    // Submit BQ query
    let umaHolderResults = await submitQuery(query);

    // Loop through results from BQ and add to a map. Removes dedupes.
    umaHolderResults.forEach(holder => {
        holder = holder.address.toLowerCase();
        umaHolders[holder] = 60;
    })
    
    // Convert synthHolders to JSON format
    umaHolders = JSON.stringify(umaHolders, null, 2);

    // Write combined and deduped list of synth holders to a json
    fs.writeFileSync('./outputs/uma_holder_recipients.json', umaHolders);
    console.log("Successfully gathered addresses for UMA holders with more than 10 UMA at block #11830000");
}

module.exports = {
    getAllTokenholders
};