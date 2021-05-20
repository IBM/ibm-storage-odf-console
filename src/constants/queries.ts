import * as _ from 'lodash';
import { ProjectModel, PodModel, StorageClassModel } from '@console/internal/models';
import { STORAGE_CLASSES, PROJECTS, PODS } from '.';
import { StorageInstanceKind } from '../types';

export enum StorageDashboardQuery {
  CEPH_PG_CLEAN_AND_ACTIVE_QUERY = 'CEPH_PG_CLEAN_AND_ACTIVE_QUERY',
  CEPH_PG_TOTAL_QUERY = 'CEPH_PG_TOTAL_QUERY',
  UTILIZATION_CAPACITY_QUERY = 'UTILIZATION_CAPACITY_QUERY',
  UTILIZATION_IOPS_QUERY = 'UTILIZATION_IOPS_QUERY',
  UTILIZATION_LATENCY_QUERY = 'UTILIZATION_LATENCY_QUERY',
  UTILIZATION_THROUGHPUT_QUERY = 'UTILIZATION_THROUGHPUT_QUERY',
  UTILIZATION_RECOVERY_RATE_QUERY = 'UTILIZATION_RECOVERY_RATE_QUERY',
  CEPH_CAPACITY_TOTAL = 'CAPACITY_TOTAL',
  PODS_TOTAL_USED = 'PODS_TOTAL_USED',
  PODS_BY_USED = 'PODS_BY_USED',
  PROJECTS_TOTAL_USED = 'PROJECTS_TOTAL_USED',
  PROJECTS_BY_USED = 'PROJECTS_BY_USED',
  STORAGE_CLASSES_TOTAL_USED = 'STORAGE_CLASSES_TOTAL_USED',
  STORAGE_CLASSES_BY_USED = 'STORAGE_CLASSES_BY_USED',
  STORAGE_CEPH_CAPACITY_REQUESTED_QUERY = 'STORAGE_CEPH_CAPACITY_REQUESTED_QUERY',
  STORAGE_CEPH_CAPACITY_USED_QUERY = 'STORAGE_CEPH_CAPACITY_USED_QUERY',
  RESILIENCY_PROGRESS = 'RESILIENCY_PROGRESS',
  NODES_BY_USED = 'NODES_BY_USED',
  USED_CAPACITY = 'USED_CAPACITY',
  REQUESTED_CAPACITY = 'REQUESTED_CAPACITY',
  POOL_CAPACITY_RATIO = 'POOL_CAPACITY_RATIO',
  POOL_SAVED_CAPACITY = 'POOL_SAVED_CAPACITY',
  TotalFreeCapacity  = 'TotalFreeCapacity',
  TotalUsedCapacity  = 'TotalUsedCapacity',
  TotalReadIOPS         = 'TotalReadIOPS',
  TotalWriteIOPS        = 'TotalWriteIOPS',
  TotalReadBW         = 'TotalReadBW',
  TotalWriteBW        = 'TotalWriteBW',
  TotalReadRespTime   = 'TotalReadRespTime',
  TotalWriteRespTime  = 'TotalWriteRespTime',
  UsedCapacityBeforeReduction = 'UsedCapacityBeforeReduction',
  UsedCapacityAfterReduction  = 'UsedCapacityAfterReduction',
  TotalCapacity  = 'TotalCapacity',
  RAW_CAPACITY_TOTAL = 'RAW_TOTAL_CAPACITY',
  RAW_CAPACITY_USED = 'RAW_CAPACITY_USED',
}

export const INDEPENDENT_UTILIZATION_QUERIES = {
  [StorageDashboardQuery.REQUESTED_CAPACITY]:
    'sum((kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_right() kube_pod_spec_volumes_persistentvolumeclaims_info) * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"(.*rbd.csi.ceph.com)|(.*cephfs.csi.ceph.com)|(ceph.rook.io/block)"}))',
  [StorageDashboardQuery.USED_CAPACITY]:
    'sum((kubelet_volume_stats_used_bytes * on (namespace,persistentvolumeclaim) group_right() kube_pod_spec_volumes_persistentvolumeclaims_info) * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"(.*rbd.csi.ceph.com)|(.*cephfs.csi.ceph.com)|(ceph.rook.io/block)"}))',
};

