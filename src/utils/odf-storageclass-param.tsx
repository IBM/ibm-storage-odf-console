import { ExtensionSCProvisionerProp } from '@console/plugin-sdk';
import {
  PoolResourceComponent,
  getStorageName,
  getStorageNamespace,
  FsTypeComponent,
  StorageEfficiencyComponent
} from '../components/storageclass-form/storage-class-form';

export const StorageClassFormProvisoners: ExtensionSCProvisionerProp = Object.freeze({
  csi: {
    'block.csi.ibm.com': {
      title: 'IBM Block Storage',
      provisioner: 'block.csi.ibm.com',
      allowVolumeExpansion: true,
      documentationLink:
          'https://github.com/IBM/ibm-block-csi-driver#2-create-storage-classes',
      parameters: {
        pool: {
          name: 'Pool',
          hintText: 'pool name for storage system',
          required: true,
          Component: PoolResourceComponent,
        },
        'csi.storage.k8s.io/fstype': {
          name: 'Filesystem Type',
          hintText: 'filesystem type. Default set to ext4',
          Component: FsTypeComponent,
        },
        'volume_name_prefix': {
          name: 'Volume Name Prefix',
          hintText: 'The prefix name of volume',
          value: 'ibm-storage-odf',
          visible: () => false,
        },
        'SpaceEfficiency': {
          name: 'Space Efficiency',
          hintText: 'The option of SpaceEfficiency, default is thin',
          required: true,
          Component: StorageEfficiencyComponent,
        },
        'csi.storage.k8s.io/provisioner-secret-name': {
          name: 'Provisioner Secret Name',
          hintText: 'The name of provisioner secret',
          required: true,
          Component: getStorageName,
        },
        'csi.storage.k8s.io/provisioner-secret-namespace': {
          name: 'Provisioner Secret Namespace',
          hintText: 'The namespace where provisioner secret is created',
          required: true,
          Component: getStorageNamespace,
        },
        'csi.storage.k8s.io/controller-publish-secret-name': {
          name: 'Expand Secret Name',
          hintText: 'The namespace where provisioner secret is created',
          required: true,
          Component: getStorageName,
        },
        'csi.storage.k8s.io/controller-publish-secret-namespace': {
          name: 'Expand Secret Namespace',
          hintText: 'The namespace where provisioner secret is created',
          required: true,
          Component: getStorageNamespace,
        },
        'csi.storage.k8s.io/controller-expand-secret-name': {
          name: 'Expand Secret Name',
          hintText: 'The namespace where provisioner secret is created',
          required: true,
          Component: getStorageName,
        },
        'csi.storage.k8s.io/controller-expand-secret-namespace': {
          name: 'Expand Secret Namespace',
          hintText: 'The namespace where provisioner secret is created',
          required: true,
          Component: getStorageNamespace,
        },
      },
    },
  },
});
