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
import { ProjectModel, PodModel, StorageClassModel } from "../models";
import { STORAGE_CLASSES, PROJECTS, PODS } from "./constants";

export enum StorageDashboardQuery {
  PODS_TOTAL_USED = "PODS_TOTAL_USED",
  PODS_BY_USED = "PODS_BY_USED",
  PROJECTS_TOTAL_USED = "PROJECTS_TOTAL_USED",
  PROJECTS_BY_USED = "PROJECTS_BY_USED",
  STORAGE_CLASSES_TOTAL_USED = "STORAGE_CLASSES_TOTAL_USED",
  STORAGE_CLASSES_BY_USED = "STORAGE_CLASSES_BY_USED",
  USED_CAPACITY = "USED_CAPACITY",
  UTILIZATION_CAPACITY_QUERY = "UTILIZATION_CAPACITY_QUERY",
  UTILIZATION_IOPS_QUERY = "UTILIZATION_IOPS_QUERY",
  UTILIZATION_LATENCY_QUERY = "UTILIZATION_LATENCY_QUERY",
  UTILIZATION_THROUGHPUT_QUERY = "UTILIZATION_THROUGHPUT_QUERY",

  PoolPhysicalTotalCapacity = "PoolPhysicalTotalCapacity",
  PoolPhysicalFreeCapacity = "PoolPhysicalFreeCapacity",
  PoolPhysicalUsedCapacity = "PoolPhysicalUsedCapacity",

  PoolLogicalTotalCapacity = "PoolLogicalTotalCapacity",
  PoolLogicalFreeCapacity = "PoolLogicalFreeCapacity",
  PoolLogicalUsedCapacity = "PoolLogicalUsedCapacity",

  SystemPhysicalTotalCapacity = "SystemPhysicalTotalCapacity",
  SystemPhysicalFreeCapacity = "SystemPhysicalFreeCapacity",
  SystemPhysicalUsedCapacity = "SystemPhysicalUsedCapacity",

  SystemTotalEfficiencySaving = "SystemTotalEfficiencySaving",

  TotalReadIOPS = "TotalReadIOPS",
  TotalWriteIOPS = "TotalWriteIOPS",
  TotalReadBW = "TotalReadBW",
  TotalWriteBW = "TotalWriteBW",
  TotalReadRespTime = "TotalReadRespTime",
  TotalWriteRespTime = "TotalWriteRespTime",
}

export const FlASHSYSTEM_POOL_QUERIES = (
    label: string,
    pool_name: string,
    queryItem: string
): string => {

  switch (queryItem) {

    case StorageDashboardQuery.PoolPhysicalUsedCapacity: {
      return `flashsystem_pool_capacity_used_bytes{subsystem_name='${label}', pool_name='${pool_name}'}`;
    }
    case StorageDashboardQuery.PoolPhysicalFreeCapacity: {
      return `flashsystem_pool_capacity_usable_bytes{subsystem_name='${label}', pool_name='${pool_name}'}`;
    }
    case StorageDashboardQuery.PoolPhysicalTotalCapacity: {
      return `flashsystem_pool_capacity_usable_bytes{subsystem_name='${label}', pool_name='${pool_name}'} + 
      flashsystem_pool_capacity_used_bytes{subsystem_name='${label}', pool_name='${pool_name}'}`;
    }

    case StorageDashboardQuery.PoolLogicalUsedCapacity: {
      return `flashsystem_pool_logical_capacity_used_bytes{subsystem_name='${label}', pool_name='${pool_name}'}`;
    }
    case StorageDashboardQuery.PoolLogicalFreeCapacity: {
      return `flashsystem_pool_logical_capacity_usable_bytes{subsystem_name='${label}', pool_name='${pool_name}'}`;
    }
    case StorageDashboardQuery.PoolLogicalTotalCapacity: {
      return `flashsystem_pool_logical_capacity_usable_bytes{subsystem_name='${label}', pool_name='${pool_name}'} + 
      flashsystem_pool_logical_capacity_used_bytes{subsystem_name='${label}', pool_name='${pool_name}'}`;
    }

  }
};


