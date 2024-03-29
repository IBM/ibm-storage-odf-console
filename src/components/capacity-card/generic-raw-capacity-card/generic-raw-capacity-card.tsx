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
import { humanizeBinaryBytes } from "../../../humanize";
import { parseMetricData } from "../../../selectors/promethues-utils";
import { PrometheusResponse } from '@openshift-console/dynamic-plugin-sdk';
import { ChartDonut, ChartLabel } from "@patternfly/react-charts";
import { Card, CardBody, CardHeader, CardTitle } from '@patternfly/react-core';
import "./generic-raw-capacity-card.scss";
import { INVALID_PROMETHEUS_CHILD_STATS } from "../../../constants/constants";

const colorScale = ["#0166cc", "#d6d6d6"];


export type RawCapacityCardProps = {
    totalCapacityMetric: PrometheusResponse;
    usedCapacityMetric: PrometheusResponse;
    availableCapacityMetric: PrometheusResponse;
    loading: boolean;
    loadError: boolean;
    title: string;
};


export const RawCapacityCard: React.FC<RawCapacityCardProps> = (props) => {
    const { t } = useTranslation("plugin__ibm-storage-odf-plugin");

    const { totalCapacityMetric, availableCapacityMetric, usedCapacityMetric, loading, title } = props
    let { loadError } =  props;
    let invalidValue = false;

    const [totalCapacity] = parseMetricData(
        totalCapacityMetric,
        humanizeBinaryBytes
    );

    const [availableCapacity, , availableCapacityOriginal] = parseMetricData(
        availableCapacityMetric,
        humanizeBinaryBytes,
        totalCapacity?.unit
    );

    const [usedCapacity, , usedCapacityOriginal] = parseMetricData(
        usedCapacityMetric,
        humanizeBinaryBytes,
        totalCapacity?.unit
    );

    const donutData = [
        { x: "Used", y: usedCapacity.value, string: usedCapacityOriginal.string },
        { x: "Available", y: availableCapacity.value, string: availableCapacityOriginal.string},
    ];

    if ( totalCapacity.value == null || availableCapacity.value == null || usedCapacity.value == null ){
        invalidValue = true
    }

    const invalidStats = totalCapacity.value == INVALID_PROMETHEUS_CHILD_STATS ||
        usedCapacity.value == INVALID_PROMETHEUS_CHILD_STATS || availableCapacity.value == INVALID_PROMETHEUS_CHILD_STATS
    loadError = loadError || invalidStats || invalidValue

    const errorMessage:string = invalidStats? t('Physical capacity overview is unsupported for child pools.'): t('Not available')

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardBody className="flashsystem-raw-usage__container">
                {!loading && !loadError && (
                    <>
                        <div className="flashsystem-raw-usage__item flashsystem-raw-usage__legend">
                            <ChartLegend
                                fill={colorScale[0]}
                                title={t("Used")}
                                text={usedCapacityOriginal.string}
                                titleClassName="flashsystem-raw-card-legend__title--pad"
                            />
                            <ChartLegend
                                fill={colorScale[1]}
                                title={t("Available")}
                                text={availableCapacityOriginal.string}
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
                                title={usedCapacityOriginal.string}
                                subTitle={"Total of " + totalCapacity.string}
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
                {loadError && <ErrorCardBody errorMessage={errorMessage}/>}
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


export type CapacityErrorCardBodyProps = {
    errorMessage: string;
};


const ErrorCardBody: React.FC<CapacityErrorCardBodyProps> = (props) => {
    const { errorMessage } = props
    return (
        <>
            <div className="flashsystem-raw-usage--error text-muted">
                {errorMessage}
            </div>
        </>
    );
};

const ChartLegend: React.FC<ChartLegendProps> = ({fill, title, text, titleClassName,}) => (
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

