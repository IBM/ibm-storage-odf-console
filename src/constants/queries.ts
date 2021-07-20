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
import { ProjectModel, PodModel, StorageClassModel } from '../models';
import { STORAGE_CLASSES, PROJECTS, PODS } from '.';
import {IBM_STORAGE_CSI_PROVISIONER} from './index'

export enum StorageDashboardQuery {
  PODS_TOTAL_USED = 'PODS_TOTAL_USED',
  PODS_BY_USED = 'PODS_BY_USED',
  PROJECTS_TOTAL_USED = 'PROJECTS_TOTAL_USED',
  PROJECTS_BY_USED = 'PROJECTS_BY_USED',
  STORAGE_CLASSES_TOTAL_USED = 'STORAGE_CLASSES_TOTAL_USED',
  STORAGE_CLASSES_BY_USED = 'STORAGE_CLASSES_BY_USED',
  USED_CAPACITY = 'USED_CAPACITY',
  TotalCapacity  = 'TotalCapacity',
  TotalFreeCapacity  = 'TotalFreeCapacity',
  TotalUsedCapacity  = 'TotalUsedCapacity',
}

export const EFFICIENCY_SAVING_QUERY = "sum(flashsystem_pool_savings_bytes)";

export const FlASHSYSTEM_QUERIES = (label: string, queryItem: string):string => {
    const currentProvisioner = IBM_STORAGE_CSI_PROVISIONER;
    switch(queryItem){
    // change kube_persistentvolumeclaim_resource_requests_storage_bytes
    // to kubelet_volume_stats_used_bytes
    case StorageDashboardQuery.PROJECTS_TOTAL_USED:{
      return `sum(sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'})) by (namespace))`;
      }
    case StorageDashboardQuery.PROJECTS_BY_USED:{
      return `sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'})) by (namespace)`;
      }
    case StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED:{
      return `sum(sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass) group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'})) by (storageclass, provisioner))`;
      }
    case StorageDashboardQuery.STORAGE_CLASSES_BY_USED:{
      return `sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass) group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'})) by (storageclass, provisioner)`;
      }
    case StorageDashboardQuery.PODS_TOTAL_USED:{
      return `sum((kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_right() (kube_pod_info * on(namespace, pod)  group_right(node) kube_pod_spec_volumes_persistentvolumeclaims_info)) * on(namespace,persistentvolumeclaim) group_left(provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'}))`;
      }
    case StorageDashboardQuery.PODS_BY_USED:{
      return `sum((kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_right() (kube_pod_info * on(namespace, pod)  group_right(node) kube_pod_spec_volumes_persistentvolumeclaims_info)) * on(namespace,persistentvolumeclaim) group_left(provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'})) by (pod)`;
      }
    case StorageDashboardQuery.USED_CAPACITY:{
      return `sum(kube_persistentvolumeclaim_resource_requests_storage_bytes * on (namespace,persistentvolumeclaim) group_left(storageclass, provisioner) (kube_persistentvolumeclaim_info * on (storageclass)  group_left(provisioner) kube_storageclass_info {provisioner=~'${currentProvisioner}'}))`;
      }
    case StorageDashboardQuery.TotalUsedCapacity:{
      return `sum(flashsystem_pool_capacity_used_bytes{container='${label}'})`;
      }
    case StorageDashboardQuery.TotalFreeCapacity:{
      return `sum(flashsystem_pool_capacity_usable_bytes{container='${label}'})`;
      }
    case StorageDashboardQuery.TotalCapacity:{
      return `sum(flashsystem_pool_capacity_usable_bytes{container='${label}'}) + sum(flashsystem_pool_capacity_used_bytes{container='${label}'})`;
      }
  }
};

export const BreakdownQueryMapODF = (label: string, queryType: string) => {
    switch(queryType) { 
      case PROJECTS: return {
        model: ProjectModel,
        metric: 'namespace',
        queries: {
          [StorageDashboardQuery.PROJECTS_BY_USED]: `(topk(6,(${
            FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.PROJECTS_BY_USED)
          })))`,
          [StorageDashboardQuery.PROJECTS_TOTAL_USED]:
            FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.PROJECTS_TOTAL_USED),
          [StorageDashboardQuery.USED_CAPACITY]:
            FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.USED_CAPACITY),
          },
        }; 
       
      case STORAGE_CLASSES: return {
        model: StorageClassModel,
        metric: 'storageclass',
        queries: {
            [StorageDashboardQuery.STORAGE_CLASSES_BY_USED]: `(topk(6,(${
              FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.STORAGE_CLASSES_BY_USED)
            })))`,
            [StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED]:
              FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.STORAGE_CLASSES_TOTAL_USED),
            [StorageDashboardQuery.USED_CAPACITY]:
              FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.USED_CAPACITY),
          },
      };
      case PODS: return {
        model: PodModel,
        metric: 'pod',
        queries: {
          [StorageDashboardQuery.PODS_BY_USED]: `(topk(6,(${
            FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.PODS_BY_USED)
          })))`,
          [StorageDashboardQuery.PODS_TOTAL_USED]:
            FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.PODS_TOTAL_USED),
          [StorageDashboardQuery.USED_CAPACITY]:
            FlASHSYSTEM_QUERIES(label, StorageDashboardQuery.USED_CAPACITY),
        }, }; 
    }
  };
