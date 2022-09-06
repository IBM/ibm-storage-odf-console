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

import { PrometheusResponse, PrometheusEndpoint, usePrometheusPoll } from '@openshift-console/dynamic-plugin-sdk';


type CustomPrometheusPollProps = {
    delay?: number;
    endpoint: PrometheusEndpoint;
    endTime?: number;
    namespace?: string;
    query: string;
    samples?: number;
    timeout?: string;
    timespan?: number;
    basePath?: string;
    cluster?: string;
};


type UseCustomPrometheusPoll = (
    props: CustomPrometheusPollProps
) => [PrometheusResponse, any, boolean];

export const useCustomPrometheusPoll: UseCustomPrometheusPoll = (props) => {
    const result = usePrometheusPoll(props);
    // reorder return value
    return [result[0], result[2], !result[1]];
};
