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
//TODO
// This page will be merged into openshift console ceph plugin packages

import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { 
  ActionGroup, 
  Button,
  Checkbox,
 } from '@patternfly/react-core';

import {
  ButtonBar,
  history,
  HandlePromiseProps,
  withHandlePromise,
} from '@console/internal/components/utils';
import {
  K8sKind,
  SecretKind,
  referenceForModel,
  k8sCreate,
  apiVersionForModel,
} from '@console/internal/module/k8s';
import {
  SecretModel
} from '@console/internal/models';

import './_create-storage-instance.scss';
import { StorageInstanceModel } from '../../models';
import { StorageInstanceKind } from '../../types';

const CreateStorageForm = withHandlePromise<StorageResourceProps>((props) => {
  const { t } = useTranslation();
  const {
    plural,
    namespace,
    handlePromise,
  } = props;

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
            <label className="control-label co-required" >
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
            <label className="control-label co-required" >
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
            <label className="control-label co-required" >
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
          
            <label className="control-label co-required" >
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
          
            <label className="control-label co-required" >
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
          
            <label className="control-label co-required" >
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
                    {t('Hide password')}
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
                  {t('Show password')}
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