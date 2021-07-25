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
import * as _ from "lodash";
import * as React from "react";
import { Colors, COLORMAP, OTHER_TOOLTIP } from "./consts";

export type DataPoint<X = Date | number | string> = {
  x?: X;
  y?: number;
  label?: string;
  metric?: { [key: string]: string };
  description?: string;
  symbol?: {
    type?: string;
    fill?: string;
  };
};

export type HumanizeResult = {
  string: string;
  value: number;
  unit: string;
};

export type Humanize = {
  (
    v: React.ReactText,
    initialUnit?: string,
    preferredUnit?: string
  ): HumanizeResult;
};

const getTotal = (stats: StackDataPoint[]) =>
  stats.reduce((total, dataPoint) => total + dataPoint.y, 0);

const addOthers = (
  stats: StackDataPoint[],
  metricTotal: string,
  humanize: Humanize
): StackDataPoint => {
  const top5Total = getTotal(stats);
  const others = Number(metricTotal) - top5Total;
  const othersData = {
    x: "0",
    y: others,
    name: "Other",
    color: Colors.OTHER,
    label: humanize(others).string,
    fill: "rgb(96, 98, 103)",
    link: OTHER_TOOLTIP,
    id: 6,
    ns: "",
  };
  return othersData;
};

export const addAvailable = (
  stats: StackDataPoint[],
  capacityAvailable: string,
  metricTotal: string,
  humanize: Humanize
) => {
  let othersData: StackDataPoint;
  let availableData: StackDataPoint;
  let newChartData: StackDataPoint[] = [...stats];
  if (stats.length === 5) {
    othersData = addOthers(stats, metricTotal, humanize);
    newChartData = [...stats, othersData] as StackDataPoint[];
  }
  if (capacityAvailable) {
    const availableInBytes = Number(capacityAvailable);
    availableData = {
      x: "0",
      y: availableInBytes,
      name: "Available",
      link: "",
      color: "",
      label: humanize(availableInBytes).string,
      fill: "#b8bbbe",
      id: 7,
      ns: "",
    };
    newChartData = [...newChartData, availableData] as StackDataPoint[];
  }
  return newChartData;
};

export const getLegends = (data: StackDataPoint[]) =>
  data.map((d: StackDataPoint) => ({
    name: `${d.name}\n${d.label}`,
    labels: { fill: d.color },
    symbol: { fill: d.fill },
    link: d.link,
    labelId: d.name,
    ns: d.ns,
  }));

export const getBarRadius = (index: number, length: number) => {
  if (index === length - 1) {
    return {
      bottom: 3,
      top: 3,
    };
  }
  if (index === 0) {
    return { bottom: 3 };
  }
  return {};
};

export const sortInstantVectorStats = (stats: DataPoint[]): DataPoint[] => {
  stats.sort((a, b) => {
    const y1 = a.y;
    const y2 = b.y;
    if (y1 === y2) {
      const x1 = a.x;
      const x2 = b.x;
      return x1 < x2 ? -1 : x1 > x2 ? 1 : 0;
    }
    return y2 - y1;
  });
  return stats.length === 6 ? stats.splice(0, 5) : stats;
};

export const getStackChartStats: GetStackStats = (
  response,
  humanize,
  labelNames
) =>
  response.map((r, i) => {
    const capacity = humanize(r.y).string;
    return {
      // x value needs to be same for single bar stack chart
      x: "0",
      y: r.y,
      name: labelNames ? labelNames[i] : _.truncate(`${r.x}`, { length: 12 }),
      link: labelNames ? labelNames[i] : `${r.x}`,
      color: labelNames ? Colors.OTHER : Colors.LINK,
      fill: COLORMAP[i],
      label: capacity,
      id: i,
      ns: r.metric.namespace,
    };
  });

type GetStackStats = (
  response: DataPoint[],
  humanize: Humanize,
  labelNames?: string[]
) => StackDataPoint[];

export type StackDataPoint = DataPoint<string> & {
  name: string;
  link: string;
  color: string;
  fill: string;
  id: number;
  ns: string;
};

export const getCapacityValue = (
  cephUsed: string,
  cephTotal: string,
  humanize: Humanize
) => {
  const totalFormatted = humanize(cephTotal || 0);
  const usedFormatted = humanize(cephUsed || 0, null, totalFormatted.unit);
  const available = humanize(
    totalFormatted.value - usedFormatted.value,
    totalFormatted.unit,
    totalFormatted.unit
  );
  return available;
};
