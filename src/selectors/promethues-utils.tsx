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
import * as _ from "lodash-es";

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

export type PrometheusLabels = { [key: string]: string };
export type PrometheusValue = [number, string];

// Only covers range and instant vector responses for now.
export type PrometheusResult = {
  metric: PrometheusLabels;
  values?: PrometheusValue[];
  value?: PrometheusValue;
};

export type PrometheusData = {
  resultType: "matrix" | "vector" | "scalar" | "string";
  result: PrometheusResult[];
};

export type PrometheusResponse = {
  status: string;
  data: PrometheusData;
  errorType?: string;
  error?: string;
  warnings?: string[];
};

export type DomainPadding =
  | number
  | {
      x?: number | [number, number];
      y?: number | [number, number];
    };

export const defaultXMutator: XMutator = (x) => new Date(x * 1000);
export const defaultYMutator: YMutator = (y) => parseFloat(y);

export const getRangeVectorStats: GetRangeStats = (
  response,
  description,
  symbol,
  xMutator,
  yMutator
) => {
  const results = response?.data?.result;
  return results?.map((r, index) => {
    return r?.values?.map(([x, y]) => {
      return {
        x: xMutator?.(x) ?? defaultXMutator(x),
        y: yMutator?.(y) ?? defaultYMutator(y),
        description: _.isFunction(description)
          ? description(r, index)
          : description,
        symbol,
      } as DataPoint<Date>;
    });
  });
};

export const getInstantVectorStats: GetInstantStats = (
  response,
  metric,
  humanize
) => {
  const results = _.get(response, "data.result", []);
  return results.map((r) => {
    const y = parseFloat(_.get(r, "value[1]"));
    return {
      label: humanize ? humanize(y).string : null,
      x: _.get(r, ["metric", metric], ""),
      y,
      metric: r.metric,
    };
  });
};

type XMutator = (x: any) => Date;
type YMutator = (y: any) => number;

export type GetRangeStats = (
  response: PrometheusResponse,
  description?: string | ((result: PrometheusResult, index: number) => string),
  symbol?: { fill?: string; type?: string },
  xMutator?: XMutator,
  yMutator?: YMutator
) => DataPoint<Date>[][];

export type GetInstantStats = (
  response: PrometheusResponse,
  metric?: string,
  humanize?: Humanize
) => DataPoint<number>[];

export type HumanizeResult = {
  value: number;
  unit: string;
  string: string;
};
export type Humanize = {
  (
    v: React.ReactText,
    initialUnit?: string,
    preferredUnit?: string
  ): HumanizeResult;
};
export const parseMetricData: parsePrometheusQuery = (
  queryResult: PrometheusResponse,
  humanize,
  unit?: string
) => {
  const value = getPrometheusQueryValue(queryResult)
  if (value) {
    return [humanize(value, null, unit), _.get(queryResult, "loadError"), humanize(value)];
  }
  return [{}, null, {}] as [HumanizeResult, any, HumanizeResult];
};

type parsePrometheusQuery = (
  queryResult: PrometheusResponse,
  humanize: Humanize,
  unit?: string

) => [HumanizeResult, any, HumanizeResult];


export const getPrometheusQueryValue: (PrometheusResponse) => number = (
    queryResult: PrometheusResponse,
) =>  {
  if (!queryResult || !_.get(queryResult, "data")) {
    return null as number;
  }
  return getInstantVectorStats(queryResult)[0]?.y;

}
