import * as React from 'react';
import * as _ from 'lodash';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { ChartDonut, ChartLabel } from '@patternfly/react-charts';
import { useDashboardPrometheusQuery as usePrometheusQuery } from "@console/dynamic-plugin-sdk/provisional";
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
} from '@console/dynamic-plugin-sdk/provisional';
import { humanizeBinaryBytes } from '../../humanize';
import { CAPACITY_BREAKDOWN_QUERIES_ODF,StorageDashboardQuery } from '../../constants/queries';
import {
  useK8sWatchResource,
} from "@console/dynamic-plugin-sdk/api";
import {GetFlashSystemResource} from '../../constants/resources';
import { StorageInstanceKind } from '../../types';
import './raw-capacity-card.scss';

const colorScale = ['#0166cc', '#d6d6d6'];

const RawCapacityCard: React.FC<any> = (props)  => {
  const { t } = useTranslation();
  const [data, loaded, loadError] = useK8sWatchResource<StorageInstanceKind>(GetFlashSystemResource(props?.match?.params?.name, props?.match?.params?.namespace));
  const name= loaded && !loadError? data?.[0]?.metadata.name: undefined;
  
  const [totalCapacity, ,] = usePrometheusQuery(
    CAPACITY_BREAKDOWN_QUERIES_ODF(name, StorageDashboardQuery.TotalCapacity),
    humanizeBinaryBytes
  );
  const [usedCapacity, ,] = usePrometheusQuery(
    CAPACITY_BREAKDOWN_QUERIES_ODF(name, StorageDashboardQuery.TotalUsedCapacity),
    humanizeBinaryBytes
  );
  const [availableCapacity, ,] = usePrometheusQuery(
    CAPACITY_BREAKDOWN_QUERIES_ODF(name, StorageDashboardQuery.TotalFreeCapacity),
    humanizeBinaryBytes
  );

  const donutData = [
    { x: 'Used', y: usedCapacity.value, string: usedCapacity.string },
    {
      x: 'Available',
      y: availableCapacity.value,
      string: availableCapacity.string,
    },
  ];

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>{t('Phycical Capacity Overview')}</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody className="ceph-raw-usage__container">
        {loaded && !loadError && (
          <>
            <div className="ceph-raw-usage__item ceph-raw-usage__legend">
              <ChartLegend
                fill={colorScale[0]}
                title={t('Used')}
                text={usedCapacity.string}
                titleClassName="ceph-raw-card-legend__title--pad"
              />
              <ChartLegend
                fill={colorScale[1]}
                title={t('Available')}
                text={availableCapacity.string}
              />
            </div>
            <div className="ceph-raw-usage__item ceph-raw-usage__chart">
              <ChartDonut
                ariaDesc={t('Available versus Used Capacity')}
                ariaTitle={t('Available versus Used Capacity')}
                height={150}
                width={150}
                data={donutData}
                labels={({ datum }) => `${datum.string}`}
                title={usedCapacity.string}
                subTitle={'Used of ' + totalCapacity.string}
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
        {!loaded && !loadError && <LoadingCardBody />}
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

export default RawCapacityCard;