export const DATA_RESILIENCY_QUERY = {
  [StorageDashboardQuery.RESILIENCY_PROGRESS]: '(ceph_pg_clean and ceph_pg_active)/ceph_pg_total',
};

export const CAPACITY_USAGE_QUERIES = {
  [StorageDashboardQuery.CEPH_CAPACITY_TOTAL]: 'ceph_cluster_total_bytes',
  [StorageDashboardQuery.TotalUsedCapacity]: 'ceph_cluster_total_used_bytes',
  [StorageDashboardQuery.STORAGE_CEPH_CAPACITY_REQUESTED_QUERY]:
    'sum((kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_right() kube_pod_spec_volumes_persistentvolumeclaims_info) * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"(.*rbd.csi.ceph.com)|(.*cephfs.csi.ceph.com)|(ceph.rook.io/block)"}))',
  [StorageDashboardQuery.STORAGE_CEPH_CAPACITY_USED_QUERY]:
    'sum((kubelet_volume_stats_used_bytes * on (namespace,persistentvolumeclaim) group_right() kube_pod_spec_volumes_persistentvolumeclaims_info) * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"(.*rbd.csi.ceph.com)|(.*cephfs.csi.ceph.com)|(ceph.rook.io/block)"}))',
};

export const CAPACITY_BREAKDOWN_QUERIES = {
  [StorageDashboardQuery.PROJECTS_TOTAL_USED]:
    'sum(sum(0.75 * kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"block.csi.ibm.com"})) by (namespace))',
  [StorageDashboardQuery.PROJECTS_BY_USED]:
    'sum(0.75 * kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"block.csi.ibm.com"})) by (namespace)',
  [StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED]:
    'sum(sum(0.75 * kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass) group_left(provisioner) kube_storageclass_info {provisioner=~"block.csi.ibm.com"})) by (storageclass, provisioner))',
  [StorageDashboardQuery.STORAGE_CLASSES_BY_USED]:
    'sum(0.75 * kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass) group_left(provisioner) kube_storageclass_info {provisioner=~"block.csi.ibm.com"})) by (storageclass, provisioner)',
  [StorageDashboardQuery.PODS_TOTAL_USED]:
    'sum((0.75 * kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_right() (kube_pod_info * on(namespace, pod)  group_right(node) kube_pod_spec_volumes_persistentvolumeclaims_info)) * on(namespace,persistentvolumeclaim) group_left(provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"block.csi.ibm.com"}))',
  [StorageDashboardQuery.PODS_BY_USED]:
    '(0.75 * kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_right() (kube_pod_info * on(namespace, pod)  group_right(node) kube_pod_spec_volumes_persistentvolumeclaims_info)) * on(namespace,persistentvolumeclaim) group_left(provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"block.csi.ibm.com"})',
  [StorageDashboardQuery.TotalUsedCapacity]:
    '(flashsystem_perf_total_used_capacity)',
  [StorageDashboardQuery.TotalFreeCapacity]:
    'flashsystem_perf_total_free_space',
};

