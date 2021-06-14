import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//import { match } from 'react-router';

import { 
  ActionGroup, 
  Button,
  //TextInput,
  Checkbox,
 } from '@patternfly/react-core';

import {
  //LoadingBox,
  //ListDropdown,
  ButtonBar,
  history,
  //ResourceIcon,
  //resourceObjPath,
  HandlePromiseProps,
  withHandlePromise,
  //convertToBaseValue,
  //humanizeBinaryBytes,
} from '@console/internal/components/utils';
import {
  K8sKind,
  SecretKind,
  referenceForModel,
  k8sCreate,
  //referenceFor,
  //StorageClassResourceKind,
  //PersistentVolumeClaimKind,
  //k8sGet,
  apiVersionForModel,
} from '@console/internal/module/k8s';
//import { connectToPlural } from '@console/internal/kinds';
import {
  SecretModel
  //StorageClassModel,
  //NamespaceModel,
} from '@console/internal/models';
//import { accessModeRadios } from '@console/internal/components/storage/shared';
//import { PVCDropdown } from '@console/internal/components/utils/pvc-dropdown';
//import { getName, getNamespace } from '@console/shared';
//import { PVCStatus } from '@console/internal/components/persistent-volume-claim';
//import { useK8sWatchResource } from '@console/internal/components/utils/k8s-watch-hook';

import './_create-storage-instance.scss';
import { StorageInstanceModel } from '../../models';
import { StorageInstanceKind } from '../../types';

