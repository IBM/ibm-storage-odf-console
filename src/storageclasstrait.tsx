import * as React from 'react';
import * as _ from 'lodash-es';
import { match } from 'react-router';
import * as classNames from 'classnames';
import { sortable } from '@patternfly/react-table';
import {
  referenceForModel,
} from '@console/internal/module/k8s';
import {
  ResourceLink,
  ResourceKebab,
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
  StorageClassModel,
} from '@console/internal/models';
import {
  Status,
  getBadgeFromType,
  BadgeType,
  FLAGS,
} from '@console/shared';
import { useFlag } from '@console/shared/src/hooks/flag';
import {StorageClassTraitModel} from './models';
import {StorageClassTraitKind} from './types';
import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';


const { common } = Kebab.factory;
const menuActions = [...common];

const sctResource = {
    kind: referenceForModel(StorageClassTraitModel),
    namespaced: false,
    isList: true,
    prop: 'sct',
};

const tableColumnClasses = [
  '', // Name
  classNames('pf-m-hidden', 'pf-m-visible-on-xl'), // Status
  classNames('pf-m-hidden', 'pf-m-visible-on-2xl'), // AccessMode
  classNames('pf-m-hidden', 'pf-m-visible-on-lg'), // Filesystem
  classNames('pf-m-hidden', 'pf-m-visible-on-lg'), // PerfLevel
  classNames('pf-m-hidden', 'pf-m-visible-on-xl'), // Encrption
  classNames('pf-m-hidden', 'pf-m-visible-on-2xl'), // Compression
  classNames('pf-m-hidden', 'pf-m-visible-on-2xl'), // snapshotEnabled
  '', // link to SC
  Kebab.columnClass,
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
      title: 'Status',
      sortFunc: 'status.state',
      transforms: [sortable],
      props: { className: tableColumnClasses[1] },
    },
    {
      title: 'AccessMode',
      sortFunc: 'spec.traits.accessModes',
      transforms: [sortable],
      props: { className: tableColumnClasses[2] },
    },
    /*
    {
      title: 'StorageType',
      sortFunc: 'spec.traits.type',
      transforms: [sortable],
      props: { className: tableColumnClasses[2] },
    },*/
    {
        title: 'Filesystem',
        sortFunc: 'spec.traits.parameters["csi.storage.k8s.io/fstype"]',
        transforms: [sortable],
        props: { className: tableColumnClasses[3] },
    },
    {
        title: 'PerfLevel',
        sortFunc: 'spec.traits.perf.perfLevel',
        transforms: [sortable],
        props: { className: tableColumnClasses[4] },
    },
    {
      title: 'Encryption',
      sortField: 'spec.traits.security.encryptionEnabled',
      transforms: [sortable],
      props: { className: tableColumnClasses[5] },
    },
    {
      title: 'Compression',
      sortField: 'spec.traits.capacitySaving.compressionEnabled',
      transforms: [sortable],
      props: { className: tableColumnClasses[6] },
    },
    {
        title: 'SnapshotSupported',
        sortField: 'spec.traits.dataProtection.snapshotEnabled',
        transforms: [sortable],
        props: { className: tableColumnClasses[7] },
      },
    {
      title: 'Related StorageClass',
      sortField: 'spec.storageclass.name',
      transforms: [sortable],
      id: 'storageclass',
      props: { className: tableColumnClasses[8] },
    },
    {
      title: '',
      props: { className: tableColumnClasses[9] },
    },
  ].filter((item) => !disableItems[item.title]);

const Row: RowFunction<StorageClassTraitKind> = ({ key, obj, style, index, customData }) => {
  const { name } = obj?.metadata || {};
  
  return (
    <TableRow id={obj?.metadata?.uid} index={index} trKey={key} style={style}>
      <TableData className={tableColumnClasses[0]}>
        <ResourceLink
          kind={referenceForModel(StorageClassTraitModel)}
          name={name}
        />
      </TableData>
      <TableData className={tableColumnClasses[1]}>
        <Status status={obj.status?.state} />
      </TableData>
      <TableData className={tableColumnClasses[2]}>
      <Status status={obj.spec.traits?.accessModes?.join(",")} />
      </TableData>
      <TableData className={tableColumnClasses[3]}>
        <Status status={obj.spec.traits?.parameters?.["csi.storage.k8s.io/fstype"]} />
      </TableData>
      <TableData className={tableColumnClasses[4]}>
        <Status status={obj.spec.traits?.perf?.perfLevel} />
      </TableData>
      <TableData className={tableColumnClasses[5]}>
        <Status status={obj.spec.traits?.security?.encryptionEnabled?.toString()} />
      </TableData>
      <TableData className={tableColumnClasses[6]}>
        <Status status={obj.spec.traits?.capacitySaving?.compressionEnabled?.toString()} />
      </TableData>
      <TableData className={tableColumnClasses[7]}>
        <Status status={obj.spec.traits?.dataProtection?.snapshotEnabled?.toString()} />
      </TableData>
      <TableData className={tableColumnClasses[8]} columnID="storageclass">
        <ResourceLink kind={StorageClassModel.kind} name={obj.spec.storageclass?.name} />
      </TableData>
      <TableData className={tableColumnClasses[9]}>
        <ResourceKebab
          kind={referenceForModel(StorageClassTraitModel)}
          resource={obj}
          actions={menuActions}
        />
      </TableData>
    </TableRow>
  );
};

const StorageClassTraitTable: React.FC<StorageClassTraitTableProps> = (props) => (
  <Table
    {...props}
    aria-label="StorageClass Trait Table"
    Header={Header(props.customData.disableItems)}
    Row={Row}
    virtualize
  />
);