export const CAPACITY_BREAKDOWN_QUERIES_Customized = (storage: StorageInstanceKind, queryItem: string):string => {
  const totalUsedCapacity = _.get(storage, ['spec', 'driverEndpoint', 'metrics', StorageDashboardQuery.TotalUsedCapacity]);
  const totalFreeCapacity = _.get(storage, ['spec', 'driverEndpoint', 'metrics', StorageDashboardQuery.TotalFreeCapacity]);
  const currentProvisioner = _.get(storage, ['spec', 'driverEndpoint', 'parameters', 'provisioner']);
  switch(queryItem){
    // change kube_persistentvolumeclaim_resource_requests_storage_bytes
    // to kubelet_volume_stats_used_bytes
    case StorageDashboardQuery.PROJECTS_TOTAL_USED:{
      return `sum(sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"})) by (namespace))`;
      }
    case StorageDashboardQuery.PROJECTS_BY_USED:{
      return `sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"})) by (namespace)`;
      }
    case StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED:{
      return `sum(sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass) group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"})) by (storageclass, provisioner))`;
      }
    case StorageDashboardQuery.STORAGE_CLASSES_BY_USED:{
      return `sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass) group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"})) by (storageclass, provisioner)`;
      }
    case StorageDashboardQuery.PODS_TOTAL_USED:{
      return `sum((kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_right() (kube_pod_info * on(namespace, pod)  group_right(node) kube_pod_spec_volumes_persistentvolumeclaims_info)) * on(namespace,persistentvolumeclaim) group_left(provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"}))`;
      }
    case StorageDashboardQuery.PODS_BY_USED:{
      return `sum((kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_right() (kube_pod_info * on(namespace, pod)  group_right(node) kube_pod_spec_volumes_persistentvolumeclaims_info)) * on(namespace,persistentvolumeclaim) group_left(provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"})) by (pod)`;
      }
    case StorageDashboardQuery.USED_CAPACITY:{
      return `sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"}))`;
      }
    case StorageDashboardQuery.TotalUsedCapacity:{
      return `${totalUsedCapacity}`;
      }
    case StorageDashboardQuery.TotalFreeCapacity:{
      return `${totalFreeCapacity}`;
      }
    case StorageDashboardQuery.TotalCapacity:{
      return `${totalFreeCapacity}+${totalUsedCapacity}`;
      }
  }
};
export const CAPACITY_BREAKDOWN_QUERIES_ODF = (label: string, queryItem: string):string => {
    const currentProvisioner = "block.csi.ibm.com"; //todo
    switch(queryItem){
    // change kube_persistentvolumeclaim_resource_requests_storage_bytes
    // to kubelet_volume_stats_used_bytes
    case StorageDashboardQuery.PROJECTS_TOTAL_USED:{
      return `sum(sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"})) by (namespace))`;
      }
    case StorageDashboardQuery.PROJECTS_BY_USED:{
      return `sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"})) by (namespace)`;
      }
    case StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED:{
      return `sum(sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass) group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"})) by (storageclass, provisioner))`;
      }
    case StorageDashboardQuery.STORAGE_CLASSES_BY_USED:{
      return `sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass) group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"})) by (storageclass, provisioner)`;
      }
    case StorageDashboardQuery.PODS_TOTAL_USED:{
      return `sum((kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_right() (kube_pod_info * on(namespace, pod)  group_right(node) kube_pod_spec_volumes_persistentvolumeclaims_info)) * on(namespace,persistentvolumeclaim) group_left(provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"}))`;
      }
    case StorageDashboardQuery.PODS_BY_USED:{
      return `sum((kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_right() (kube_pod_info * on(namespace, pod)  group_right(node) kube_pod_spec_volumes_persistentvolumeclaims_info)) * on(namespace,persistentvolumeclaim) group_left(provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"})) by (pod)`;
      }
    case StorageDashboardQuery.USED_CAPACITY:{
      return `sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~"${currentProvisioner}"}))`;
      }
    case StorageDashboardQuery.TotalUsedCapacity:{
      return `sum(pool_capacity_used{container='${label}'})`;
      }
    case StorageDashboardQuery.TotalFreeCapacity:{
      return `sum(pool_capacity_usable{container='${label}'})`;
      }
    case StorageDashboardQuery.TotalCapacity:{
      return `sum(pool_capacity_usable{container='${label}'}) + sum(pool_capacity_used{container='${label}'})`;
      }
    case StorageDashboardQuery.TotalReadIOPS:{
      return `subsystem_rd_iops{container='${label}'}`;
      }
    case StorageDashboardQuery.TotalWriteIOPS:{
      return `subsystem_wr_iops{container='${label}'}`;
      }
    case StorageDashboardQuery.TotalReadRespTime:{
      return `subsystem_rd_latency{container='${label}'}`;
      }
    case StorageDashboardQuery.TotalWriteRespTime:{
      return `subsystem_wr_latency{container='${label}'}`;
      }
    case StorageDashboardQuery.TotalReadBW:{
      return `subsystem_rd_bytes{container='${label}'}`;
      }
    case StorageDashboardQuery.TotalWriteBW:{
      return `subsystem_wr_bytes{container='${label}'}`;
      }
  }
};

