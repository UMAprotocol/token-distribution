function createTokenBalanceQuery(tokenAddress) {
    const query = `
    CREATE TEMP TABLE synth_token_holders (
        address string,
        synth_balance NUMERIC
    );
    
    INSERT INTO synth_token_holders (
            WITH
                sends AS (
                    SELECT from_address as address,
                           CAST(value AS NUMERIC) * -1 AS synth_delta
                    FROM \`bigquery-public-data.crypto_ethereum.token_transfers\`
                    WHERE (
                        token_address = "${tokenAddress}"
                        AND block_timestamp < TIMESTAMP('2021-02-10 05:00:49', 'UTC')
                    )
                ),
                receives AS (
                    SELECT to_address as address,
                           CAST(value AS NUMERIC) AS synth_delta
                    FROM \`bigquery-public-data.crypto_ethereum.token_transfers\`
                    WHERE (
                        token_address = "${tokenAddress}"
                        AND block_timestamp < TIMESTAMP('2021-02-10 05:00:49', 'UTC')
                    )
                ),
                combined AS (
                    SELECT address, synth_delta FROM sends
                    UNION ALL
                    SELECT address, synth_delta FROM receives
                )
                SELECT address,
                       (SUM(synth_delta) / 1e18) AS synth_balance
                FROM
                    combined
                GROUP BY address
                HAVING synth_balance >= 10
        );
    
        SELECT * 
        FROM synth_token_holders
        ORDER BY synth_balance DESC
    `;
  
    return query;
  }
  
  module.exports = {
    createTokenBalanceQuery
  };