export const StorageClassTraitPage: React.FC<StorageClassTraitPageProps> = (props) => {
  const canListVSC = useFlag(FLAGS.CAN_LIST_VSC);
  //const namespace = props.namespace || props.match?.params?.ns || 'all-namespaces';
  const createProps = {
    //to: `/k8s/${namespace === 'all-namespaces' ? namespace : `ns/${namespace}`}/${
    //to: `/k8s/${namespace === 'all-namespaces' ? 'ns/default' : `ns/${namespace}`}/${
    to: `/k8s/cluster/${
      props.match?.params?.plural ||referenceForModel(StorageClassTraitModel)
    //}/~new/form`, tbd
    }/~new`,
  };

  const [sct] = useK8sWatchResource(sctResource);
  const allAccessMode=() =>{
    const tmpSet = new Set(_.map(sct, 'spec.traits.accessMode'));
    const tmpArray = [...tmpSet];
    return tmpArray;
  }
  const accessModeTmp = allAccessMode();
  const accessModeItems = accessModeTmp.map(v => v === undefined ? 'Unknown' : v);
  /*
  const allStorageType=() =>{
    const tmpSet = new Set(_.map(sct, 'spec.traits.type'));
    const tmpArray = [...tmpSet];
    return tmpArray;
  }
  const storageTypeTmp = allStorageType();
  const storageTypeItems = storageTypeTmp.map(v => v === undefined ? 'Unknown' : v);
  */
  const allFilesystem=() =>{
    const tmpSet = new Set(_.map(sct, 'spec.traits.parameters["csi.storage.k8s.io/fstype"]'));
    const tmpArray = [...tmpSet];
    return tmpArray;
  }
  const filesystemTmp = allFilesystem();
  const filesystemItems = filesystemTmp.map(v => v === undefined ? 'Unknown' : v);
  const allPerfLevel=() =>{
    const tmpSet = new Set(_.map(sct, 'spec.traits.perf.perfLevel'));
    const tmpArray = [...tmpSet];
    return tmpArray;
  }
  const perfLevelTmp = allPerfLevel();
  const perfLevelItems = perfLevelTmp.map(v => v === undefined ? 'Unknown' : v);
    /*
    const storageClassTraitAccessMode = ({ sct }: { sct?: StorageClassTraitKind}) => {
    const accessMode = sct?.spec.traits?.accessMode;
    return accessMode ? accessMode : 'Unknown';
    };
    */

  const storageClassTraitStatusFilters = [
    {
      filterGroupName: 'Status',
      type: 'storageclassTrait-status',
      reducer:(sct) => sct.status?.state || "statusUnknown",
      items: [
        { id: 'online', title: 'online' },
        { id: 'offline', title: 'offline' },
        { id: 'degraded', title: 'degraded' },
        { id: 'statusUnknown', title: 'Unknown' },
      ],
    },
    {
        filterGroupName: 'AccessMode',
        type: 'storageclassTrait-accessMode',
        //reducer: storageClassTraitAccessMode,
        reducer:(sct) => sct.spec.traits?.accessModes || "Unknown",
        items:  _.map(accessModeItems, (phase) => ({
            id: phase,
            title: phase,
        })),
    },
    /*
    {
        filterGroupName: 'StorageType',
        type: 'storageclassTrait-storageType',
        reducer:(sct) => sct.spec.traits?.type || "Unknown",
        items:  _.map(storageTypeItems, (phase) => ({
            id: phase,
            title: phase,
        })),
    },*/
    {
        filterGroupName: 'Filesystem',
        type: 'storageclassTrait-filesystem',
        reducer:(sct) => sct.spec.traits?.parameters?.["csi.storage.k8s.io/fstype"] || "Unknown",
        items:  _.map(filesystemItems, (phase) => ({
            id: phase,
            title: phase,
        })),
    },
    {
        filterGroupName: 'PerfLevel',
        type: 'storageclassTrait-perfLevel',
        reducer:(sct) => sct.spec.traits?.perf?.perfLevel || "Unknown",
        items:  _.map(perfLevelItems, (phase) => ({
            id: phase,
            title: phase,
        })),
    },
    {
        filterGroupName: 'Encryption',
        type: 'storageclassTrait-encryption',
        reducer:(sct) => 'encryption' + (sct.spec.traits?.security?.encryptionEnabled?.toString() || "Unknown"),
        items: [
            { id: 'encryptiontrue', title: 'true' },
            { id: 'encryptionfalse', title: 'false' },
            { id: 'encryptionUnknown', title: 'Unknown' },
          ],
    },
    {
        filterGroupName: 'Compression',
        type: 'storageclassTrait-compression',
        reducer:(sct) => 'compression' + (sct.spec.traits?.capacitySaving?.compressionEnabled?.toString() || "Unknown"),
        items:  [
            { id: 'compressiontrue', title: 'true' },
            { id: 'compressionfalse', title: 'false' },
            { id: 'compressionUnknown', title: 'Unknown' },
          ],
    },
  ];

  return (
    <ListPage
      {...props}
      kind={referenceForModel(StorageClassTraitModel)}
      ListComponent={StorageClassTraitTable}
      rowFilters={storageClassTraitStatusFilters}
      canCreate
      createProps={createProps}
      badge={getBadgeFromType(BadgeType.TECH)}
      customData={{ disableItems: { 'Snapshot Content': !canListVSC } }}
    />
  );
};

type StorageClassTraitPageProps = {
  namespace?: string;
  match: match<{ ns?: string; plural?: string }>;
};

type StorageClassTraitTableProps = {
  customData: { [key: string]: any };
};

export default StorageClassTraitPage;
