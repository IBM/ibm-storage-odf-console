import * as React from 'react';
import { match } from 'react-router';
import * as classNames from 'classnames';
import { sortable } from '@patternfly/react-table';
import {
  K8sResourceKind,
  PersistentVolumeClaimKind,
  referenceForModel,
} from '@console/internal/module/k8s';
import {
  ResourceLink,
  ResourceKebab,
  Timestamp,
  Kebab,
} from '@console/internal/components/utils';
import {
  TableRow,
  TableData,
  ListPage,
  Table,
  RowFunction,
} from '@console/internal/components/factory';
import {
  NamespaceModel,
} from '@console/internal/models';
import {
  Status,
  getBadgeFromType,
  BadgeType,
  getName,
  //getNamespace,
  FLAGS,
} from '@console/shared';
import { useFlag } from '@console/shared/src/hooks/flag';
import {StorageInstanceModel} from './models';
import {StorageInstanceKind} from './types';
import {StorageInstanceStatus} from './types';

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

export const advanceStorageManagementStatus = ({ status }: { status?: StorageInstanceStatus}) => {
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

const Row: RowFunction<StorageInstanceKind> = ({ key, obj, style, index, customData }) => {
  const { name, namespace, creationTimestamp } = obj?.metadata || {};
  const availablesize = obj?.status?.capacity?.maxCapacity;
  const usedsize = obj?.status?.capacity?.usedCapacity;
  
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

const AdvanceStorageManagementTable: React.FC<AdvanceStorageManagementTableProps> = (props) => (
  <Table
    {...props}
    aria-label="Advance Storage Management Table"
    Header={Header(props.customData.disableItems)}
    Row={Row}
    virtualize
  />
);

export const AdvanceStorageManagementListPage: React.FC<AdvanceStorageManagementPageProps> = (props) => {
  const canListVSC = useFlag(FLAGS.CAN_LIST_VSC);
  const namespace = props.namespace || props.match?.params?.ns || 'all-namespaces';
  const createProps = {
    //to: `/k8s/${namespace === 'all-namespaces' ? namespace : `ns/${namespace}`}/${
    to: `/k8s/${namespace === 'all-namespaces' ? 'ns/default' : `ns/${namespace}`}/${
      props.match?.params?.plural ||referenceForModel(StorageInstanceModel)
    }/~new/form`, 
    //}/~new`,
  };
  return (
    <ListPage
      {...props}
      kind={referenceForModel(StorageInstanceModel)}
      ListComponent={AdvanceStorageManagementTable}
      rowFilters={advanceStorageManagementStatusFilters}
      canCreate
      createProps={createProps}
      badge={getBadgeFromType(BadgeType.TECH)}
      customData={{ disableItems: { 'Snapshot Content': !canListVSC } }}
    />
  );
};

const checkAdvanceStorage: CheckAdvanceStorage = (StorageInstanceinstance, pvc) => {
  StorageInstanceinstance.filter(
    (snapshot) =>
      snapshot?.spec?.source?.persistentVolumeClaimName === getName(pvc)
  );
  return StorageInstanceinstance;
}

const FilteredAdvanceStorageManagementTable: React.FC<FilteredAdvanceStorageManagementTable> = (props) => {
  const { data, customData } = props;
  return (
    <Table
      {...props}
      data={checkAdvanceStorage(data, customData.pvc)}
      aria-label="Storage Table"
      Header={Header(customData?.disableItems)}
      Row={Row}
      virtualize
    />
  );
};

export const AdvanceStorageManagementPVCPage: React.FC<AdvanceStorageManagementPVCPage> = (props) => {
  const canListVSC = useFlag(FLAGS.CAN_LIST_VSC);
  return (
    <ListPage
      {...props}
      kind={referenceForModel(StorageInstanceModel)}
      ListComponent={FilteredAdvanceStorageManagementTable}
      rowFilters={advanceStorageManagementStatusFilters}
      customData={{
        pvc: props.obj,
        disableItems: { Source: true, 'Snapshot Content': !canListVSC },
      }}
    />
  );
};

type AdvanceStorageManagementPageProps = {
  namespace?: string;
  match: match<{ ns?: string; plural?: string }>;
};

type CheckAdvanceStorage = (
  volumeSnapshots: StorageInstanceKind[],
  pvc: K8sResourceKind,
) => StorageInstanceKind[];

type FilteredAdvanceStorageManagementTable = {
  data: StorageInstanceKind[];
  customData: { [key: string]: any };
};

type AdvanceStorageManagementPVCPage = {
  obj: PersistentVolumeClaimKind;
};


type AdvanceStorageManagementTableProps = {
  customData: { [key: string]: any };
};

export default AdvanceStorageManagementListPage;
