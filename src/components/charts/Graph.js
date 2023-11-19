import React, { useState } from "react";
import axios from "axios";
import { ForceGraph2D } from "react-force-graph";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

const AccountTransactionsGraph = () => {
  const theme = useTheme();
  const [accountId, setAccountId] = useState("");
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  const fetchTransactions = (accountId) => {
    axios
      .get(
        `https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/${accountId}?transactionType=cryptotransfer`
      )
      .then((response) => {
        const transactions = response.data.transactions;
        const nodes = new Set();
        const links = [];

        nodes.add(accountId);

        transactions.forEach((transaction) => {
          transaction.transfers.forEach((transfer) => {
            nodes.add(transfer.account);
          });
        });

        transactions.forEach((transaction) => {
          transaction.transfers.forEach((transfer) => {
            if (nodes.has(transfer.account) && nodes.has(accountId)) {
              links.push({
                source: transfer.amount < 0 ? accountId : transfer.account,
                target: transfer.amount < 0 ? transfer.account : accountId,
                amount: Math.abs(transfer.amount / 100000000),
                timestamp: transaction.consensus_timestamp,
              });
            }
          });
        });

        setGraphData({
          nodes: Array.from(nodes).map((node) => ({ id: node })),
          links: links,
        });
      })
      .catch((error) => console.error(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTransactions(accountId);
  };

  return (
    <Card>
      <CardHeader
        title="Account Transactions Graph"
        subheader="Visualize transaction flows between accounts"
      />
      <Divider />
      <CardContent>
        <Box sx={{ marginBottom: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Account ID"
              variant="outlined"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              sx={{ marginRight: 2 }}
            />
            <Button variant="contained" color="primary" type="submit">
              Fetch Transactions
            </Button>
          </form>
        </Box>
        <Box sx={{ height: 400, position: "relative" }}>
          {graphData.nodes.length > 0 && (
            <ForceGraph2D
              graphData={graphData}
              nodeLabel="id"
              linkDirectionalArrowLength={5}
              linkDirectionalArrowRelPos={1}
              nodeAutoColorBy="id"
              linkLabel={(link) =>
                `Amount: ${link.amount}\nTime: ${new Date(
                  link.timestamp * 1000
                ).toLocaleString()}`
              }
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AccountTransactionsGraph;
