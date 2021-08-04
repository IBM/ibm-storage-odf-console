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
  DashboardCard,
  DashboardCardHeader,
  DashboardCardTitle,
  usePrometheusPoll,
  UtilizationBody,
  UtilizationItem,
  UtilizationDurationDropdown,
  useUtilizationDuration,
  //MultilineUtilizationItem // we need this to be exposed
} from "@console/dynamic-plugin-sdk/internalAPI";
import {
  StorageDashboardQuery,
  FlASHSYSTEM_QUERIES,
} from "../../constants/queries";
import {
  humanizeBinaryBytes,
  humanizeDecimalBytesPerSec,
} from "../../humanize";
import { humanizeIOPS, humanizeLatency, ByteDataTypes } from "./utils";
import { parseProps } from "../../selectors/index";

const UtilizationCard: React.FC<any> = (props) => {
  const { t } = useTranslation();
  const { name } = parseProps(props);
  const { duration } = useUtilizationDuration();

  const [usedCapacitymetric] = usePrometheusPoll({
    query: FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalUsedCapacity),
    endpoint: "api/v1/query_range" as any,
    timespan: duration,
  });
  const [readIOPSmetric] = usePrometheusPoll({
    query: FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalReadIOPS),
    endpoint: "api/v1/query_range" as any,
    timespan: duration,
  });
  const [readRespTimemetric] = usePrometheusPoll({
    query: FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalReadRespTime),
    endpoint: "api/v1/query_range" as any,
    timespan: duration,
  });
  const [readBWmetric] = usePrometheusPoll({
    query: FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalReadBW),
    endpoint: "api/v1/query_range" as any,
    timespan: duration,
  });

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>
          {t("plugin__ibm-storage-odf-plugin~Utilization")}
        </DashboardCardTitle>
        <UtilizationDurationDropdown />
      </DashboardCardHeader>
      <UtilizationBody>
        <UtilizationItem
          title={t("plugin__ibm-storage-odf-plugin~Capacity")}
          isLoading={false}
          error={false}
          utilization={usedCapacitymetric}
          humanizeValue={humanizeBinaryBytes}
          byteDataType={ByteDataTypes.BinaryBytes}
          query={FlASHSYSTEM_QUERIES(
            name,
            StorageDashboardQuery.TotalUsedCapacity
          )}
        />
        <UtilizationItem
          title={t("plugin__ibm-storage-odf-plugin~IOPS")}
          isLoading={false}
          error={false}
          utilization={readIOPSmetric}
          humanizeValue={humanizeIOPS}
          query={FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalReadIOPS)}
        />
        <UtilizationItem
          title={t("plugin__ibm-storage-odf-plugin~Latency")}
          isLoading={false}
          error={false}
          utilization={readRespTimemetric}
          humanizeValue={humanizeLatency}
          query={FlASHSYSTEM_QUERIES(
            name,
            StorageDashboardQuery.TotalReadRespTime
          )}
        />
        <UtilizationItem
          title={t("plugin__ibm-storage-odf-plugin~Throughput")}
          isLoading={false}
          error={false}
          utilization={readBWmetric}
          humanizeValue={humanizeDecimalBytesPerSec}
          query={FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalReadBW)}
        />
      </UtilizationBody>
    </DashboardCard>
  );
};

export default UtilizationCard;