export const POOL_STORAGE_EFFICIENCY_QUERIES = {
  [StorageDashboardQuery.POOL_CAPACITY_RATIO]:
    'sum(flashsystem_perf_used_capacity_before_reduction) / clamp_min(sum(flashsystem_perf_used_capacity_after_reduction),1)',
  [StorageDashboardQuery.POOL_SAVED_CAPACITY]:
    '(sum(flashsystem_perf_used_capacity_before_reduction) - sum(flashsystem_perf_used_capacity_after_reduction))',
};
export const POOL_STORAGE_EFFICIENCY_QUERIES_Customized = (storage: StorageInstanceKind) => {
  const usedCapacityBeforeReduction = _.get(storage, ['spec', 'driverEndpoint', 'metrics', StorageDashboardQuery.UsedCapacityBeforeReduction]);
  const usedCapacityAfterReduction = _.get(storage, ['spec', 'driverEndpoint', 'metrics', StorageDashboardQuery.UsedCapacityAfterReduction]);
  return {
  [StorageDashboardQuery.POOL_CAPACITY_RATIO]:
    `sum(${usedCapacityBeforeReduction}) / clamp_min(sum(${usedCapacityAfterReduction}),1)`,
  [StorageDashboardQuery.POOL_SAVED_CAPACITY]:
    `(sum(${usedCapacityBeforeReduction}) - sum(${usedCapacityAfterReduction}))`,
  };
};
export const POOL_STORAGE_EFFICIENCY_QUERIES_ODF = (label: string) => {
  return {
  [StorageDashboardQuery.POOL_CAPACITY_RATIO]:
    `sum(pool_efficiency_savings{container='${label}'}) / (sum(volume_capacity_used{container='${label}'}) + sum(pool_efficiency_savings{container='${label}'}))`,
  [StorageDashboardQuery.POOL_SAVED_CAPACITY]:
    `sum(pool_efficiency_savings{container='${label}'})`,
  };
};

export const breakdownQueryMap = {
  [PROJECTS]: {
    model: ProjectModel,
    metric: 'namespace',
    queries: {
      [StorageDashboardQuery.PROJECTS_BY_USED]: `(topk(6,(${
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PROJECTS_BY_USED]
      })))`,
      [StorageDashboardQuery.PROJECTS_TOTAL_USED]:
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PROJECTS_TOTAL_USED],
      //[StorageDashboardQuery.TotalFreeCapacity]:
        //CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.TotalFreeCapacity],
      [StorageDashboardQuery.USED_CAPACITY]:
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.USED_CAPACITY],
    },
  },
  [STORAGE_CLASSES]: {
    model: StorageClassModel,
    metric: 'storageclass',
    queries: {
      [StorageDashboardQuery.STORAGE_CLASSES_BY_USED]: `(topk(6,(${
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.STORAGE_CLASSES_BY_USED]
      })))`,
      [StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED]:
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED],
      //[StorageDashboardQuery.TotalFreeCapacity]:
        //CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.TotalFreeCapacity],
      [StorageDashboardQuery.USED_CAPACITY]:
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.USED_CAPACITY],
    },
  },
  [PODS]: {
    model: PodModel,
    metric: 'pod',
    queries: {
      [StorageDashboardQuery.PODS_BY_USED]: `(topk(6,(${
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PODS_BY_USED]
      })))`,
      [StorageDashboardQuery.PODS_TOTAL_USED]:
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PODS_TOTAL_USED],
      //[StorageDashboardQuery.TotalFreeCapacity]:
        //CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.TotalFreeCapacity],
      [StorageDashboardQuery.USED_CAPACITY]:
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.USED_CAPACITY],
    },
  },
};

export const BreakdownQueryMapCustomized = (storage: StorageInstanceKind, queryType: string) => {
  switch(queryType) { 
    case PROJECTS: return {
      model: ProjectModel,
      metric: 'namespace',
      queries: {
        [StorageDashboardQuery.PROJECTS_BY_USED]: `(topk(6,(${
          CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.PROJECTS_BY_USED)
        })))`,
        [StorageDashboardQuery.PROJECTS_TOTAL_USED]:
          CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.PROJECTS_TOTAL_USED),
        //[StorageDashboardQuery.TotalFreeCapacity]:
          //CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.TotalFreeCapacity),
        [StorageDashboardQuery.USED_CAPACITY]:
          CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.USED_CAPACITY),
        },
      }; 
     
    case STORAGE_CLASSES: return {
      model: StorageClassModel,
      metric: 'storageclass',
      queries: {
          [StorageDashboardQuery.STORAGE_CLASSES_BY_USED]: `(topk(6,(${
            CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.STORAGE_CLASSES_BY_USED)
          })))`,
          [StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED]:
            CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED),
          //[StorageDashboardQuery.TotalFreeCapacity]:
            //CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.TotalFreeCapacity),
          [StorageDashboardQuery.USED_CAPACITY]:
            CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.USED_CAPACITY),
        },
    };
    case PODS: return {
      model: PodModel,
      metric: 'pod',
      queries: {
        [StorageDashboardQuery.PODS_BY_USED]: `(topk(6,(${
          CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.PODS_BY_USED)
        })))`,
        [StorageDashboardQuery.PODS_TOTAL_USED]:
          CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.PODS_TOTAL_USED),
        //[StorageDashboardQuery.TotalFreeCapacity]:
          //CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.TotalFreeCapacity),
        [StorageDashboardQuery.USED_CAPACITY]:
          CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.USED_CAPACITY),
      }, }; 
  }
};

