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
import { useCustomPrometheusPoll } from "../../custom-prometheus-poll/custom-prometheus-poll"
import { useTranslation } from "react-i18next";
import { FlASHSYSTEM_POOL_QUERIES, StorageDashboardQuery } from "../../../constants/queries";
import { RawCapacityCard, RawCapacityCardProps } from "../generic-raw-capacity-card/generic-raw-capacity-card";
import "../generic-raw-capacity-card/generic-raw-capacity-card.scss";


export declare type PoolRawCapacityCardProps = {
    name: string;
    pool_name: string;
};


export const PoolLogicalRawCapacityCard: React.FC<PoolRawCapacityCardProps> = (props) => {
    const {name, pool_name} = props
    const { t } = useTranslation("plugin__ibm-storage-odf-plugin");

    const [totalCapacityMetric, totalCapacityLoadError, totalCapacityLoading] = useCustomPrometheusPoll({
        query: FlASHSYSTEM_POOL_QUERIES(name, pool_name, StorageDashboardQuery.PoolLogicalTotalCapacity),
        endpoint: "api/v1/query" as any,
        samples: 60,
    });

    const [usedCapacityMetric, usedCapacityLoadError, usedCapacityLoading] = useCustomPrometheusPoll({
        query: FlASHSYSTEM_POOL_QUERIES(name, pool_name, StorageDashboardQuery.PoolLogicalUsedCapacity),
        endpoint: "api/v1/query" as any,
        samples: 60,
    });

    const [availableCapacityMetric, availableCapacityLoadError, availableCapacityLoading] = useCustomPrometheusPoll({
        query: FlASHSYSTEM_POOL_QUERIES(name, pool_name, StorageDashboardQuery.PoolLogicalFreeCapacity),
        endpoint: "api/v1/query" as any,
        samples: 60,
    });

    const loadError = totalCapacityLoadError || usedCapacityLoadError || availableCapacityLoadError
    const loading = totalCapacityLoading || usedCapacityLoading || availableCapacityLoading

    const title = t('Logical Capacity Overview')
    const capacityProps: RawCapacityCardProps = {
        totalCapacityMetric,
        usedCapacityMetric,
        availableCapacityMetric,
        loading,
        loadError,
        title,
    };

    return <RawCapacityCard {...capacityProps}/>

}
