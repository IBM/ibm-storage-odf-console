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
import {useTranslation} from "react-i18next";
import {ODFDashboardProps} from "../../flashsystem-dashboard";
import { parseProps} from "../../selectors";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Grid,
    GridItem,
    Select,
    SelectProps
} from "@patternfly/react-core";
import {getSelectOptions} from "../breakdown-card/breakdown-dropdown";
import { PoolPhysicalRawCapacityCard } from "../capacity-card/pool-physical-raw-capacity-card/pool-physical-raw-capacity-card";
import {useK8sWatchResource} from "@openshift-console/dynamic-plugin-sdk";
import {ConfigMapKind} from "../../types";
import {getIBMPoolsConfigMap} from "../../constants/resources";
import {getPoolNames} from "./utils";
import { PoolLogicalRawCapacityCard } from "../capacity-card/pool-logical-raw-capacity-card/pool-logical-raw-capacity-card";

let dropdownKeys = []
let poolsSelectItems = []


const StorageClassOverviewBody : React.FC<ODFDashboardProps> = (props) => {
    const { namespace } = parseProps(props)
    const cmResource = getIBMPoolsConfigMap(namespace)
    const [configMap, cmLoaded, cmLoadError] = useK8sWatchResource<ConfigMapKind>(cmResource);
    const cmResourceData = configMap?.data?.pools

    if (cmResourceData) {
        dropdownKeys = getPoolNames(cmResourceData)
        poolsSelectItems = getSelectOptions(dropdownKeys);
    }

    return (
            <>
             { cmLoaded &&
                 <PoolsListBody {...props} /> }
             { !cmLoaded && !cmLoadError &&
                 <LoadingCardBody /> }
             { !cmLoaded && cmLoadError &&
                 <ErrorCardBody /> }
            </>
    );
};

const LoadingCardBody: React.FC = () => (
    <div className="flashsystem-storageclass-overview__container">
        <div className="flashsystem-storageclass-overview-loading__legend">
            <div className="flashsystem-storageclass-overview-loading-legend__item skeleton-activity" />
            <div className="flashsystem-storageclass-overview-loading-legend__item skeleton-activity" />
        </div>
        <div className="flashsystem-storageclass-overview-loading__chart skeleton-activity" />
    </div>
);

const ErrorCardBody: React.FC = () => {
    const { t } = useTranslation("plugin__ibm-storage-odf-plugin");
    return (
        <>
            <div className="flashsystem-storageclass-overview--error text-muted">
                {t("Not available")}
            </div>
        </>
    );
};

const PoolsListBody = (props) => {
    const { t } = useTranslation("plugin__ibm-storage-odf-plugin");
    const { name } = parseProps(props);

    const initialPoolName = dropdownKeys? dropdownKeys.at(0): ''
    const [poolName, setPool] = React.useState(initialPoolName);
    const [isPoolSelectOpen, setPoolSelect] = React.useState(false);

    const handlePoolChange: SelectProps["onSelect"] = (_e, pool) => {
        setPool(pool as string);
        setPoolSelect(!isPoolSelectOpen);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {t("Pool name:")}
                </CardTitle>
                <div className="flashsystem-pool-statistics__header">
                    <Select
                        className="flashsystem-pool-statistics__dropdown"
                        autoFocus={false}
                        onSelect={handlePoolChange}
                        onToggle={() => setPoolSelect(!isPoolSelectOpen)}
                        isOpen={isPoolSelectOpen}
                        selections={[poolName]}
                        placeholderText="Choose pool"
                        aria-label="Choose By Dropdown"
                        isCheckboxSelectionBadgeHidden>
                        {poolsSelectItems}
                    </Select>
                </div>
            </CardHeader>
            {poolName &&
                <CardBody className="flashsystem-physical-pool-statistics__body">
                    <Grid>
                        <GridItem span={6}>
                            <PoolPhysicalRawCapacityCard name={name} pool_name={poolName}  />
                        </GridItem>
                    </Grid>
                </CardBody>
            }
            {poolName &&
                <CardBody className="flashsystem-logical-pool-statistics__body">
                    <Grid>
                        <GridItem span={6}>
                            <PoolLogicalRawCapacityCard name={name} pool_name={poolName} />
                        </GridItem>
                    </Grid>
                </CardBody>
            }
        </Card>
    );
}


const StorageClassOverviewDashboard: React.FC<ODFDashboardProps> = (props) => {
    return (
        <>
            <div className="co-sc-dashboard-body">
                <StorageClassOverviewBody {...props} />
            </div>
        </>
    );
};

export default StorageClassOverviewDashboard