export const BreakdownQueryMapODF = (label: string, queryType: string) => {
  switch(queryType) { 
    case PROJECTS: return {
      model: ProjectModel,
      metric: 'namespace',
      queries: {
        [StorageDashboardQuery.PROJECTS_BY_USED]: `(topk(6,(${
          CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.PROJECTS_BY_USED)
        })))`,
        [StorageDashboardQuery.PROJECTS_TOTAL_USED]:
          CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.PROJECTS_TOTAL_USED),
        //[StorageDashboardQuery.TotalFreeCapacity]:
          //CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.TotalFreeCapacity),
        [StorageDashboardQuery.USED_CAPACITY]:
          CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.USED_CAPACITY),
        },
      }; 
     
    case STORAGE_CLASSES: return {
      model: StorageClassModel,
      metric: 'storageclass',
      queries: {
          [StorageDashboardQuery.STORAGE_CLASSES_BY_USED]: `(topk(6,(${
            CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.STORAGE_CLASSES_BY_USED)
          })))`,
          [StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED]:
            CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED),
          //[StorageDashboardQuery.TotalFreeCapacity]:
            //CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.TotalFreeCapacity),
          [StorageDashboardQuery.USED_CAPACITY]:
            CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.USED_CAPACITY),
        },
    };
    case PODS: return {
      model: PodModel,
      metric: 'pod',
      queries: {
        [StorageDashboardQuery.PODS_BY_USED]: `(topk(6,(${
          CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.PODS_BY_USED)
        })))`,
        [StorageDashboardQuery.PODS_TOTAL_USED]:
          CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.PODS_TOTAL_USED),
        //[StorageDashboardQuery.TotalFreeCapacity]:
          //CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.TotalFreeCapacity),
        [StorageDashboardQuery.USED_CAPACITY]:
          CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.USED_CAPACITY),
      }, }; 
  }
};

export const breakdownIndependentQueryMap = {
  [PROJECTS]: {
    model: ProjectModel,
    metric: 'namespace',
    queries: {
      [StorageDashboardQuery.PROJECTS_BY_USED]: `(topk(6,(${
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PROJECTS_BY_USED]
      })))`,
      [StorageDashboardQuery.PROJECTS_TOTAL_USED]:
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PROJECTS_TOTAL_USED],
    },
  },
  [STORAGE_CLASSES]: {
    model: StorageClassModel,
    metric: 'storageclass',
    queries: {
      [StorageDashboardQuery.STORAGE_CLASSES_BY_USED]: `(topk(6,(${
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.STORAGE_CLASSES_BY_USED]
      })))`,
      [StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED]:
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED],
    },
  },
  [PODS]: {
    model: PodModel,
    metric: 'pod',
    queries: {
      [StorageDashboardQuery.PODS_BY_USED]: `(topk(6,(${
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PODS_BY_USED]
      })))`,
      [StorageDashboardQuery.PODS_TOTAL_USED]:
        CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PODS_TOTAL_USED],
    },
  },
};

export const utilizationPopoverQueryMap = [
  {
    model: ProjectModel,
    metric: 'namespace',
    query: `(sort_desc(topk(25,(${
      CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PROJECTS_BY_USED]
    }))))`,
  },
  {
    model: StorageClassModel,
    metric: 'storageclass',
    query: `(sort_desc(topk(25,(${
      CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.STORAGE_CLASSES_BY_USED]
    }))))`,
  },
  {
    model: PodModel,
    metric: 'pod',
    query: `(sort_desc(topk(25, (${
      CAPACITY_BREAKDOWN_QUERIES[StorageDashboardQuery.PODS_BY_USED]
    }))))`,
  },
];