export const FlASHSYSTEM_STORAGECLASS_QUERIES = (
    label: string,
    queryItem: string
): string => {

  const filteredPVByLabel = `label_replace((kube_persistentvolume_claim_ref * on(persistentvolume) group_right(name) kube_persistentvolume_labels{label_odf_fs_storage_system='${label}'}), "persistentvolumeclaim", "$1", "name", "(.+)")`
  const pvcWithPVResourceRequestsStorage = `(${filteredPVByLabel}) * on (persistentvolumeclaim) group_right(persistentvolume) kube_persistentvolumeclaim_resource_requests_storage_bytes`

  switch (queryItem) {
    case StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED: {
      return `sum(sum((${pvcWithPVResourceRequestsStorage}) * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass) group_left(provisioner) kube_storageclass_info )) by (storageclass, provisioner))`;
    }
    case StorageDashboardQuery.STORAGE_CLASSES_BY_USED: {
      return `sum((${pvcWithPVResourceRequestsStorage})* on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass) group_left(provisioner) kube_storageclass_info )) by (storageclass, provisioner)`;
    }
    case StorageDashboardQuery.USED_CAPACITY: {
      return `sum((${pvcWithPVResourceRequestsStorage}) * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info ))`;
    }
    case StorageDashboardQuery.PROJECTS_TOTAL_USED: {
      return `sum(sum((${pvcWithPVResourceRequestsStorage}) * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info )) by (namespace))`;
    }
    case StorageDashboardQuery.PROJECTS_BY_USED: {
      return `sum((${pvcWithPVResourceRequestsStorage}) * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info )) by (namespace)`;
    }
    case StorageDashboardQuery.PODS_TOTAL_USED: {
      return `sum(((${pvcWithPVResourceRequestsStorage}) * on (namespace,persistentvolumeclaim) group_right() (kube_pod_info * on(namespace, pod)  group_right(node) kube_pod_spec_volumes_persistentvolumeclaims_info)) * on(namespace,persistentvolumeclaim) group_left(provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info ))`;
    }
    case StorageDashboardQuery.PODS_BY_USED: {
      return `sum(((${pvcWithPVResourceRequestsStorage}) * on (namespace,persistentvolumeclaim) group_right() (kube_pod_info * on(namespace, pod)  group_right(node) kube_pod_spec_volumes_persistentvolumeclaims_info)) * on(namespace,persistentvolumeclaim) group_left(provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info )) by (pod)`;
    }

  }
};


export const FlASHSYSTEM_QUERIES = (
  label: string,
  queryItem: string
): string => {

  switch (queryItem) {
    // change kube_persistentvolumeclaim_resource_requests_storage_bytes
    // to kubelet_volume_stats_used_bytes
    case StorageDashboardQuery.SystemPhysicalUsedCapacity: {
      return `flashsystem_subsystem_physical_used_capacity_bytes{subsystem_name='${label}'}`;
    }
    case StorageDashboardQuery.SystemPhysicalFreeCapacity: {
      return `flashsystem_subsystem_physical_free_capacity_bytes{subsystem_name='${label}'}`;
    }
    case StorageDashboardQuery.SystemPhysicalTotalCapacity: {
      return `flashsystem_subsystem_physical_total_capacity_bytes{subsystem_name='${label}'}`;
    }
    case StorageDashboardQuery.TotalReadIOPS: {
      return `flashsystem_subsystem_rd_iops{subsystem_name='${label}'}`;
    }
    case StorageDashboardQuery.TotalWriteIOPS: {
      return `flashsystem_subsystem_wr_iops{subsystem_name='${label}'}`;
    }
    case StorageDashboardQuery.TotalReadRespTime: {
      return `flashsystem_subsystem_rd_latency_seconds{subsystem_name='${label}'}`;
    }
    case StorageDashboardQuery.TotalWriteRespTime: {
      return `flashsystem_subsystem_wr_latency_seconds{subsystem_name='${label}'}`;
    }
    case StorageDashboardQuery.TotalReadBW: {
      return `flashsystem_subsystem_rd_bytes{subsystem_name='${label}'}`;
    }
    case StorageDashboardQuery.TotalWriteBW: {
      return `flashsystem_subsystem_wr_bytes{subsystem_name='${label}'}`;
    }
    case StorageDashboardQuery.SystemTotalEfficiencySaving: {
      return `sum(flashsystem_pool_savings_bytes{subsystem_name='${label}'})`;
    }
  }
};

