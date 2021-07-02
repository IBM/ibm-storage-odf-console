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
import { Select, SelectProps } from '@patternfly/react-core';
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
} from '@console/dynamic-plugin-sdk/provisional';
import { useDashboardPrometheusQuery as usePrometheusQuery } from "@console/dynamic-plugin-sdk/provisional";
import {
  useK8sWatchResource,
} from "@console/dynamic-plugin-sdk/api";
import { getInstantVectorStats } from '@console/internal/components/graphs/utils';
import { BreakdownCardBody } from '../breakdown-card/breakdown-body';
import { getStackChartStats, sortInstantVectorStats } from '../breakdown-card/utils';
import { getSelectOptions } from '../breakdown-card/breakdown-dropdown';
import './capacity-breakdown-card.scss';
import { humanizeBinaryBytes } from '../../humanize';
import './activity-card.scss';
import {GetFlashSystemResource} from '../../constants/resources';
import { BreakdownQueryMapODF } from '../../constants/queries';
import { PROJECTS } from '../../constants/index';
import { StorageInstanceKind } from '../../types';

const keys = Object.keys(BreakdownQueryMapODF);
const breakdownSelectItems = getSelectOptions(keys);

const BreakdownCard: React.FC<any> = (props) => {
  const [data, loaded, loadError] = useK8sWatchResource<StorageInstanceKind>(GetFlashSystemResource(props?.match?.params?.name, props?.match?.params?.namespace));
  const name= loaded && !loadError? data?.[0]?.metadata.name: '';
  
  const [metricType, setMetricType] = React.useState(PROJECTS);
  const [isOpenBreakdownSelect, setBreakdownSelect] = React.useState(false);
  const { model, metric, queries } = BreakdownQueryMapODF(name, metricType);
  //const queryKeys = Object.keys(queries);
  
  const [byUsed, ,] = usePrometheusQuery(
    queries[0],
    humanizeBinaryBytes
  );
  const [totalUsed, ,] = usePrometheusQuery(
    queries[1],
    humanizeBinaryBytes
  );
  const [used, ,] = usePrometheusQuery(
    queries[2],
    humanizeBinaryBytes
  );

  //const results = queryKeys.map((key) => prometheusResults.getIn([queries[key], 'data']));

  const humanize = humanizeBinaryBytes;
  const top6MetricsData = getInstantVectorStats(byUsed, metric);
  const top5SortedMetricsData = sortInstantVectorStats(top6MetricsData);
  const top5MetricsStats = getStackChartStats(top5SortedMetricsData, humanize);
  const metricTotal = totalUsed.string;
  const flashsystemUsed = used.string;

  const handleMetricsChange: SelectProps['onSelect'] = (_e, breakdown) => {
    setMetricType(breakdown as string);
    setBreakdownSelect(!isOpenBreakdownSelect);
  };

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Provisioned Capacity Breakdown</DashboardCardTitle>
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
          isLoading={!loaded}
          hasLoadError={loadError}
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
