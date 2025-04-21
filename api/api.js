// api/zora-check.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { wallet } = req.body;

  const query = {
    query: `
      query {
        zoraTokenAllocation(
          identifierWalletAddresses: ["${wallet}"],
          zoraClaimContractEnv: PRODUCTION
        ) {
          totalTokensEarned {
            totalTokens
          }
        }
      }
    `
  };

  try {
    const response = await fetch('https://api.zora.co/universal/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query)
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch from Zora' });
  }
}
