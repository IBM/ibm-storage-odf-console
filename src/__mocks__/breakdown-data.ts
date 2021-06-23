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
import { humanizeBinaryBytes } from '@console/internal/components/utils';

export const breakdownData = {
  top5: [
    {
      x: 1,
      y: 10 * 1000, // 10 MiB
      label: 'First Data',
      metric: { namespace: 'default' },
    },
    {
      x: 2,
      y: 20 * 1000, // 20 MiB
      label: 'First Data',
      metric: { namespace: 'default' },
    },
    {
      x: 3,
      y: 30 * 1000, // 30 MiB
      label: 'First Data',
      metric: { namespace: 'default' },
    },
    {
      x: 4,
      y: 40 * 1000, // 40 MiB
      label: 'First Data',
      metric: { namespace: 'default' },
    },
    {
      x: 5,
      y: 50 * 1000, // 50 MiB
      label: 'First Data',
      metric: { namespace: 'default' },
    },
  ],
  capacityAvailable: '10000000',
  metricTotal: '10000000',
  capacityUsed: '150000',
  humanize: humanizeBinaryBytes,
  fakeModel: {
    abbr: 'fk',
    kind: 'fake',
    label: 'Fake',
    labelPlural: 'Fakes',
    plural: 'fakes',
    apiVersion: 'v1',
  },
};
