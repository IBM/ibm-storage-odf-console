/**
 * Copyright contributors to the ibm-storage-odf-console project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as React from 'react';
import * as _ from 'lodash';
import { RouteComponentProps } from "react-router";
import { HorizontalNav } from "@console/dynamic-plugin-sdk/internalAPI";
import { Grid, GridItem } from "@patternfly/react-core";

import StorageEfficiencyCard from './components/storage-efficiency-card/storage-efficiency-card';
import StatusCard from './components/status-card/status-card';
import DetailsCard from './components/details-card/details-card';
import InventoryCard from './components/inventory-card/inventory-card';
import ActivityCard from './components/activity-card/activity-card';
import RawCapacityCard from './components/raw-capacity-card/raw-capacity-card';
import UtilizationCard from './components/utilization-card/utilization-card';
import BreakdownCard from './components/capacity-breakdown/capacity-breakdown-card';

export type ODFDashboardProps = {
  match: RouteComponentProps["match"];
};

const UpperSection: React.FC = (props) => {
return (
  <Grid hasGutter>
    <GridItem span={3}>
      <Grid hasGutter>
        <GridItem>
          <DetailsCard/>
        </GridItem>
        <GridItem>
          <StorageEfficiencyCard/>
        </GridItem>          
        <GridItem>
          <InventoryCard/>
        </GridItem>
      </Grid>
    </GridItem>
    <GridItem span={6}>
      <Grid hasGutter>
        <GridItem>
          <StatusCard {...props}/>
        </GridItem>
        <GridItem>
          <RawCapacityCard {...props}/>
        </GridItem>
        <GridItem>
          <BreakdownCard {...props}/>
        </GridItem>
        <GridItem>
          <UtilizationCard {...props}/>
        </GridItem>
      </Grid>         
    </GridItem>
    <GridItem span={3} >
      <Grid hasGutter>
        <GridItem>
          <ActivityCard/>
        </GridItem>
      </Grid>
    </GridItem>
  </Grid>
);
};

const FlashsystemDashboard: React.FC<ODFDashboardProps> = (props) => {
  return (
    <>
      <div className="co-dashboard-body">
        <UpperSection {...props}/>
      </div>
    </>
  );
};

const FlashsystemDashboardPage: React.FC<ODFDashboardProps> = ({ match }) => {
  const allPages = [
    {
      href: "",
      name: "Overview",
      component: FlashsystemDashboard,
    },
  ];
  return (
    <>
      <HorizontalNav match={match} pages={allPages} noStatusBox />
    </>
  );
};

export default FlashsystemDashboardPage;
