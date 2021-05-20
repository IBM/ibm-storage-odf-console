import * as React from 'react';
import * as _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { navFactory } from '@console/internal/components/utils';
import { DetailsPage } from '@console/internal/components/factory';
import { StorageStatus } from './components/dashboard-page/storage-dashboard-odf/status-card/utils';
import { Kebab } from '@console/internal/components/utils';
import {StorageInstanceKind} from './types';
import OdfDashboard from './odf-dashboard';

const { ModifyLabels, ModifyAnnotations, Edit, Delete } = Kebab.factory;
export const menuActions = [
  ModifyLabels,
  ModifyAnnotations,
  Edit,
  Delete,
];

const AdvanceStorageManagementDetailPage: React.FC<React.ComponentProps<typeof DetailsPage>> = (props) => {
  const { editYaml } = navFactory;
  const { t } = useTranslation();

  const pagesFor = React.useCallback(
    (node: StorageInstanceKind) => [
      {
        href: '',
        name: t('nodes~Overview'),
        component: OdfDashboard,
      },
      editYaml(),
    ],
    [editYaml, t],
  );

  return (
    <DetailsPage
      {...props}
      getResourceStatus={StorageStatus}
      menuActions={menuActions}
      pagesFor={pagesFor}
    />
  );
};

export default AdvanceStorageManagementDetailPage;
