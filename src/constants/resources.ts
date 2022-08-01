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
import { WatchK8sResource } from "@openshift-console/dynamic-plugin-sdk";
import {
  StorageInstanceModel,
  SubscriptionModel,
  ClusterServiceVersionModel,
  SecretModel,
  ConfigMapModel,
} from "../models";
import { referenceForModel, parseProps } from "../selectors";

export const SubscriptionResource: WatchK8sResource = {
  isList: true,
  kind: referenceForModel(SubscriptionModel),
  namespaced: false,
};

export const OperatorResource: WatchK8sResource = {
  kind: referenceForModel(ClusterServiceVersionModel),
  isList: true,
};

export const FlashSystemResource: WatchK8sResource = {
  kind: referenceForModel(StorageInstanceModel),
  isList: true,
};

export const newFlashSystemResource = (name: string, namespace?: string) => {
  const resource: WatchK8sResource = {
    kind: referenceForModel(StorageInstanceModel),
    name: name,
    namespace: namespace,
    isList: true,
  };
  return resource;
};

export const GetSecretResource = (name?: string, namespace?: string) => {
  const resource: WatchK8sResource = {
    isList: false,
    kind: SecretModel.kind,
    namespace: namespace,
    name: name,
  };
  return resource;
};

export const GetFlashSystemResource = (props) => {
  const { name, namespace } = parseProps(props);
  return newFlashSystemResource(name, namespace);
};

export const GetIBMPoolsConfigMap = (namespace?: string) => {
  const resource: WatchK8sResource = {
    isList: false,
    kind: ConfigMapModel.kind,
    namespace: namespace,
    name: 'ibm-flashsystem-pools',
  };
  return resource;
};
