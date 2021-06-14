import * as React from 'react';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardBody from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardBody';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import { PrometheusResponse } from '@console/internal/components/graphs';

import {
  POOL_STORAGE_EFFICIENCY_QUERIES_ODF,
  StorageDashboardQuery,
} from '../../../../constants/queries';
import { EfficiencyItemBody } from './storage-efficiency-card-item';
import { getGaugeValue } from '../../../../utils';
import { humanizeBinaryBytes } from '@console/internal/components/utils';
import './storage-efficiency-card.scss';
import {OdfDashboardContext} from '../../../../odf-dashboard';

const StorageEfficiencyCard: React.FC<DashboardItemProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
}) => {
  const { obj } = React.useContext(OdfDashboardContext);
  const stoIns = obj?.metadata.name;
  const query = POOL_STORAGE_EFFICIENCY_QUERIES_ODF(stoIns);

  React.useEffect(() => {
    Object.keys(query).forEach((key) =>
      watchPrometheus(query[key]),
    );
    return () =>
      Object.keys(query).forEach((key) =>
        stopWatchPrometheusQuery(query[key]),
      );
  }, [watchPrometheus, stopWatchPrometheusQuery, query]);

  const poolCapacityRatioResult = prometheusResults.getIn([
    query[StorageDashboardQuery.POOL_CAPACITY_RATIO],
    'data',
  ]) as PrometheusResponse;

  const poolCapacityRatioResultError = prometheusResults.getIn([
    query[StorageDashboardQuery.POOL_CAPACITY_RATIO],
    'loadError',
  ]);

  const poolSavedResult = prometheusResults.getIn([
    query[StorageDashboardQuery.POOL_SAVED_CAPACITY],
    'data',
  ]) as PrometheusResponse;

  const poolSavedResultError = prometheusResults.getIn([
    query[StorageDashboardQuery.POOL_SAVED_CAPACITY],
    'loadError',
  ]);

  const ratio = getGaugeValue(poolCapacityRatioResult);
  const saved = getGaugeValue(poolSavedResult);

  const compressionStats = () => {
    const capacityRatio = Number(ratio);
    return `${capacityRatio.toFixed(2)}:1`;
  };

  const savingStats = () => {
    const savingsValue = Number(saved);
    const savedBytes = humanizeBinaryBytes(savingsValue).string;
    return savedBytes;
  };

  const compressionRatioProps = {
    stats: Number(ratio),
    isLoading: !poolCapacityRatioResult && !poolCapacityRatioResultError,
    error: !!poolCapacityRatioResultError || !ratio,
    title: 'Compression Ratio',
    infoText:
      'The ratio of the data physical stored (after compression), compared to the size of the data received from the client.',
    getStats: compressionStats,
  };
  // todo 
  // refine compression ratio
  if(compressionRatioProps){};

  const savingsProps = {
    stats: Number(saved),
    isLoading: !poolSavedResult && !poolSavedResultError,
    error: !!poolSavedResultError || !saved,
    title: 'Savings',
    infoText: 'The amount of physical storage saved after applying compression.',
    getStats: savingStats,
  };

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Storage Efficiency</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody className="co-dashboard-card__body--no-padding">
        {//<EfficiencyItemBody {...compressionRatioProps} />
        }
        <EfficiencyItemBody {...savingsProps} />
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default withDashboardResources(StorageEfficiencyCard);
