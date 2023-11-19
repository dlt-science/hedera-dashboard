import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Grid,
} from "@mui/material";

const InfoDisplay = () => {
  return (
    <Card>
      <CardHeader
        title="Staking Information"
        subheader="As of 16th November 2023"
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Reward Rate:{" "}
              <Typography variant="body1" component="span" color="primary">
                1.24 %
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Staking Ratio:{" "}
              <Typography variant="body1" component="span" color="primary">
                55.85 %
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Rewards Per Year:{" "}
              <Typography variant="body1" component="span" color="primary">
                $20.5m
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">
              Total Staked:{" "}
              <Typography variant="body1" component="span" color="primary">
                27.9b
              </Typography>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InfoDisplay;
