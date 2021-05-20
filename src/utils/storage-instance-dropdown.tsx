import * as React from 'react';
import { ListDropdown } from '@console/internal/components/utils/list-dropdown';
import { StorageInstanceModel } from '../models';
import { StorageInstanceKind } from '../types';
import {referenceForModel} from '@console/internal/module/k8s';

export const StorageInstanceDropdown: React.FC<SADropdownProps> = (props) => {
  const kind = referenceForModel(StorageInstanceModel);
  const { selectedKey, desc } = props;
  const resources = [{ kind }];
  return (
    <ListDropdown
      {...props}
      desc={desc}
      resources={resources}
      selectedKeyKind={kind}
      placeholder="Select Storage Instance"
      selectedKey={selectedKey}
    />
  );
};

export type SADropdownProps = {
  namespace?: string;
  selectedKey?: string;
  onChange?: (claimName: string, kindLabel?: string, pvc?: StorageInstanceKind) => void;
  id?: string;
  desc?: string;
  dataTest?: string;
  dataFilter?: (pvc: StorageInstanceKind) => boolean;
};


