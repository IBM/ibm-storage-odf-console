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
import {
  Grid,
  GridItem,
} from "@patternfly/react-core";
import { 
  DashboardCard,
  DashboardCardHeader,
  DashboardCardTitle,
  DashboardCardBody,
  PrometheusUtilizationItem,
  // UtilizationBody,
 } from "@console/dynamic-plugin-sdk/provisional";
 import {
  StorageDashboardQuery,  
  UTILIZATION_QUERY_ODF,
} from '../../constants/queries';
import {
  humanizeNumber,
  humanizeSeconds,
  secondsToNanoSeconds,
  humanizeBinaryBytes,
  humanizeDecimalBytesPerSec,
} from "../../humanize";
const humanizeIOPS = (value) => {
  const humanizedNumber = humanizeNumber(value);
  const unit = 'IOPS';
  return {
    ...humanizedNumber,
    string: `${humanizedNumber.value} ${humanizedNumber.unit}`,
    unit,
  };
};
const humanizeLatency = (value) => {
  const humanizedTime = humanizeSeconds(secondsToNanoSeconds(value), null, 'ms');
  return humanizedTime;
};
const UtilizationCard: React.FC = () => {
  const { t } = useTranslation();
  return (
    <DashboardCard gradient>
    <DashboardCardHeader>
      <DashboardCardTitle>{t('Utilization')}</DashboardCardTitle>
      {/* <Dropdown items={Duration(t)} onChange={setDuratsion} selectedKey={duration} title={duration} /> */}
    </DashboardCardHeader>
    <DashboardCardBody>
      <Grid>
        <GridItem span={12}>
          <PrometheusUtilizationItem
            title={t("Capacity")}
            utilizationQuery={UTILIZATION_QUERY_ODF[StorageDashboardQuery.UTILIZATION_CAPACITY_QUERY]}
            duration="1 hour"
            humanizeValue={humanizeBinaryBytes}
          />
        </GridItem>
        <GridItem span={12}>
          <PrometheusUtilizationItem
            title={t("IOPS")}
            utilizationQuery={UTILIZATION_QUERY_ODF[StorageDashboardQuery.UTILIZATION_IOPS_QUERY]}
            duration="1 hour"
            humanizeValue={humanizeIOPS}
          />
        </GridItem>
        <GridItem span={12}>
          <PrometheusUtilizationItem
            title={t("Latency")}
            utilizationQuery={UTILIZATION_QUERY_ODF[StorageDashboardQuery.UTILIZATION_LATENCY_QUERY]}
            duration="1 hour"
            humanizeValue={humanizeLatency}
          />
        </GridItem>
        <GridItem span={12}>
          <PrometheusUtilizationItem
            title={t("Throughput")}
            utilizationQuery={UTILIZATION_QUERY_ODF[StorageDashboardQuery.UTILIZATION_THROUGHPUT_QUERY]}
            duration="1 hour"
            humanizeValue={humanizeDecimalBytesPerSec}
          />
        </GridItem>    
      </Grid>
    </DashboardCardBody>
  </DashboardCard>
  )
};
export default UtilizationCard
