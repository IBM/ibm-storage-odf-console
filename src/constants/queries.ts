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
import * as _ from 'lodash';
import { ProjectModel, PodModel, StorageClassModel } from '@console/internal/models';
import { STORAGE_CLASSES, PROJECTS, PODS } from '.';

export enum StorageDashboardQuery {
  UTILIZATION_CAPACITY_QUERY = 'UTILIZATION_CAPACITY_QUERY',
  UTILIZATION_IOPS_QUERY = 'UTILIZATION_IOPS_QUERY',
  UTILIZATION_LATENCY_QUERY = 'UTILIZATION_LATENCY_QUERY',
  UTILIZATION_THROUGHPUT_QUERY = 'UTILIZATION_THROUGHPUT_QUERY',
  UTILIZATION_RECOVERY_RATE_QUERY = 'UTILIZATION_RECOVERY_RATE_QUERY',
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

export const POOL_STORAGE_EFFICIENCY_QUERIES_ODF = (label: string) => {
  return {
  [StorageDashboardQuery.POOL_CAPACITY_RATIO]:
    `sum(pool_efficiency_savings{container='${label}'}) / (sum(volume_capacity_used{container='${label}'}) + sum(pool_efficiency_savings{container='${label}'}))`,
  [StorageDashboardQuery.POOL_SAVED_CAPACITY]:
    `sum(pool_efficiency_savings{container='${label}'})`,
  };
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
