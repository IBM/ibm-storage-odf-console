import * as React from 'react';
import * as _ from 'lodash';
import { Helmet } from "react-helmet";
import { HorizontalNav, PageHeading } from "@console/dynamic-plugin-sdk/api";
import { Grid, GridItem, gridSpans } from "@patternfly/react-core";

//import InventoryCard from './components/dashboard-page/storage-dashboard-odf/inventory-card';
import DetailsCard from './components/dashboard-page/storage-dashboard-odf/details-card/details-card';
import StatusCard from './components/dashboard-page/storage-dashboard-odf/status-card/status-card';
//import StorageEfficiencyCard from './components/dashboard-page/storage-dashboard-odf/storage-efficiency-card/storage-efficiency-card';
//import UtilizationCard from './components/dashboard-page/storage-dashboard-odf/utilization-card/utilization-card';
//import RawCapacityCard from './components/dashboard-page/storage-dashboard-odf/raw-capacity-card/raw-capacity-card';
//import CapacityBreakdownCard from './components/dashboard-page/storage-dashboard-odf/capacity-breakdown/capacity-breakdown-card';
//import ActivityCard from './components/dashboard-page/storage-dashboard-odf/activity-card/activity-card';
//import {StorageInstanceModel} from './models';
//import {StorageInstanceKind} from './types';
//import {StorageInstanceStatus} from './types';

const lefCardWidth = 3;
const mainCardWidth = 6;
const rightCardWidth = 3;
const mainCardOffset = lefCardWidth;
const rightCardOffset = (mainCardOffset + mainCardWidth) as gridSpans;

const UpperSection: React.FC = (props) => {
  return (
    <Grid hasGutter>
      <GridItem span={lefCardWidth}>
        <DetailsCard {...props}/>
      </GridItem>
      <GridItem span={mainCardWidth} offset={mainCardOffset}>
        <StatusCard {...props}/>
      </GridItem>
      <GridItem span={rightCardWidth} offset={rightCardOffset}>
        <StatusCard {...props}/>
      </GridItem>
    </Grid>
  );
};

const ODFDashboard: React.FC = (props) => {
  return (
    <>
      <div className="co-dashboard-body">
        <UpperSection {...props}/>
      </div>
    </>
  );
};

const ODFDashboardPage: React.FC<any> = (props) => {
  const title = "IBM FlashSystem";
  const allPages = [
    {
      href: "",
      name: "Overview",
      component: ODFDashboard,
    },
  ];
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PageHeading title={title} detail={true} />
      <HorizontalNav match={props?.match} pages={allPages} noStatusBox />
    </>
  );
};

export default ODFDashboardPage;


