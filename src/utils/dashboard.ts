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
import { PrometheusResponse } from '@console/internal/components/graphs';
import { createContext } from 'react';
import {EventEmitter} from 'events'
export const EventBus = new EventEmitter();

export const getResiliencyProgress = (results: PrometheusResponse): number => {
  /**
   * Possible values for progress:
   *   - A float value of String type
   *   - 'NaN'
   *   - undefined
   */
  const progress: string = _.get(results, 'data.result[0].value[1]');
  return parseFloat(progress);
};

export const getGaugeValue = (data: PrometheusResponse) => _.get(data, 'data.result[0].value[1]');

type CRContextType = {
  name: string;
};

export const CRContext = createContext<CRContextType>({ name: "test" });