export const utilizationPopoverQueryMapCustomized =  (storage: StorageInstanceKind) => {
  return [
  {
    model: ProjectModel,
    metric: 'namespace',
    query: `(sort_desc(topk(25,(${
      CAPACITY_BREAKDOWN_QUERIES_Customized(storage,StorageDashboardQuery.PROJECTS_BY_USED)
    }))))`,
  },
  {
    model: StorageClassModel,
    metric: 'storageclass',
    query: `(sort_desc(topk(25,(${
      CAPACITY_BREAKDOWN_QUERIES_Customized(storage,StorageDashboardQuery.STORAGE_CLASSES_BY_USED)
    }))))`,
  },
  {
    model: PodModel,
    metric: 'pod',
    query: `(sort_desc(topk(25, (${
      CAPACITY_BREAKDOWN_QUERIES_Customized(storage,StorageDashboardQuery.PODS_BY_USED)
    }))))`,
  },
  ]
};
export const utilizationPopoverQueryMapODF =  (label: string) => {
  return [
  {
    model: ProjectModel,
    metric: 'namespace',
    query: `(sort_desc(topk(25,(${
      CAPACITY_BREAKDOWN_QUERIES_ODF(label,StorageDashboardQuery.PROJECTS_BY_USED)
    }))))`,
  },
  {
    model: StorageClassModel,
    metric: 'storageclass',
    query: `(sort_desc(topk(25,(${
      CAPACITY_BREAKDOWN_QUERIES_ODF(label,StorageDashboardQuery.STORAGE_CLASSES_BY_USED)
    }))))`,
  },
  {
    model: PodModel,
    metric: 'pod',
    query: `(sort_desc(topk(25, (${
      CAPACITY_BREAKDOWN_QUERIES_ODF(label,StorageDashboardQuery.PODS_BY_USED)
    }))))`,
  },
  ]
};
export const CAPACITY_INFO_QUERIES = (storage: StorageInstanceKind) => {
  if (storage) {
    return {
      [StorageDashboardQuery.RAW_CAPACITY_TOTAL]: CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.TotalCapacity),
      [StorageDashboardQuery.RAW_CAPACITY_USED]: CAPACITY_BREAKDOWN_QUERIES_Customized(storage, StorageDashboardQuery.TotalUsedCapacity),
    };
  } else {
    return {
      [StorageDashboardQuery.RAW_CAPACITY_TOTAL]: 'storage not loaded',
      [StorageDashboardQuery.RAW_CAPACITY_USED]: 'storage not loaded',
    };
  }
};
export const CAPACITY_INFO_QUERIES_ODF = (label: string) => {
  return {
    [StorageDashboardQuery.RAW_CAPACITY_TOTAL]: CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.TotalCapacity),
    [StorageDashboardQuery.RAW_CAPACITY_USED]: CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.TotalUsedCapacity),
  };
};

export const UTILIZATION_QUERY_ODF = (label: string, func: string) => {
  switch(func){
    case StorageDashboardQuery.UTILIZATION_CAPACITY_QUERY: 
      return [{query: CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.TotalUsedCapacity), desc: 'Used'},
        {query: CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.TotalFreeCapacity), desc: 'Available'}];
    case StorageDashboardQuery.UTILIZATION_IOPS_QUERY:
      return [{query: CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.TotalReadIOPS) , desc: 'Read'},
        {query: CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.TotalWriteIOPS), desc: 'Write'}];
    case StorageDashboardQuery.UTILIZATION_LATENCY_QUERY:
      return [{query: CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.TotalReadRespTime), desc: 'Read'},
        {query: CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.TotalWriteRespTime), desc: 'Write'}];
    case StorageDashboardQuery.UTILIZATION_THROUGHPUT_QUERY:
      return [{query: CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.TotalReadBW), desc: 'Read'},
        {query: CAPACITY_BREAKDOWN_QUERIES_ODF(label, StorageDashboardQuery.TotalWriteBW), desc: 'Write'}];
  }
};

export const getPVCUsedCapacityQuery = (pvcName: string): string =>
  `kubelet_volume_stats_used_bytes{persistentvolumeclaim='${pvcName}'}`;

export const osdDiskInfoMetric = _.template(
  `ceph_disk_occupation{exported_instance=~'<%= nodeName %>'}`,
);
