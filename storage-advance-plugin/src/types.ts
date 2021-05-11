//import { K8sResourceKind, K8sResourceCommon } from '@console/internal/module/k8s';
import {K8sResourceCommon, Selector, MatchLabels} from '@openshift-console/dynamic-plugin-sdk';

export type K8sResourceKind = K8sResourceCommon & {
  spec?: {
    selector?: Selector | MatchLabels;
    [key: string]: any;
  };
  status?: { [key: string]: any };
  data?: { [key: string]: any };
};

export type WatchStoResource = {
  sto: K8sResourceKind[];
};

export type StoragePoolKind = K8sResourceCommon & {
  spec: {
    compressionMode?: string;
    deviceClass?: string;
    replicated: {
      size: number;
    };
    parameters?: {
      compression_mode: string;
    };
  };
  status?: {
    phase?: string;
  };
};

export type StorageInstanceStatus = {
  capacity?: {
    maxCapacity: string;
    usedCapacity: string;
  };
  id?: string;
  state?: string;
  version?: string;
};

export type StorageInstanceSpec = {
  driverEndpoint?: {
    driverName: string;
    nameSpace: string;
    parameters: {
      pool?: string;
      provisioner?: string;
    };
    port: number;
    metrics?: {
      TotalReadIOPS?: string;
      TotalWriteIOPS?: string;
      TotalFreeCapacity?: string;
      UsedCapacityAfterReduction?: string;
      TotalReadBW?: string;
      TotalWriteBW?: string;
      TotalReadRespTime?: string;
      TotalWriteRespTime?: string;
      TotalUsedCapacity?: string;
      UsedCapacityBeforeReduction?: string;
    };
  };
  name?: string;
  vendor?: string;
};

export type StorageInstanceKind = {
  spec: StorageInstanceSpec;
  status?: StorageInstanceStatus;
} & K8sResourceKind;

export type StorageClassTraitKind = {
  spec: {
    storageclass?: {
      apiVersion: string;
      kind: string;
      name: string;
      uid: string;
      provisioner?: string;
    };
    traits? :{
      accessModes?: string[];
      type?:       string;
      perf?:{
        perfLevel?: string;
        Media?: string;
      };
      topology?:{
        locations?: string[]
      };
      dataProtection?: {
        copies?:      number;
	      type?:      string;
	      replication?: string;
        snapshotEnabled?: boolean;
      };
      admin?:{
        cost?: number;
	      restrict?: boolean;
	      allowedNamespaces?: string[];
      };
      dr?:{
        replication?: string;
      };
      capacitySaving?:{
        compressionEnabled?: boolean;
	      dedupEnabled?: boolean;
	      thinprovisionEnabled?: boolean;
      }
      security?:{
        encryptionEnabled?:boolean;
      }
      parameters?: string[];     
    }
  }
  status?: {
    state?: string;
    availableCapBytes?: number;
  };
} & K8sResourceKind;
