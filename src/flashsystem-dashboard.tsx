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
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { useTranslation } from "react-i18next";
import { HorizontalNav } from "@openshift-console/dynamic-plugin-sdk/api";
import { Grid, GridItem } from "@patternfly/react-core";

import StorageEfficiencyCard from "./components/storage-efficiency-card/storage-efficiency-card";
import StatusCard from "./components/status-card/status-card";
import DetailsCard from "./components/details-card/details-card";
import InventoryCard from "./components/inventory-card/inventory-card";
import ActivityCard from "./components/activity-card/activity-card";
import RawCapacityCard from "./components/raw-capacity-card/raw-capacity-card";
import UtilizationCard from "./components/utilization-card/utilization-card";
import BreakdownCard from "./components/capacity-breakdown/capacity-breakdown-card";

export type ODFDashboardProps = {
  match: RouteComponentProps["match"];
};

const UpperSection: React.FC = () => {
  return (
    <Grid hasGutter>
      <GridItem span={3}>
        <Grid hasGutter>
          <GridItem>
            <DetailsCard />
          </GridItem>
          <GridItem>
            <StorageEfficiencyCard />
          </GridItem>
          <GridItem>
            <InventoryCard />
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem span={6}>
        <Grid hasGutter>
          <GridItem>
            <StatusCard />
          </GridItem>
          <GridItem>
            <RawCapacityCard />
          </GridItem>
          <GridItem>
            <BreakdownCard />
          </GridItem>
          <GridItem>
            <UtilizationCard />
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem span={3}>
        <Grid hasGutter>
          <GridItem>
            <ActivityCard />
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};

const FlashsystemDashboard: React.FC<ODFDashboardProps> = () => {
  return (
    <>
      <div className="co-dashboard-body">
        <UpperSection />
      </div>
    </>
  );
};

const FlashsystemDashboardPage: React.FC<any> = () => {
  const { t } = useTranslation("plugin__ibm-storage-odf-plugin");
  const allPages = [
    {
      href: "",
      name: t("Overview"),
      component: FlashsystemDashboard,
    },
  ];
  return (
    <>
      <HorizontalNav pages={allPages} />
    </>
  );
};

export default FlashsystemDashboardPage;
