import * as _ from 'lodash-es';
import {
    K8sKind,
} from '../models';
import {GroupVersionKind} from '@openshift-console/dynamic-plugin-sdk';

export const referenceForGroupVersionKind = (group: string) => (version: string) => (
    kind: string,
  ) => [group, version, kind].join('~');
export const apiVersionForModel = (model: K8sKind) =>
  _.isEmpty(model.apiGroup) ? model.apiVersion : `${model.apiGroup}/${model.apiVersion}`;
export const referenceForModel = (model: K8sKind): GroupVersionKind =>
  referenceForGroupVersionKind(model.apiGroup || 'core')(model.apiVersion)(model.kind);
