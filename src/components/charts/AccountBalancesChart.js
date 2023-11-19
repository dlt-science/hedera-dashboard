import React, { useState, useEffect } from "react";
import axios from "axios";
import numeral from "numeral";
import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

Chart.register(BarElement, CategoryScale, LinearScale);

const BarChart = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  const [chartData, setChartData] = useState([]);

  const fetchTopAccounts = () => {
    axios
      .get(
        "https://mainnet-public.mirrornode.hedera.com/api/v1/balances?account.balance=gt:50000000000000000",
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        const topAccounts = response.data.balances
          .sort((a, b) => b.balance - a.balance)
          .slice(0, 10)
          .map((account) => ({
            account: account.account,
            balance: account.balance / 100000000, // Convert from tinybars to HBAR
          }));
        setChartData(topAccounts);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchTopAccounts();
  }, []);

  const data = {
    labels: chartData.map((account) => account.account),
    datasets: [
      {
        data: chartData.map((account) => account.balance),
        label: "Top 10 Accounts by Balance",
        backgroundColor: [
          // Define your color scheme here
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
        color: theme.palette.text.primary,
        anchor: "end",
        align: "top",
        formatter: (value) => numeral(value).format("0,0") + " HBAR",
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.primary,
          maxRotation: 45,
          minRotation: 45,
        },
        title: {
          display: true,
          text: "Account IDs",
          color: theme.palette.text.primary,
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.primary,
          callback: (value) => numeral(value).format("0,0") + " HBAR",
        },
        title: {
          display: true,
          text: "Balance",
          color: theme.palette.text.primary,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader
        title="Top 10 Accounts by Balance"
        subheader="Measured by Balance in HBAR"
      />
      <Divider />
      <CardContent>
        <Box sx={{ height: 400, position: "relative" }}>
          <Bar data={data} options={options} plugins={[ChartDataLabels]} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default BarChart;
