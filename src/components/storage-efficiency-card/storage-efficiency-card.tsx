import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDashboardPrometheusQuery as usePrometheusQuery } from "@console/dynamic-plugin-sdk/provisional";

import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Tooltip,
} from "@patternfly/react-core";
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
  <Card className="co-dashboard-card co-dashboard-card--gradient">
    <CardHeader className="co-dashboard-card__header">
      <CardTitle className="co-dashboard-card__title">{t('Storage Efficiency')}</CardTitle>
    </CardHeader>
    <CardBody className="co-dashboard-card__body">
      <StorageEfficiencyCardBody/>
    </CardBody>
  </Card>
)};

export default StorageEfficiencyCard;
