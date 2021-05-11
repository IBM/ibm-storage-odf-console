import * as React from 'react';
import { Helmet } from 'react-helmet';
//import { Link } from 'react-router-dom';
//import { useTranslation } from 'react-i18next';
//import { match } from 'react-router';

import { 
  ActionGroup, 
  Button,
  //TextInput,
 } from '@patternfly/react-core';

//import {
  //LoadingBox,
  //ListDropdown,
  //ButtonBar,
  //history,
  //ResourceIcon,
  //resourceObjPath,
  //HandlePromiseProps,
  //withHandlePromise,
  //convertToBaseValue,
  //humanizeBinaryBytes,
//} from '@console/internal/components/utils';
//import {
  //K8sKind,
  //referenceForModel,
  //k8sCreate,
  //referenceFor,
  //VolumeSnapshotClassKind,
  //StorageClassResourceKind,
  //PersistentVolumeClaimKind,
  //k8sGet,
  //VolumeSnapshotKind,
  //apiVersionForModel,
//} from '@console/internal/module/k8s';
import {
  K8sKind,
} from '../../models';
import {
  referenceForModel,
  apiVersionForModel,
} from '../../utils/k8s';
//import {K8sResourceCommon} from '@console/dynamic-plugin-sdk/src/extensions/console-types';
//import { connectToPlural } from '@console/internal/kinds';
//import {
  //PersistentVolumeClaimModel,
  //VolumeSnapshotModel,
  //VolumeSnapshotClassModel,
  //StorageClassModel,
  //NamespaceModel,
//} from '@console/internal/models';
//import { accessModeRadios } from '@console/internal/components/storage/shared';
//import { PVCDropdown } from '@console/internal/components/utils/pvc-dropdown';
//import { getName, getNamespace } from '@console/shared';
//import { PVCStatus } from '@console/internal/components/persistent-volume-claim';
//import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';

import './_create-storage-instance.scss';
import { StorageInstanceModel } from '../../models';
import { StorageInstanceKind } from '../../types';

