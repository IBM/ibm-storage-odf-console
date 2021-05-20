import * as React from 'react';
import { ListDropdown } from '@console/internal/components/utils/list-dropdown';
import { StorageClassModel } from '@console/internal/models';
import { StorageClassResourceKind } from '@console/internal/module/k8s';

export const StorageClassDropdown: React.FC<SCDropdownProps> = (props) => {
  const kind = StorageClassModel.kind;
  const { selectedKey, desc } = props;
  const resources = [{ kind }];
  return (
    <ListDropdown
      {...props}
      desc={desc}
      resources={resources}
      selectedKeyKind={kind}
      placeholder="Select StorageClass"
      selectedKey={selectedKey}
    />
  );
};

export type SCDropdownProps = {
  namespace?: string;
  selectedKey?: string;
  onChange?: (claimName: string, kindLabel?: string, pvc?: StorageClassResourceKind) => void;
  id?: string;
  desc?: string;
  dataTest?: string;
  dataFilter?: (pvc: StorageClassResourceKind) => boolean;
};


