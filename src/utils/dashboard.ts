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
