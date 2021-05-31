import * as React from 'react';
import * as _ from 'lodash-es';
//import { match } from 'react-router';
import * as classNames from 'classnames';
import { sortable } from '@patternfly/react-table';
import {
  referenceForModel,
} from '@console/internal/module/k8s';
import {
  ResourceLink,
  ResourceKebab,
  Timestamp,
  Kebab,
  humanizeBinaryBytes,
} from '@console/internal/components/utils';
import {
  TableRow,
  TableData,
  ListPage,
  Table,
} from '@console/internal/components/factory';
import {
  NamespaceModel,
} from '@console/internal/models';
import {
  Status,
  getBadgeFromType,
  BadgeType,
} from '@console/shared';
import {StorageInstanceModel} from './models';
//import {StorageInstanceKind} from './types';
//import {StorageInstanceStatus} from './types';
//import { CAPACITY_BREAKDOWN_QUERIES_ODF, StorageDashboardQuery } from './constants/queries';
import { PrometheusEndpoint } from '@console/internal/components/graphs/helpers';
import { usePrometheusPoll } from '@console/internal/components/graphs/prometheus-poll-hook';
//import { usePrometheusQueries } from '@console/shared/src/components/dashboard/utilization-card/prometheus-hook';

const { common } = Kebab.factory;
const menuActions = [...common];

const tableColumnClasses = [
  '', // Name
  '', // Namespace
  classNames('pf-m-hidden', 'pf-m-visible-on-lg'), // Status
  classNames('pf-m-hidden', 'pf-m-visible-on-lg'), // AvailableSize
  classNames('pf-m-hidden', 'pf-m-visible-on-lg'), // UsedSize
  classNames('pf-m-hidden', 'pf-m-visible-on-xl'), // Endpoint
  classNames('pf-m-hidden', 'pf-m-visible-on-2xl'), // Created At
  Kebab.columnClass,
];

export const advanceStorageManagementStatus = ({ status }) => {
  const readyToUse = status?.phase;
  return readyToUse ? readyToUse : 'Pending';
};

export const advanceStorageManagementStatusFilters = [
  {
    filterGroupName: 'Status',
    type: 'advanceStorageManagement-status',
    reducer: advanceStorageManagementStatus,
    items: [
      { id: 'Ready', title: 'Ready' },
      { id: 'Not Ready', title: 'Not Ready' },
      { id: 'Warning', title: 'Warning' },
      { id: 'Error', title: 'Error' },
    ],
  },
];

const Header = (disableItems = {}) => () =>
  [
    {
      title: 'Name',
      sortField: 'metadata.name',
      transforms: [sortable],
      props: { className: tableColumnClasses[0] },
    },
    {
      title: 'Namespace',
      sortField: 'metadata.namespace',
      transforms: [sortable],
      props: { className: tableColumnClasses[1] },
      id: 'namespace',
    },
    {
      title: 'Status',
      sortFunc: 'status.phase',
      transforms: [sortable],
      props: { className: tableColumnClasses[2] },
    },
    {
      title: 'AvailableSize',
      sortFunc: 'status.capacity.maxCapacity',
      transforms: [sortable],
      props: { className: tableColumnClasses[3] },
    },
    {
      title: 'UsedSize',
      sortFunc: 'status.capacity.usedCapacity',
      transforms: [sortable],
      props: { className: tableColumnClasses[4] },
    },
    {
      title: 'Endpoint',
      sortField: 'spec.endpoint',
      transforms: [sortable],
      props: { className: tableColumnClasses[5] },
    },
    {
      title: 'Created At',
      sortField: 'metadata.creationTimeStamp',
      transforms: [sortable],
      props: { className: tableColumnClasses[6] },
    },
    {
      title: '',
      props: { className: tableColumnClasses[7] },
    },
  ].filter((item) => !disableItems[item.title]);

export type StorageMetrics = {
  usedCapacity: string;
  availableCapacity: string;
};

const StorageTableRow =  ({ key, obj, style, index, customData }) => {
  const { name, namespace, creationTimestamp } = obj?.metadata || {};
  const availablesize = customData?.availableCap;
  const usedsize = customData?.usedCap;

  return (
    <TableRow id={obj?.metadata?.uid} index={index} trKey={key} style={style}>
      <TableData className={tableColumnClasses[0]}>
        <ResourceLink
          kind={referenceForModel(StorageInstanceModel)}
          name={name}
          namespace={namespace}
        />
      </TableData>
      <TableData className={tableColumnClasses[1]} columnID="namespace">
        <ResourceLink kind={NamespaceModel.kind} name={namespace} />
      </TableData>
      <TableData className={tableColumnClasses[2]}>
        <Status status={obj?.status?.phase} />
      </TableData>
      <TableData className={tableColumnClasses[3]}>
      <Status status={availablesize} />
      </TableData>
      <TableData className={tableColumnClasses[4]}>
        <Status status={usedsize} />
      </TableData>
      <TableData className={tableColumnClasses[5]}>
        <Status status={obj?.spec.endpoint} />
      </TableData>
      <TableData className={tableColumnClasses[6]}>
        <Timestamp timestamp={creationTimestamp} />
      </TableData>
      <TableData className={tableColumnClasses[7]}>
        <ResourceKebab
          kind={referenceForModel(StorageInstanceModel)}
          resource={obj}
          actions={menuActions}
        />
      </TableData>
    </TableRow>
  );
};

const AdvanceStorageManagementTable = (props) => {
  const Row = StorageTableRow;

  return (
  <Table
    {...props}
    aria-label="Advance Storage Management Table"
    Header={Header(props.customData?.disableItems)}
    Row={Row}
    virtualize
  />
  )
};

export const AdvanceStorageManagementListPage = (props) => {
  const namespace = props.namespace || props.match?.params?.ns || 'all-namespaces';
  const createProps = {
    to: `/k8s/${namespace === 'all-namespaces' ? 'ns/default' : `ns/${namespace}`}/${
      props.match?.params?.plural ||referenceForModel(StorageInstanceModel)
    }/~new/form`, 
  };
  
  const query = [`sum(pool_capacity_used)`, `sum(pool_capacity_usable)`];
  //const url = getPrometheusURL({ endpoint: PrometheusEndpoint.QUERY, namespace: namespace, query })
  const [response0] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY,
    namespace,
    query: query[0],
  });
  const [response1] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY,
    namespace,
    query: query[1],
  });
  const usedCap = humanizeBinaryBytes(response0?.data?.result?.[0]?.value?.[1]);
  const availableCap = humanizeBinaryBytes(response1?.data?.result?.[0]?.value?.[1]);
  
  const customData = {usedCap: usedCap?.string, availableCap: availableCap?.string};
  
  return (
    <ListPage
      {...props}
      kind={referenceForModel(StorageInstanceModel)}
      ListComponent={AdvanceStorageManagementTable}
      rowFilters={advanceStorageManagementStatusFilters}
      canCreate
      createProps={createProps}
      badge={getBadgeFromType(BadgeType.TECH)}
      customData={customData}
    />
  );
};

export default AdvanceStorageManagementListPage;