const CreateStorageForm = withHandlePromise<StorageResourceProps>((props) => {
  const { t } = useTranslation();
  const {
    plural,
    namespace,
    handlePromise,
    //inProgress,
    //errorMessage,
  } = props;

  //const [pvcName, setPVCName] = React.useState(resourceName);
  //const [pvcObj, setPVCObj] = React.useState<PersistentVolumeClaimKind>(null);
  const [storageName, setstorageName] = React.useState(`flashsystem-example`);
  const title = 'Create New Storage System';


  const [endpoint, setEndpoint] = React.useState(``);
  const [username, setUserName] = React.useState(``);
  const [password, setPassword] = React.useState(``);
  const [showPassword, setShowPassword] = React.useState(false);
  const [createDefaultStorageClass, setDefaultStorageClass] = React.useState(false);
  const [poolName, setPoolName] = React.useState(``);
  const [storageclassName, setStorageclassName] = React.useState(``);

  const handleEndpoint: React.ReactEventHandler<HTMLInputElement> = (event) =>
    setEndpoint(event.currentTarget.value);
  const handleUserName: React.ReactEventHandler<HTMLInputElement> = (event) =>
    setUserName(event.currentTarget.value);
  const handlePassword: React.ReactEventHandler<HTMLInputElement> = (event) =>
    setPassword(event.currentTarget.value);
  const handlestorageName: React.ReactEventHandler<HTMLInputElement> = (event) =>
    setstorageName(event.currentTarget.value);
  const handleDefaultStorageClass = (checked: boolean) => {
    setDefaultStorageClass(checked);
  };
  const handlePoolName: React.ReactEventHandler<HTMLInputElement> = (event) =>
    setPoolName(event.currentTarget.value);
  const handleStorageclassName: React.ReactEventHandler<HTMLInputElement> = (event) =>
    setStorageclassName(event.currentTarget.value);

  const create = (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    const promises = [];
    const storageSecretTemplate: SecretKind = {
      apiVersion: apiVersionForModel(SecretModel),
      stringData:{
        management_address: endpoint,
        password: password,
        username: username,
      },
      kind: 'Secret',
      metadata:{
        name: storageName,
        namespace: namespace,
      },
      type: 'Opaque',
    };
    const storageInstanceTemplate: StorageInstanceKind = {
      apiVersion: apiVersionForModel(StorageInstanceModel),
      kind: StorageInstanceModel.kind,
      metadata: {
        name: storageName,
        namespace: namespace,
      },
      spec: {
        name: storageName,
        endpoint: endpoint,
        insecureSkipVerify: true,
        secret:{
          name: storageName,
          namespace: namespace,
        },
      },
    };
    const storageInstanceTemplateWithDefaultPool: StorageInstanceKind = {
      apiVersion: apiVersionForModel(StorageInstanceModel),
      kind: StorageInstanceModel.kind,
      metadata: {
        name: storageName,
        namespace: namespace,
      },
      spec: {
        name: storageName,
        endpoint: endpoint,
        insecureSkipVerify: true,
        secret:{
          name: storageName,
          namespace: namespace,
        },
        defaultPool:{
          poolname: poolName,
          storageclassname: storageclassName,
        }
      },
    };
    k8sCreate(SecretModel, storageSecretTemplate);
    createDefaultStorageClass? 
      promises.push(k8sCreate(StorageInstanceModel, storageInstanceTemplateWithDefaultPool))
      : promises.push(k8sCreate(StorageInstanceModel, storageInstanceTemplate));
    handlePromise(Promise.all(promises), (resource) => {
      history.push(`/k8s/ns/${namespace}/${referenceForModel(StorageInstanceModel)}`);
    });
  };

  var createDefaultStorageClassPage;
  if(createDefaultStorageClass) {
    createDefaultStorageClassPage = (<div className="subline-with-2-words">
            <label className="control-label co-required" htmlFor="snapshot-name">
              StorageClass Name
            </label>
            <input
              className="pf-c-form-control"
              type="text"
              onChange={handleStorageclassName}
              name="storageclassname"
              id="storageclassname"
              value={storageclassName}
              required
            />
            <label className="control-label co-required" htmlFor="snapshot-name">
              Pool Name
            </label>
            <input
              className="pf-c-form-control"
              type="text"
              onChange={handlePoolName}
              name="poolname"
              id="poolname"
              value={poolName}
              required
            />
          </div>)
  } else {
    createDefaultStorageClassPage = (<div className="form-group co-pre-wrap">
    </div>)
  }

  return (
    <div className="co-volume-snapshot__body">
      <div className="co-m-pane__body co-m-pane__form">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <h1 className="co-m-pane__heading co-m-pane__heading--baseline">
          <div className="co-m-pane__name">{title}</div>
          <div className="co-m-pane__heading-link">
            <Link
              to={`/k8s/ns/${namespace || 'default'}/${plural}/~new`}
              id="yaml-link"
              data-test="yaml-link"
              replace
            >
              Edit YAML
            </Link>
          </div>
        </h1>
        <form className="co-m-pane__body-group" onSubmit={create}>
          
          <div className="form-group co-volume-snapshot__form">
            <label className="control-label co-required" htmlFor="snapshot-name">
              Name
            </label>
            <input
              className="pf-c-form-control"
              type="text"
              onChange={handlestorageName}
              name="storageName"
              id="snapshot-name"
              value={storageName}
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
                    {t('kubevirt-plugin~Hide password')}
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
                  {t('kubevirt-plugin~Show password')}
                </Button>
                </>
              )}
              <Checkbox
              label="Create Default StorageClass"
              onChange={handleDefaultStorageClass}
              isChecked={createDefaultStorageClass}
              id="createDefaultStorageClass"
              />
              {createDefaultStorageClassPage}
              <ButtonBar >
                <ActionGroup className="pf-c-form">
                  <Button
                    type="submit"
                    variant="primary"
                    id="save-changes"
                    isDisabled={false}
                  >
                    Create
                  </Button>
                  <Button type="button" variant="secondary" onClick={history.goBack}>
                    Cancel
                  </Button>
                </ActionGroup>
              </ButtonBar>
          </div>
        </form>
      </div>
    </div>
  );
});

const VolumeStorageComponent: React.FC<VolumeStorageComponentProps> = (props) => {
  const params = props;

  return (
    <CreateStorageForm
      plural={referenceForModel(StorageInstanceModel)}
      namespace={params?.ns}
    />
  );
};

export const StorageInstance = (prog: StorageInstanceProps) => {
  return VolumeStorageComponent(prog?.match?.params);
};

type StorageInstanceProps = {
  match?:{
    params: any,
  }
};

type StorageResourceProps = HandlePromiseProps & {
  namespace?: string;
  resourceName?: string;
  kindObj?: K8sKind;
  plural?: string;
};



type VolumeStorageComponentProps = {
  ns?: string; 
  plural?: string; 
  name?: string ;
};
