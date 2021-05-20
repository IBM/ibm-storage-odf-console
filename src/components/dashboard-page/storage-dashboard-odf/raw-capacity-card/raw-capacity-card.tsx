import * as React from 'react';
import * as _ from 'lodash';
import classNames from 'classnames';
//import { compose } from 'redux';
import { useTranslation } from 'react-i18next';
import { ChartDonut, ChartLabel } from '@patternfly/react-charts';
//import { usePrometheusQueries } from '@console/shared/src/components/dashboard/utilization-card/prometheus-hook';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import DashboardCardBody from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardBody';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import { humanizeBinaryBytes } from '@console/internal/components/utils';
import { CAPACITY_INFO_QUERIES_ODF } from '../../../../constants/queries';
import './raw-capacity-card.scss';

import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import {OdfDashboardContext} from '../../../../odf-dashboard';

const colorScale = ['#0166cc', '#d6d6d6'];

const RawCapacityCard: React.FC<DashboardItemProps> = ({
  watchPrometheus,
  stopWatchPrometheusQuery,
  prometheusResults,
})  => {//React.FC = React.memo(() => {
  const { obj } = React.useContext(OdfDashboardContext);

  const stoIns = obj?.metadata.name;
  const queries = Object.values(CAPACITY_INFO_QUERIES_ODF(stoIns));
  const queryKeys = Object.keys(queries);

  React.useEffect(() => {
    queryKeys.forEach((q) => watchPrometheus(queries[q]));
    return () => queryKeys.forEach((key) => stopWatchPrometheusQuery(queries[key]));
  }, [watchPrometheus, stopWatchPrometheusQuery, queryKeys, queries]);
  const values = queryKeys.map((key) => prometheusResults.getIn([queries[key], 'data']));
  const loadError = queryKeys.some((q) =>
    prometheusResults.getIn([queries[q], 'loadError']),
  );
  const loading = queryKeys.some((q) => !prometheusResults.getIn([queries[q], 'data']));

  const { t } = useTranslation();

  const totalCapacityMetric = _.get(values[0], 'data.result[0].value[1]');//values?.[0];
  const usedCapacityMetric = _.get(values[1], 'data.result[0].value[1]'); //values?.[1];

  const totalCapacity = humanizeBinaryBytes(totalCapacityMetric);
  const availableCapacity = humanizeBinaryBytes(
    totalCapacityMetric - usedCapacityMetric,
    null,
    totalCapacity?.unit,
  );
  const usedCapacity = humanizeBinaryBytes(usedCapacityMetric, null, totalCapacity?.unit);

  // Adjusted units
  const usedCapacityAdjusted = humanizeBinaryBytes(usedCapacityMetric);
  const availableCapacityAdjusted = humanizeBinaryBytes(totalCapacityMetric - usedCapacityMetric);

  const donutData = [
    { x: 'Used', y: usedCapacity.value, string: usedCapacityAdjusted.string },
    {
      x: 'Available',
      y: availableCapacity.value,
      string: availableCapacityAdjusted.string,
    },
  ];

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>{t('storage-advance~Phycical Capacity Overview')}</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody className="ceph-raw-usage__container">
        {!loading && !loadError && (
          <>
            <div className="ceph-raw-usage__item ceph-raw-usage__legend">
              <ChartLegend
                fill={colorScale[0]}
                title={t('storage-advance~Used')}
                text={usedCapacityAdjusted.string}
                titleClassName="ceph-raw-card-legend__title--pad"
              />
              <ChartLegend
                fill={colorScale[1]}
                title={t('storage-advance~Available')}
                text={availableCapacityAdjusted.string}
              />
            </div>
            <div className="ceph-raw-usage__item ceph-raw-usage__chart">
              <ChartDonut
                ariaDesc={t('storage-advance~Available versus Used Capacity')}
                ariaTitle={t('storage-advance~Available versus Used Capacity')}
                height={150}
                width={150}
                data={donutData}
                labels={({ datum }) => `${datum.string}`}
                title={usedCapacityAdjusted.string}
                subTitle={t('storage-advance~Used of {{capacity}}', {
                  capacity: totalCapacity.string,
                })}
                colorScale={colorScale}
                padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
                constrainToVisibleArea
                subTitleComponent={
                  <ChartLabel dy={5} style={{ fill: `var(--pf-global--palette--black-500)` }} />
                }
              />
            </div>
          </>
        )}
        {loading && !loadError && <LoadingCardBody />}
        {loadError && <ErrorCardBody />}
      </DashboardCardBody>
    </DashboardCard>
  );
};

const LoadingCardBody: React.FC = () => (
  <div className="ceph-raw-usage__container">
    <div className="ceph-raw-usage-loading__legend">
      <div className="ceph-raw-usage-loading-legend__item skeleton-activity" />
      <div className="ceph-raw-usage-loading-legend__item skeleton-activity" />
    </div>
    <div className="ceph-raw-usage-loading__chart skeleton-activity" />
  </div>
);

const ErrorCardBody: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="ceph-raw-usage--error text-muted">
        {t('storage-advance~Not Available')}
      </div>
    </>
  );
};

const ChartLegend: React.FC<ChartLegendProps> = ({ fill, title, text, titleClassName }) => (
  <div className="ceph-raw-card-legend__container">
    <div className="ceph-raw-card-legend__index-block">
      <div className="ceph-raw-card-legend__color-square" style={{ backgroundColor: fill }} />
      <div className={classNames('ceph-raw-card-legend__title', titleClassName)}>{title}</div>
    </div>
    <div className="ceph-raw-card-legend__value-block">
      <div className="ceph-raw-card-legend__text">{text}</div>
    </div>
  </div>
);

type ChartLegendProps = {
  fill: string;
  text: string;
  title: string;
  titleClassName?: string;
};

export default withDashboardResources(RawCapacityCard);
