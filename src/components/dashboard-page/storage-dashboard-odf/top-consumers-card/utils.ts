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
import * as _ from 'lodash';
import { humanizeBinaryBytes } from '@console/internal/components/utils';
import { PrometheusResponse, DataPoint } from '@console/internal/components/graphs';

export const getMetricType: GetMetricType = (resource, metricType) =>
  _.get(resource, ['metric', metricType], '');

export const getGraphVectorStats: GetStats = (response, metricType, unit) => {
  return response.map((r) => {
    const name = getMetricType(r, metricType);
    const truncatedName = _.truncate(name, { length: 40 });
    return r.values.map((arr) => ({
      name: truncatedName,
      x: new Date(arr[0] * 1000),
      y: Number(humanizeBinaryBytes(arr[1], null, unit).value),
    }));
  });
};

export const sortResources: SortResourcesProps = (a, b) => {
  const aVal = _.get(a, 'values');
  const bVal = _.get(b, 'values');
  const x = _.get(a, ['values', aVal.length - 1, 1]);
  const y = _.get(b, ['values', bVal.length - 1, 1]);
  return y - x;
};

type PrometheusMetricResult = {
  metric: { [key: string]: any };
  value?: [number, string | number];
};

type GetStats = (
  response: PrometheusResponse['data']['result'],
  metric?: string,
  unit?: string,
) => DataPoint[][];

type SortResourcesProps = (
  a: PrometheusResponse['data']['result'],
  b: PrometheusResponse['data']['result'],
) => number;

type GetMetricType = (resources: PrometheusMetricResult, metricType: string) => string;
