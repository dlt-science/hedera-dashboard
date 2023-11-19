import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";

import TablePaginationActions from "./TablePaginationActions";

const LiveTrxs = () => {
  const theme = useTheme();

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const fetchAllTransactions = useCallback(async (url) => {
    try {
      const response = await axios.get(url);
      const newTransactions = response.data.transactions;

      if (response.data.links && response.data.links.next) {
        return newTransactions.concat(
          await fetchAllTransactions(response.data.links.next)
        );
      } else {
        return newTransactions;
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }, []);

  const fetchTransactions = useCallback(() => {
    const startTime = Math.floor(Date.now() / 1000) - 300; // Current time minus 300 seconds
    const currentTime = Math.floor(Date.now() / 1000);

    const fetchURL = `https://mainnet-public.mirrornode.hedera.com/api/v1/transactions?transactionType=cryptotransfer&timestamp=gte:${startTime}&timestamp=lt:${currentTime}&order=desc`;

    fetchAllTransactions(fetchURL).then((allTransactions) => {
      setTransactions(allTransactions);
    });
  }, [fetchAllTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleTransactionClick = (transactionId) => {
    const transactionDetailUrl = `https://mainnet-public.mirrornode.hedera.com/api/v1/transactions/${transactionId}`;

    axios
      .get(transactionDetailUrl)
      .then((response) => {
        const transaction = response.data.transactions[0];
        displayTransactionDetails(transaction);
      })
      .catch((error) => {
        console.error("Error fetching transaction details:", error);
      });
  };

  const displayTransactionDetails = (transaction) => {
    const newWindow = window.open("", "Trx Info");

    const transfers = transaction.transfers
      .map((transfer) => {
        const isSender = transfer.amount < 0;
        const role = isSender ? "Sender" : "Receiver";
        const amount = Math.abs(transfer.amount / 100000000);
        return `${role}: ${transfer.account}, Amount: ${amount} ℏ`;
      })
      .join("<br>");

    newWindow.document.write(`
      <p>Type: ${transaction.name}</p>
      <p>Charged Fee: ${transaction.charged_tx_fee / 100000000} ℏ</p>
      <p>Time: ${new Date(
        parseInt(transaction.consensus_timestamp.split(".")[0]) * 1000
      ).toLocaleString()}</p>
      <p>Transfers: <br> ${transfers}</p>
    `);
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.transaction_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Box>
        <Box sx={{ mt: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ maxWidth: 500 }}>
                <TextField
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon fontSize="small" color="action">
                          <SearchIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Search transaction"
                  variant="outlined"
                  onChange={handleChange}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      <Box sx={{ pt: 3 }}>
        <Card>
          <Box sx={{ minWidth: 1050, pb: 3, position: "relative" }}>
            <Box sx={{ position: "absolute", top: "15px", right: "15px" }}>
              <IconButton onClick={fetchTransactions}>
                <RefreshIcon />
              </IconButton>
            </Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Fee</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredTransactions.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredTransactions
                ).map((transaction) => (
                  <TableRow hover key={transaction.transaction_id}>
                    <TableCell
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleTransactionClick(transaction.transaction_id)
                      }
                    >
                      {transaction.transaction_id}
                    </TableCell>
                    <TableCell>
                      {transaction.charged_tx_fee / 100000000} ℏ
                    </TableCell>
                    <TableCell>
                      {new Date(
                        parseInt(
                          transaction.consensus_timestamp.split(".")[0]
                        ) * 1000
                      ).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[]}
              colSpan={3}
              count={filteredTransactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              ActionsComponent={TablePaginationActions}
              sx={{ display: "flex", justifyContent: "center" }}
            />
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default LiveTrxs;
