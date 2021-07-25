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
import { Grid, GridItem } from "@patternfly/react-core";
import { Humanize } from "./utils";
import { K8sKind } from "../../types";
import { addAvailable, StackDataPoint, getLegends } from "./utils";
import { BreakdownChart, LabelPadding } from "./breakdown-chart";
import { BreakdownChartLoading } from "./breakdown-loading";
import { TotalCapacityBody } from "./breakdown-capacity";

export const BreakdownCardBody: React.FC<BreakdownBodyProps> = ({
  top5MetricsStats,
  metricTotal,
  capacityUsed,
  capacityAvailable,
  metricModel,
  humanize,
  isLoading,
  hasLoadError,
  ocsVersion = "",
  labelPadding,
}) => {
  if (isLoading && !hasLoadError) {
    return <BreakdownChartLoading />;
  }
  if (!capacityUsed || !top5MetricsStats.length || hasLoadError) {
    return <div className="text-secondary">Not available</div>;
  }
  if (capacityUsed === "0") {
    return <div className="text-secondary">Not enough usage data</div>;
  }

  const usedCapacity = `${humanize(capacityUsed).string} used`;
  const availableCapacity = `${humanize(capacityAvailable).string} available`;

  const chartData = addAvailable(
    top5MetricsStats,
    capacityAvailable,
    metricTotal,
    humanize
  );

  const legends = getLegends(chartData);

  // Removes Legend for available
  if (capacityAvailable) {
    legends.pop();
  }

  return (
    <Grid>
      <GridItem span={4}>
        <TotalCapacityBody value={usedCapacity} />
      </GridItem>
      <GridItem span={4} />
      <GridItem span={4}>
        {capacityAvailable && (
          <TotalCapacityBody
            value={availableCapacity}
            className="capacity-breakdown-card__available-body text-secondary"
          />
        )}
      </GridItem>
      <GridItem span={12}>
        <BreakdownChart
          data={chartData}
          legends={legends}
          metricModel={metricModel}
          ocsVersion={ocsVersion}
          labelPadding={labelPadding}
        />
      </GridItem>
    </Grid>
  );
};

export type BreakdownBodyProps = {
  isLoading: boolean;
  hasLoadError: boolean;
  metricTotal: string;
  top5MetricsStats: StackDataPoint[];
  capacityUsed: string;
  capacityAvailable?: string;
  metricModel: K8sKind;
  humanize: Humanize;
  ocsVersion?: string;
  labelPadding?: LabelPadding;
};