const CreateSnapshotForm = (props: SnapshotResourceProps)  => {
  //const { t } = useTranslation();
  const {
    //plural,
    namespace,
    //handlePromise,
    //inProgress,
    //errorMessage,
  } = props;

  //const [pvcName, setPVCName] = React.useState(resourceName);
  //const [pvcObj, setPVCObj] = React.useState<PersistentVolumeClaimKind>(null);
  const [snapshotName, setSnapshotName] = React.useState(`flashsystem-example`);
  const title = 'Create Storage Instance';

  const [endpoint, setEndpoint] = React.useState(``);
  const [username, setUserName] = React.useState(``);
  const [password, setPassword] = React.useState(``);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleEndpoint: React.ReactEventHandler<HTMLInputElement> = (event) =>
    setEndpoint(event.currentTarget.value);
  const handleUserName: React.ReactEventHandler<HTMLInputElement> = (event) =>
    setUserName(event.currentTarget.value);
  const handlePassword: React.ReactEventHandler<HTMLInputElement> = (event) =>
    setPassword(event.currentTarget.value);
  const handleSnapshotName: React.ReactEventHandler<HTMLInputElement> = (event) =>
    setSnapshotName(event.currentTarget.value);


  const create = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    const storageInstanceTemplate: StorageInstanceKind = {
      apiVersion: apiVersionForModel(StorageInstanceModel),
      kind: StorageInstanceModel.kind,
      metadata: {
        name: snapshotName,
        namespace: namespace,
      },
      spec: {
        driverEndpoint: {
          driverName: 'ibm-block-storage-driver',
          metrics:{
            TotalReadIOPS: 'flashsystem_perf_vdisk_r_io',
            TotalWriteIOPS: 'flashsystem_perf_vdisk_w_io',
            TotalFreeCapacity: 'flashsystem_perf_total_free_space',
            UsedCapacityAfterReduction: 'flashsystem_perf_used_capacity_after_reduction',
            TotalReadBW: 'flashsystem_perf_vdisk_r_mb',
            TotalWriteBW: 'flashsystem_perf_vdisk_w_mb',
            TotalReadRespTime: 'flashsystem_perf_vdisk_r_ms',
            TotalWriteRespTime: 'flashsystem_perf_vdisk_w_ms',
            TotalUsedCapacity: 'flashsystem_perf_total_used_capacity',
            UsedCapacityBeforeReduction: 'flashsystem_perf_used_capacity_before_reduction',
          },
          nameSpace: 'ocs-managed-storage',
          parameters:{
            pool: 'test_pool',
            provisioner: 'block.csi.ibm.com',
          },
          port: 36111,
        },
        name: snapshotName,
        vendor: 'IBM',
        
      },
    };
    console.log(storageInstanceTemplate);

    //handlePromise(k8sCreate(StorageInstanceModel, storageInstanceTemplate), (resource) => {
    //  history.push(resourceObjPath(resource, referenceFor(resource)));
    //});
  };

  return (
    <div className="co-volume-snapshot__body">
      <div className="co-m-pane__body co-m-pane__form">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <h1 className="co-m-pane__heading co-m-pane__heading--baseline">
          <div className="co-m-pane__name">{title}</div>
        </h1>
        <form className="co-m-pane__body-group" onSubmit={create}>
          
          <div className="form-group co-volume-snapshot__form">
            <label className="control-label co-required" htmlFor="snapshot-name">
              Name
            </label>
            <input
              className="pf-c-form-control"
              type="text"
              onChange={handleSnapshotName}
              name="snapshotName"
              id="snapshot-name"
              value={snapshotName}
              required
            />
          
            <label className="control-label co-required" htmlFor="endpoint">
              Endpoint
            </label>
            <input
              className="pf-c-form-control"
              type="text"
              onChange={handleEndpoint}
              name="endpoint"
              id="endpoint"
              value={endpoint}
              required
            />
            <p className="help-block" id="label-selector-help">
            Rest API IP address of IBM Storage FlashSystem 
            </p>
          
            <label className="control-label co-required" htmlFor="username">
              Username
            </label>
            <input
              className="pf-c-form-control"
              type="text"
              onChange={handleUserName}
              name="username"
              id="username"
              value={username}
              required
            />
          
            <label className="control-label co-required" htmlFor="password">
              Password
            </label>
            
            {showPassword ? (
                <>
                  <input
                    className="pf-c-form-control"
                    type="text"
                    onChange={handlePassword}
                    name="password"
                    id="password"
                    value={password}
                    required
                  />
                  <Button isSmall isInline variant="link" onClick={() => setShowPassword(false)}>
                    {'Hide password'}
                  </Button>
                </>
              ) : (
                <>
                <input
                    className="pf-c-form-control"
                    type="password"
                    onChange={handlePassword}
                    name="password"
                    id="password"
                    value={password}
                    required
                  />
                <Button isSmall isInline variant="link" onClick={() => setShowPassword(true)}>
                  {'Show password'}
                </Button>
                </>
              )}
              
                <ActionGroup className="pf-c-form">
                  <Button
                    type="submit"
                    variant="primary"
                    id="save-changes"
                    isDisabled={false}
                  >
                    Create
                  </Button>
                  
                </ActionGroup>
              
          </div>
        </form>
      </div>
    </div>
  );
};

export const VolumeSnapshotComponent: React.FC<VolumeSnapshotComponentProps> = (props) => {
  const params = props;

  return (
    <CreateSnapshotForm
      plural={referenceForModel(StorageInstanceModel)}
      namespace={params?.ns}
    />
  );
};

//const StorageInstance = ({ match: { params }}) => {
//  return VolumeSnapshotComponent(params);
//};



type SnapshotResourceProps = {
  namespace?: string;
  resourceName?: string;
  kindObj?: K8sKind;
  plural?: string;
};



type VolumeSnapshotComponentProps = {
  ns?: string; 
  plural?: string; 
  name?: string ;
};
