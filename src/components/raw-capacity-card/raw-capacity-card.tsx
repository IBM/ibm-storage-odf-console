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
import * as _ from 'lodash';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { ChartDonut, ChartLabel } from '@patternfly/react-charts';
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
  usePrometheusPoll,
} from '@console/dynamic-plugin-sdk/internalAPI';
import { humanizeBinaryBytes } from '../../humanize';
import { 
  FlASHSYSTEM_QUERIES,
  StorageDashboardQuery,
 } from '../../constants/queries';
import {
  useK8sWatchResource,
} from "@console/dynamic-plugin-sdk/api";
import {GetFlashSystemResource} from '../../constants/resources';
import {parseMetricData} from '../../selectors/promethues-utils';
import { StorageInstanceKind } from '../../types';
import './raw-capacity-card.scss';

const colorScale = ['#0166cc', '#d6d6d6'];

const RawCapacityCard: React.FC<any> = (props)  => {
  const { t } = useTranslation();
  const [data, loaded, loadError] = useK8sWatchResource<StorageInstanceKind>(GetFlashSystemResource(props?.match?.params?.name, props?.match?.params?.namespace));
  const name= loaded && !loadError? data?.[0]?.metadata.name: props?.match?.params?.name;

  const [totalCapacitymetric] = usePrometheusPoll({
    query: FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalCapacity),
    endpoint: "api/v1/query" as any,
  });
  const [totalCapacity] = parseMetricData(totalCapacitymetric, humanizeBinaryBytes);
  const [usedCapacitymetric] = usePrometheusPoll({
    query: FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalCapacity),
    endpoint: "api/v1/query" as any,
  });
  const [usedCapacity] = parseMetricData(usedCapacitymetric, humanizeBinaryBytes);
  const [availableCapacitymetric] = usePrometheusPoll({
    query: FlASHSYSTEM_QUERIES(name, StorageDashboardQuery.TotalCapacity),
    endpoint: "api/v1/query" as any,
  });
  const [availableCapacity] = parseMetricData(availableCapacitymetric, humanizeBinaryBytes);

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
        <DashboardCardTitle>{t('Physical Capacity Overview')}</DashboardCardTitle>
      </DashboardCardHeader>
      <DashboardCardBody className="flashsystem-raw-usage__container">
        {loaded && !loadError && (
          <>
            <div className="flashsystem-raw-usage__item flashsystem-raw-usage__legend">
              <ChartLegend
                fill={colorScale[0]}
                title={t('Used')}
                text={usedCapacity.string}
                titleClassName="flashsystem-raw-card-legend__title--pad"
              />
              <ChartLegend
                fill={colorScale[1]}
                title={t('Available')}
                text={availableCapacity.string}
              />
            </div>
            <div className="flashsystem-raw-usage__item flashsystem-raw-usage__chart">
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
  <div className="flashsystem-raw-usage__container">
    <div className="flashsystem-raw-usage-loading__legend">
      <div className="flashsystem-raw-usage-loading-legend__item skeleton-activity" />
      <div className="flashsystem-raw-usage-loading-legend__item skeleton-activity" />
    </div>
    <div className="flashsystem-raw-usage-loading__chart skeleton-activity" />
  </div>
);

const ErrorCardBody: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flashsystem-raw-usage--error text-muted">
        {t('storage-advance~Not Available')}
      </div>
    </>
  );
};

const ChartLegend: React.FC<ChartLegendProps> = ({ fill, title, text, titleClassName }) => (
  <div className="flashsystem-raw-card-legend__container">
    <div className="flashsystem-raw-card-legend__index-block">
      <div className="flashsystem-raw-card-legend__color-square" style={{ backgroundColor: fill }} />
      <div className={classNames('flashsystem-raw-card-legend__title', titleClassName)}>{title}</div>
    </div>
    <div className="flashsystem-raw-card-legend__value-block">
      <div className="flashsystem-raw-card-legend__text">{text}</div>
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
