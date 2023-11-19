import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";

import DashboardHeader from "../components/DashboardHeader";
import Price from "../components/stats/Price";
import MarketCap from "../components/stats/MarketCap";
import CircSupply from "../components/stats/CircSupply";
import TotalStaked from "../components/stats/TotalStaked";
import LiveTrxs from "../components/tables/LiveTrxs";
import PriceChart from "../components/charts/PriceChart";
import AccountBalances from "../components/charts/AccountBalancesChart";
import StakingInfo from "../components/charts/StakingInfo";
import Graph from "../components/charts/Graph";
import TVLChart from "../components/charts/TVLChart";
import TotalStakedChart from "../components/charts/TotalStakedChart";
import MarketCapAreaChart from "../components/charts/MarketCapAreaChart";
import Spacer from "../components/Spacer";

const Dashboard = () => {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title>Hedera Dashboard</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: "100%",
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <DashboardHeader />

            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Price />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <MarketCap />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <CircSupply />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <TotalStaked />
            </Grid>

            <Grid item xs={12}>
              <LiveTrxs />
            </Grid>

            <Grid item xs={12}>
              <TVLChart />
            </Grid>

            <Grid item md={6} xs={12}>
              <AccountBalances />
            </Grid>
            <Grid item md={6} xs={12}>
              <PriceChart />
            </Grid>

            <Grid item md={4} xs={12}>
              <StakingInfo />
            </Grid>
            <Grid item md={8} xs={12}>
              <TotalStakedChart />
            </Grid>
            <Grid item xs={12}>
              <MarketCapAreaChart />
            </Grid>
            <Grid item xs={12}>
              <Graph />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Spacer sx={{ pt: 7 }} />
    </>
  );
};

export default Dashboard;
