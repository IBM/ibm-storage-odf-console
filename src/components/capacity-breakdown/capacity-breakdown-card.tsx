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
import { useTranslation } from "react-i18next";
import { Select, SelectProps } from "@patternfly/react-core";
import {useCustomPrometheusPoll} from "../custom-prometheus-poll/custom-prometheus-poll"
import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';

import { BreakdownCardBody } from "../breakdown-card/breakdown-body";
import {
  getStackChartStats,
  sortInstantVectorStats,
} from "../breakdown-card/utils";
import { getSelectOptions } from "../breakdown-card/breakdown-dropdown";
import "./capacity-breakdown-card.scss";
import { humanizeBinaryBytes } from "../../humanize";
import { BreakdownQueryMapODF } from "../../constants/queries";
import { PROJECTS, STORAGE_CLASSES, PODS } from "../../constants/constants";
import { getInstantVectorStats, getSingleValue } from "../../selectors/promethues-utils";
import { parseProps } from "../../selectors";
import {getIBMPoolsConfigMap} from "../../constants/resources";
import {useK8sWatchResource} from "@openshift-console/dynamic-plugin-sdk";
import {ConfigMapKind} from "../../types";
import {getStorageClassNames} from "../utils";

const dropdownKeys = [PROJECTS, STORAGE_CLASSES, PODS];
const breakdownSelectItems = getSelectOptions(dropdownKeys);
let storageclassNames = []


const BreakdownCard: React.FC<any> = (props) => {
  const { t } = useTranslation("plugin__ibm-storage-odf-plugin");
  const { name, namespace} = parseProps(props);

  const [metricType, setMetricType] = React.useState(PROJECTS);
  const [isOpenBreakdownSelect, setBreakdownSelect] = React.useState(false);
  const { model, metric, queries } = BreakdownQueryMapODF(name, metricType);
  const queryKeys = Object.keys(queries);
  const humanize = humanizeBinaryBytes;
  let WarningMessage = '';
  let PVCWarning = false;

  const handleMetricsChange: SelectProps["onSelect"] = (_e, breakdown) => {
    setMetricType(breakdown as string);
    setBreakdownSelect(!isOpenBreakdownSelect);
  };

  const cmResource = getIBMPoolsConfigMap(namespace)
  const [configMap, cmLoaded, cmLoadError] = useK8sWatchResource<ConfigMapKind>(cmResource);

  const cmResourceData = configMap?.data?.[name]
  if (cmResourceData) {
    storageclassNames = getStorageClassNames(cmResourceData)
  }

  const [byUsedmetric, byUsedLoadError, byUsedLoading] = useCustomPrometheusPoll({
    query: queries[queryKeys[0]],
    endpoint: "api/v1/query" as any,
    samples: 60,
  });

  const [totalUsedmetric, totalUsedLoadError, totalUsedLoading] =
      useCustomPrometheusPoll({
      query: queries[queryKeys[1]],
      endpoint: "api/v1/query" as any,
      samples: 60
    });
  const metricTotal = getSingleValue(totalUsedmetric)

  const [usedmetric, usedLoadError, usedLoading] = useCustomPrometheusPoll({
    query: queries[queryKeys[2]],
    endpoint: "api/v1/query" as any,
    samples: 60
  });
  const flashsystemUsed = getSingleValue(usedmetric)

  const top6MetricsData = getInstantVectorStats(byUsedmetric, metric);
  const top5SortedMetricsData = sortInstantVectorStats(top6MetricsData);
  const top5MetricsStats = getStackChartStats(top5SortedMetricsData, humanize);

  const [countPVCsWithoutStorage,  , ] = useCustomPrometheusPoll({
    query: queries[queryKeys[3]],
    endpoint: "api/v1/query" as any,
    samples: 60,
  });
  const PVCsWithoutStorage = getSingleValue(countPVCsWithoutStorage)
  if (PVCsWithoutStorage > 0 ){
    WarningMessage = "* " +  t('Provisioned capacity might be inaccurate as some PVCs are not properly associated with a specific storage system.')
    PVCWarning = true
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("Provisioned Capacity Breakdown")}
        </CardTitle>
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
      </CardHeader>
      <CardBody className="flashsystem-capacity-breakdown-card__body">
        <BreakdownCardBody
            isStorageclassAvailable={storageclassNames.length!=0 && cmLoaded}
            isLoading={byUsedLoading || totalUsedLoading || usedLoading || (!cmLoaded && !cmLoadError)}
            hasLoadError={byUsedLoadError || totalUsedLoadError || usedLoadError || (!cmLoaded && cmLoadError )}
            metricTotal={metricTotal}
            top5MetricsStats={top5MetricsStats}
            //capacityAvailable={flashsystemAvailable}
            capacityUsed={flashsystemUsed}
            metricModel={model}
            humanize={humanize}
        />
        {PVCWarning && <ErrorCardBody errorMessage={WarningMessage}/>}
      </CardBody>
    </Card>
  );
};

export default BreakdownCard;

export type ErrorCardBodyProps = {
  errorMessage: string;
};

const ErrorCardBody: React.FC<ErrorCardBodyProps> = (props) => {
  const { errorMessage } = props
  return (
      <>
        <div className="flashsystem-capacity-breakdown-card__error text-muted">
          {errorMessage}
        </div>
      </>
  );
};