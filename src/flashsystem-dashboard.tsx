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
import { HorizontalNav } from "@openshift-console/dynamic-plugin-sdk";
import { Grid, GridItem } from "@patternfly/react-core";
import { useLocation, match as Match } from "react-router-dom";

import StorageEfficiencyCard from "./components/storage-efficiency-card/storage-efficiency-card";
import StatusCard from "./components/status-card/status-card";
import DetailsCard from "./components/details-card/details-card";
import InventoryCard from "./components/inventory-card/inventory-card";
import ActivityCard from "./components/activity-card/activity-card";
import RawCapacityCard from "./components/raw-capacity-card/raw-capacity-card";
import UtilizationCard from "./components/utilization-card/utilization-card";
import BreakdownCard from "./components/capacity-breakdown/capacity-breakdown-card";
import PageHeading from "./components/heading/page-heading";

export type ODFDashboardProps = {
  match: RouteComponentProps["match"];
};

const UpperSection: React.FC<any> = (props) => {
  return (
    <Grid hasGutter>
      <GridItem span={3}>
        <Grid hasGutter>
          <GridItem>
            <DetailsCard {...props} />
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
            <StatusCard {...props} />
          </GridItem>
          <GridItem>
            <RawCapacityCard {...props} />
          </GridItem>
          <GridItem>
            <BreakdownCard {...props} />
          </GridItem>
          <GridItem>
            <UtilizationCard {...props} />
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem span={3}>
        <Grid hasGutter>
          <GridItem>
            <ActivityCard {...props} />
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
        <UpperSection {...props} />
      </div>
    </>
  );
};

export const FlashsystemDashboardPage: React.FC<FlashsystemDashboardPageProps> =
  (props) => {
    const location = useLocation();

    React.useEffect(() => {
      if (!location.pathname.endsWith("overview")) {
        props.history.push(`${location.pathname}/overview`);
      }
    }, [props.history, location.pathname]);

    const { t } = useTranslation("plugin__ibm-storage-odf-plugin");
    const allPages = [
      {
        href: "overview",
        name: t("Overview"),
        component: FlashsystemDashboard,
      },
    ];

    const systemName = props.match.params.systemName;
    const breadcrumbs = [
      {
        name: t("StorageSystems"),
        path: "/odf/systems",
      },
      {
        name: t("StorageSystem details"),
        path: "",
      },
    ];

    return (
      <>
        <PageHeading title={systemName} breadcrumbs={breadcrumbs} />
        <HorizontalNav pages={allPages} {...props} />
      </>
    );
  };

type FlashsystemDashboardPageProps = RouteComponentProps & {
  match: Match<{ systemName: string }>;
};

export default FlashsystemDashboardPage;
