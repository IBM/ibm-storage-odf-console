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
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { ChartDonut, ChartLabel } from "@patternfly/react-charts";
import { useCustomPrometheusPoll } from "../custom-prometheus-poll/custom-prometheus-poll"

import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
import { humanizeBinaryBytes } from "../../humanize";
import {
    FlASHSYSTEM_QUERIES,
    StorageDashboardQuery,
} from "../../constants/queries";
import { parseMetricData } from "../../selectors/promethues-utils";
import { parseProps } from "../../selectors/index";
import "./raw-capacity-card.scss";

const colorScale = ["#0166cc", "#d6d6d6"];

const RawCapacityCard: React.FC<any> = (props) => {
    const { t } = useTranslation("plugin__ibm-storage-odf-plugin");
    const { name } = parseProps(props);

    const [totalCapacitymetric, loadError, loading] = useCustomPrometheusPoll({
        query: FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.SystemPhysicalTotalCapacity),
        endpoint: "api/v1/query" as any,
        samples: 60,
    });
    const [physicalTotalCapacity] = parseMetricData(
        totalCapacitymetric,
        humanizeBinaryBytes
    );
    const [usedCapacityMetric] = useCustomPrometheusPoll({
        query: FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.SystemPhysicalUsedCapacity),
        endpoint: "api/v1/query" as any,
        samples: 60,
    });
    const [physicalUsedCapacity] = parseMetricData(
        usedCapacityMetric,
        humanizeBinaryBytes
    );
    const [freeCapacityMetric] = useCustomPrometheusPoll({
        query: FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.SystemPhysicalFreeCapacity),
        endpoint: "api/v1/query" as any,
        samples: 60,
    });
    const [physicalFreeCapacity] = parseMetricData(
        freeCapacityMetric,
        humanizeBinaryBytes
    );

    const donutData = [
        { x: "Used", y: physicalUsedCapacity.value, string: physicalUsedCapacity.string },
        { x: "Available", y: physicalFreeCapacity.value, string: physicalFreeCapacity.string},
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {t("Physical Capacity Overview")}
                </CardTitle>
            </CardHeader>
            <CardBody className="flashsystem-raw-usage__container">
                {!loading && !loadError && (
                    <>
                        <div className="flashsystem-raw-usage__item flashsystem-raw-usage__legend">
                            <ChartLegend
                                fill={colorScale[0]}
                                title={t("Used")}
                                text={physicalUsedCapacity.string}
                                titleClassName="flashsystem-raw-card-legend__title--pad"
                            />
                            <ChartLegend
                                fill={colorScale[1]}
                                title={t("Available")}
                                text={physicalFreeCapacity.string}
                            />
                        </div>
                        <div className="flashsystem-raw-usage__item flashsystem-raw-usage__chart">
                            <ChartDonut
                                ariaDesc={t(
                                    "plugin__ibm-storage-odf-plugin~Available versus Used Capacity"
                                )}
                                ariaTitle={t(
                                    "plugin__ibm-storage-odf-plugin~Available versus Used Capacity"
                                )}
                                height={150}
                                width={150}
                                data={donutData}
                                labels={({ datum }) => `${datum.string}`}
                                title={physicalUsedCapacity.string}
                                subTitle={"Total of " + physicalTotalCapacity.string}
                                colorScale={colorScale}
                                padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
                                constrainToVisibleArea
                                subTitleComponent={
                                    <ChartLabel
                                        dy={5}
                                        style={{ fill: `var(--pf-global--palette--black-500)` }}
                                    />
                                }
                            />
                        </div>
                    </>
                )}
                {loading && !loadError && <LoadingCardBody />}
                {loadError && <ErrorCardBody />}
            </CardBody>
        </Card>
    );
};

const LoadingCardBody: React.FC = () => (
    <div className="flashsystem-raw-usage__container">
        <div className="flashsystem-raw-usage-loading__legend">
            <div className="flashsystem-raw-usage-loading-legend__item skeleton-activity" />
            <div className="flashsystem-raw-usage-loading-legend__item skeleton-activity" />
        </div>
        <div className="flashsystem-raw-usage-loading__chart skeleton-activity" />
    </div>
);

const ErrorCardBody: React.FC = () => {
    const { t } = useTranslation("plugin__ibm-storage-odf-plugin");
    return (
        <>
            <div className="flashsystem-raw-usage--error text-muted">
                {t("Not Available")}
            </div>
        </>
    );
};

const ChartLegend: React.FC<ChartLegendProps> = ({
                                                     fill,
                                                     title,
                                                     text,
                                                     titleClassName,
                                                 }) => (
    <div className="flashsystem-raw-card-legend__container">
        <div className="flashsystem-raw-card-legend__index-block">
            <div
                className="flashsystem-raw-card-legend__color-square"
                style={{ backgroundColor: fill }}
            />
            <div
                className={classNames(
                    "flashsystem-raw-card-legend__title",
                    titleClassName
                )}
            >
                {title}
            </div>
        </div>
        <div className="flashsystem-raw-card-legend__value-block">
            <div className="flashsystem-raw-card-legend__text">{text}</div>
        </div>
    </div>
);

type ChartLegendProps = {
    fill: string;
    text: string;
    title: string;
    titleClassName?: string;
};

export default RawCapacityCard;