export const BreakdownQueryMapODF = (label: string, queryType: string) => {
  switch (queryType) {
    case PROJECTS:
      return {
        model: ProjectModel,
        metric: "namespace",
        queries: {
          [StorageDashboardQuery.PROJECTS_BY_USED]: `(topk(6,(${FlASHSYSTEM_STORAGECLASS_QUERIES(
              label, 
              StorageDashboardQuery.PROJECTS_BY_USED
          )})))`,
          [StorageDashboardQuery.PROJECTS_TOTAL_USED]: FlASHSYSTEM_STORAGECLASS_QUERIES(
              label,
              StorageDashboardQuery.PROJECTS_TOTAL_USED
          ),
          [StorageDashboardQuery.USED_CAPACITY]: FlASHSYSTEM_STORAGECLASS_QUERIES(
              label,
              StorageDashboardQuery.USED_CAPACITY
          ),
        },
      };

    case STORAGE_CLASSES:
      return {
        model: StorageClassModel,
        metric: "storageclass",
        queries: {
          [StorageDashboardQuery.STORAGE_CLASSES_BY_USED]: `(topk(6,(${FlASHSYSTEM_STORAGECLASS_QUERIES(
              label, 
              StorageDashboardQuery.STORAGE_CLASSES_BY_USED
          )})))`,
          [StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED]:
              FlASHSYSTEM_STORAGECLASS_QUERIES(
                  label,
                  StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED
            ),
          [StorageDashboardQuery.USED_CAPACITY]: FlASHSYSTEM_STORAGECLASS_QUERIES(
              label,
              StorageDashboardQuery.USED_CAPACITY
          ),
        },
      };
    case PODS:
      return {
        model: PodModel,
        metric: "pod",
        queries: {
          [StorageDashboardQuery.PODS_BY_USED]: `(topk(6,(${FlASHSYSTEM_STORAGECLASS_QUERIES(
              label, 
              StorageDashboardQuery.PODS_BY_USED
          )})))`,
          [StorageDashboardQuery.PODS_TOTAL_USED]: FlASHSYSTEM_STORAGECLASS_QUERIES(
              label,
              StorageDashboardQuery.PODS_TOTAL_USED
          ),
          [StorageDashboardQuery.USED_CAPACITY]: FlASHSYSTEM_STORAGECLASS_QUERIES(
              label,
              StorageDashboardQuery.USED_CAPACITY
          ),
        },
      };
  }
};

export const UTILIZATION_QUERY_ODF = (label: string, func: string) => {
  switch (func) {
    case StorageDashboardQuery.UTILIZATION_CAPACITY_QUERY:
      return [
        {
          query: FlASHSYSTEM_QUERIES(
              label,
              StorageDashboardQuery.SystemPhysicalUsedCapacity
          ),
          desc: "Used",
        },
        {
          query: FlASHSYSTEM_QUERIES(
              label,
              StorageDashboardQuery.SystemPhysicalFreeCapacity
          ),
          desc: "Available",
        },
        {
          query: FlASHSYSTEM_QUERIES(
              label,
              StorageDashboardQuery.SystemPhysicalTotalCapacity
          ),
          desc: "Total",
        },
      ];
    case StorageDashboardQuery.UTILIZATION_IOPS_QUERY:
      return [
        {
          query: FlASHSYSTEM_QUERIES(
            label,
            StorageDashboardQuery.TotalReadIOPS
          ),
          desc: "Read",
        },
        {
          query: FlASHSYSTEM_QUERIES(
            label,
            StorageDashboardQuery.TotalWriteIOPS
          ),
          desc: "Write",
        },
      ];
    case StorageDashboardQuery.UTILIZATION_LATENCY_QUERY:
      return [
        {
          query: FlASHSYSTEM_QUERIES(
            label,
            StorageDashboardQuery.TotalReadRespTime
          ),
          desc: "Read",
        },
        {
          query: FlASHSYSTEM_QUERIES(
            label,
            StorageDashboardQuery.TotalWriteRespTime
          ),
          desc: "Write",
        },
      ];
    case StorageDashboardQuery.UTILIZATION_THROUGHPUT_QUERY:
      return [
        {
          query: FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.TotalReadBW),
          desc: "Read",
        },
        {
          query: FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.TotalWriteBW),
          desc: "Write",
        },
      ];
  }
};
