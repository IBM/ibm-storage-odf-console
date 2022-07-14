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
  UtilizationBody,
  UtilizationItem,
  UtilizationDurationDropdown,
  useUtilizationDuration,
  //MultilineUtilizationItem // we need this to be exposed
} from "@openshift-console/dynamic-plugin-sdk-internal";

import {useCustomPrometheusPoll} from "../custom-prometheus-poll/custom-prometheus-poll"

import { Card, CardHeader, CardTitle } from '@patternfly/react-core';

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
  const { t } = useTranslation("plugin__ibm-storage-odf-plugin");
  const { name } = parseProps(props);
  const { duration } = useUtilizationDuration();

  const [usedCapacitymetric] = useCustomPrometheusPoll({
    query: FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalUsedCapacity),
    endpoint: "api/v1/query_range" as any,
    timespan: duration,
  });
  const [IOPSmetric] = useCustomPrometheusPoll({
    query:
      FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalReadIOPS) +
      "+" +
      FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalWriteIOPS),
    endpoint: "api/v1/query_range" as any,
    timespan: duration,
  });
  const [readRespTimemetric] = useCustomPrometheusPoll({
    query: FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalReadRespTime),
    endpoint: "api/v1/query_range" as any,
    timespan: duration,
  });
  const [BWmetric] = useCustomPrometheusPoll({
    query:
      FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalReadBW) +
      "+" +
      FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalWriteBW),
    endpoint: "api/v1/query_range" as any,
    timespan: duration,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Utilization")}</CardTitle>
        <UtilizationDurationDropdown />
      </CardHeader>
      <UtilizationBody>
        <UtilizationItem
          title={t("Used Capacity")}
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
          title={t("Total IOPS")}
          isLoading={false}
          error={false}
          utilization={IOPSmetric}
          humanizeValue={humanizeIOPS}
          query={
            FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalReadIOPS) +
            "+" +
            FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalWriteIOPS)
          }
        />
        <UtilizationItem
          title={t("Read Latency")}
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
          title={t("Total Throughput")}
          isLoading={false}
          error={false}
          utilization={BWmetric}
          humanizeValue={humanizeDecimalBytesPerSec}
          query={
            FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalReadBW) +
            "+" +
            FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalWriteBW)
          }
        />
      </UtilizationBody>
    </Card>
  );
};

export default UtilizationCard;
