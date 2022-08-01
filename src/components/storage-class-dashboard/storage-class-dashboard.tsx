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
import PoolRawCapacityCard from "../pool-raw-capacity-card/pool-raw-capacity-card";
import {useK8sWatchResource} from "@openshift-console/dynamic-plugin-sdk";
import {ConfigMapKind} from "../../types";
import {GetIBMPoolsConfigMap} from "../../constants/resources";


let dropdownKeys = []
let breakdownSelectItems = []


const StorageClassOverviewBody : React.FC<ODFDashboardProps> = (props) => {
    const { namespace } = parseProps(props)
    const cmResource = GetIBMPoolsConfigMap(namespace)
    const [configMap, cmLoaded, cmLoadError] = useK8sWatchResource<ConfigMapKind>(cmResource);

    const cmResourceData = configMap?.data?.pools
    let pool_names = []
    if (cmResourceData) {
        const configMapData = new Map(Object.entries(JSON.parse(cmResourceData)));
        const scPoolsData = configMapData.get('storageclass_pool')
        const scPoolsMap = new Map(Object.entries(scPoolsData as string));
        pool_names = Array.from(scPoolsMap.values())
        dropdownKeys = pool_names
        breakdownSelectItems = getSelectOptions(dropdownKeys);
    }

    return (
            <>
             { cmLoaded &&
                 <PoolsListBody {...props} />
             }
             { !cmLoaded && !cmLoadError &&
                 <LoadingCardBody />
             }
             { cmLoadError &&
                 <ErrorCardBody />
             }
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
                {t("Not Available")}
            </div>
        </>
    );
};

const PoolsListBody = (props) => {
    const { t } = useTranslation("plugin__ibm-storage-odf-plugin");
    const { name } = parseProps(props);

    const [poolName, setPool] = React.useState('');
    const [isOpenBreakdownSelect, setBreakdownSelect] = React.useState(false);

    const handlePoolChange: SelectProps["onSelect"] = (_e, breakdown) => {
        setPool(breakdown as string);
        setBreakdownSelect(!isOpenBreakdownSelect);
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
                        onToggle={() => setBreakdownSelect(!isOpenBreakdownSelect)}
                        isOpen={isOpenBreakdownSelect}
                        selections={[poolName]}
                        placeholderText="Choose pool"
                        aria-label="Choose By Dropdown"
                        isCheckboxSelectionBadgeHidden>
                        {breakdownSelectItems}
                    </Select>
                </div>
            </CardHeader>
            {poolName &&
                <CardBody className="flashsystem-pool-statistics__body">
                    <Grid>
                        <GridItem span={6}>
                            <PoolRawCapacityCard name={name} pool_name={poolName}  />
                        </GridItem>
                    </Grid>
                </CardBody>
            }
            {poolName &&
                <CardBody className="flashsystem-logical-pool-statistics__body">
                    <Grid>
                        <GridItem span={6}>
                            {/* todo - change to PoolRawLogicalCapacityCard */}
                            <PoolRawCapacityCard name={name} pool_name={poolName} />
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