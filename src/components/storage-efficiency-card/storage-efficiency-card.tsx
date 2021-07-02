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
 import * as React from 'react';
 import { useTranslation } from 'react-i18next';
 import { useDashboardPrometheusQuery as usePrometheusQuery } from "@console/dynamic-plugin-sdk/provisional";
 import {
  Tooltip,
} from "@patternfly/react-core";
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
} from '@console/dynamic-plugin-sdk/provisional';
import OutlinedQuestionCircleIcon from "@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon";
import { humanizeBinaryBytes } from "../../humanize";
import { EFFICIENCY_SAVING_QUERY } from "../../constants/queries";
import './storage-efficiency-card.scss';

const StorageEfficiencyCardBody: React.FC = () => {
  const { t } = useTranslation();
  const [saving, ,] = usePrometheusQuery(
    EFFICIENCY_SAVING_QUERY,
    humanizeBinaryBytes,
  );
  let status = t('Not available');
  if (saving.value > 0) { 
    status = saving.string
  }
  return (
    <div className="co-inventory-card__item">
      <div className="co-utilization-card__item-section-multiline">
        <h4 className="pf-c-content pf-m-md">{t('Savings')}</h4>
        <div className="text-secondary">
          {status}
          <span className="ibm-storage-efficiency-card-help">
            <Tooltip            
              position="top"
              content={t('The amount of physical storage saved after applying compression.')}
            >
              <OutlinedQuestionCircleIcon title={t('Status')}/>
            </Tooltip>
          </span>
        </div>
      </div>
    </div>
  )
};

const StorageEfficiencyCard: React.FC = () => {
  const { t } = useTranslation();
  return (
  <DashboardCard gradient>
    <DashboardCardHeader>
      <DashboardCardTitle>{t('Storage Efficiency')}</DashboardCardTitle>
    </DashboardCardHeader>
    <DashboardCardBody>
      <StorageEfficiencyCardBody/>
    </DashboardCardBody>
  </DashboardCard>
)};

export default StorageEfficiencyCard;
