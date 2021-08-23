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
import * as _ from "lodash";
import { useTranslation } from "react-i18next";
import { Select, SelectProps } from "@patternfly/react-core";
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
  usePrometheusPoll,
} from "@openshift-console/dynamic-plugin-sdk/internalAPI";
import { BreakdownCardBody } from "../breakdown-card/breakdown-body";
import {
  getStackChartStats,
  sortInstantVectorStats,
} from "../breakdown-card/utils";
import { getSelectOptions } from "../breakdown-card/breakdown-dropdown";
import "./capacity-breakdown-card.scss";
import { humanizeBinaryBytes } from "../../humanize";
import { BreakdownQueryMapODF } from "../../constants/queries";
import { PROJECTS, STORAGE_CLASSES, PODS } from "../../constants/index";
import { getInstantVectorStats } from "../../selectors/promethues-utils";
import { parseProps } from "../../selectors/index";

const dropdownKeys = [PROJECTS, STORAGE_CLASSES, PODS];
const breakdownSelectItems = getSelectOptions(dropdownKeys);

const BreakdownCard: React.FC<any> = (props) => {
  const { t } = useTranslation();
  const { name } = parseProps(props);

  const [metricType, setMetricType] = React.useState(PROJECTS);
  const [isOpenBreakdownSelect, setBreakdownSelect] = React.useState(false);
  const { model, metric, queries } = BreakdownQueryMapODF(name, metricType);
  const queryKeys = Object.keys(queries);

  const [byUsedmetric, byUsedLoadError, byUsedLoading] = usePrometheusPoll({
    query: queries[queryKeys[0]],
    endpoint: "api/v1/query" as any,
  });

  const [totalUsedmetric, totalUsedLoadError, totalUsedLoading] =
    usePrometheusPoll({
      query: queries[queryKeys[1]],
      endpoint: "api/v1/query" as any,
    });
  const metricTotal = _.get(totalUsedmetric, "data.result[0].value[1]");

  const [usedmetric, usedLoadError, usedLoading] = usePrometheusPoll({
    query: queries[queryKeys[2]],
    endpoint: "api/v1/query" as any,
  });
  const flashsystemUsed = _.get(usedmetric, "data.result[0].value[1]");

  const humanize = humanizeBinaryBytes;
  const top6MetricsData = getInstantVectorStats(byUsedmetric, metric);
  const top5SortedMetricsData = sortInstantVectorStats(top6MetricsData);
  const top5MetricsStats = getStackChartStats(top5SortedMetricsData, humanize);

  const handleMetricsChange: SelectProps["onSelect"] = (_e, breakdown) => {
    setMetricType(breakdown as string);
    setBreakdownSelect(!isOpenBreakdownSelect);
  };

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>
          {t("plugin__ibm-storage-odf-plugin~Provisioned Capacity Breakdown")}
        </DashboardCardTitle>
        <div className="flashsystem-capacity-breakdown-card__header">
          <Select
            className="flashsystem-capacity-breakdown-card-header__dropdown"
            autoFocus={false}
            onSelect={handleMetricsChange}
            onToggle={() => setBreakdownSelect(!isOpenBreakdownSelect)}
            isOpen={isOpenBreakdownSelect}
            selections={[metricType]}
            placeholderText={metricType}
            aria-label="Break By Dropdown"
            isCheckboxSelectionBadgeHidden
          >
            {breakdownSelectItems}
          </Select>
        </div>
      </DashboardCardHeader>
      <DashboardCardBody className="flashsystem-capacity-breakdown-card__body">
        <BreakdownCardBody
          isLoading={byUsedLoading || totalUsedLoading || usedLoading}
          hasLoadError={byUsedLoadError || totalUsedLoadError || usedLoadError}
          metricTotal={metricTotal}
          top5MetricsStats={top5MetricsStats}
          //capacityAvailable={flashsystemAvailable}
          capacityUsed={flashsystemUsed}
          metricModel={model}
          humanize={humanize}
        />
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default BreakdownCard;
