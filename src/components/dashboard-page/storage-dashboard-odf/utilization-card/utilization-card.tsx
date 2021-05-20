import * as React from 'react';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import { Dropdown } from '@console/internal/components/utils/dropdown';
import {
  humanizeBinaryBytes,
  humanizeDecimalBytesPerSec,
} from '@console/internal/components/utils';
import UtilizationBody from '@console/shared/src/components/dashboard/utilization-card/UtilizationBody';
import { ByteDataTypes } from '@console/shared/src/graph-helper/data-utils';
import ConsumerPopover from '@console/shared/src/components/dashboard/utilization-card/TopConsumerPopover';
//import { PrometheusUtilizationItem } from '@console/internal/components/dashboard/dashboards-page/cluster-dashboard/utilization-card';
import { PrometheusMultilineUtilizationItem } from '@console/internal/components/dashboard/dashboards-page/cluster-dashboard/utilization-card';
import {
  useMetricDuration,
  Duration,
} from '@console/shared/src/components/dashboard/duration-hook';
import {
  StorageDashboardQuery,
  utilizationPopoverQueryMapODF,
  UTILIZATION_QUERY_ODF,
} from '../../../../constants/queries';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import { humanizeIOPS, humanizeLatency } from './utils';
import { useTranslation } from 'react-i18next';
import {OdfDashboardContext} from '../../../../odf-dashboard';

const UtilizationCard: React.FC<DashboardItemProps> = ({
  }) => {
  const { obj } = React.useContext(OdfDashboardContext);
  const stoIns = obj?.metadata.name;

  const { t } = useTranslation();
  const [duration, setDuration] = useMetricDuration(t);
  const [timestamps] = React.useState<Date[]>();

  const storagePopover = React.useCallback(
    ({ current }) => (
      <ConsumerPopover
        title="Used Capacity"
        current={current}
        consumers={utilizationPopoverQueryMapODF(stoIns)}
        humanize={humanizeBinaryBytes}
      />
    ),
    [],
  );

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>Utilization</DashboardCardTitle>
        <Dropdown items={Duration(t)} onChange={setDuration} selectedKey={duration} title={duration} />
      </DashboardCardHeader>
      <UtilizationBody timestamps={timestamps}>
        <PrometheusMultilineUtilizationItem
          title="Capacity"
          duration={duration}
          humanizeValue={humanizeBinaryBytes}
          byteDataType={ByteDataTypes.BinaryBytes}
          queries={UTILIZATION_QUERY_ODF(stoIns,StorageDashboardQuery.UTILIZATION_CAPACITY_QUERY)}
          TopConsumerPopovers={[storagePopover,]}
        />
        <PrometheusMultilineUtilizationItem
          title="IOPS"
          duration={duration}
          humanizeValue={humanizeIOPS}
          queries={UTILIZATION_QUERY_ODF(stoIns,StorageDashboardQuery.UTILIZATION_IOPS_QUERY)}
        />
        <PrometheusMultilineUtilizationItem
          title="Latency"
          duration={duration}
          humanizeValue={humanizeLatency}
          queries={UTILIZATION_QUERY_ODF(stoIns,StorageDashboardQuery.UTILIZATION_LATENCY_QUERY)}
        />
        <PrometheusMultilineUtilizationItem
          title="Throughput"
          duration={duration}
          humanizeValue={humanizeDecimalBytesPerSec}
          queries={UTILIZATION_QUERY_ODF(stoIns,StorageDashboardQuery.UTILIZATION_THROUGHPUT_QUERY)}
        />
      </UtilizationBody>
    </DashboardCard>
  );
};

export default withDashboardResources(UtilizationCard);
