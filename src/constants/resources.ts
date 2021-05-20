import { FirehoseResource } from '@console/internal/components/utils/index';
import { referenceForModel } from '@console/internal/module/k8s/k8s';
import { PersistentVolumeModel, StorageClassModel, NodeModel } from '@console/internal/models';
import { WatchK8sResource } from '@console/internal/components/utils/k8s-watch-hook';
import { StorageInstanceModel } from '../models';

export const stoClusterResource: FirehoseResource = {
  kind: referenceForModel(StorageInstanceModel),
  namespaced: true,
  isList: true,
  prop: 'sto',
};

export const pvResource: WatchK8sResource = {
  kind: PersistentVolumeModel.kind,
  namespaced: false,
  isList: true,
};

export const scResource: WatchK8sResource = {
  kind: StorageClassModel.kind,
  namespaced: false,
  isList: true,
};

export const nodeResource: WatchK8sResource = {
  kind: NodeModel.kind,
  namespaced: false,
  isList: true,
};

