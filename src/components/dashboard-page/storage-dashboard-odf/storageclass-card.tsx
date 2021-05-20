import * as React from 'react';
import * as _ from 'lodash';
import DashboardCard from '@console/shared/src/components/dashboard/dashboard-card/DashboardCard';
import DashboardCardBody from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardBody';
import DashboardCardHeader from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardHeader';
import DashboardCardTitle from '@console/shared/src/components/dashboard/dashboard-card/DashboardCardTitle';
import DetailItem from '@console/shared/src/components/dashboard/details-card/DetailItem';
//import {DetailItemMultiline} from '@console/shared/src/components/dashboard/details-card/DetailItem';
import {
  DashboardItemProps,
  withDashboardResources,
} from '@console/internal/components/dashboard/with-dashboard-resources';
import DetailsBody from '@console/shared/src/components/dashboard/details-card/DetailsBody';
import { FirehoseResource } from '@console/internal/components/utils/index';
import { StorageInstanceModel } from '../../../models';
import { StorageInstanceKind } from '../../../types';
import { referenceForModel } from '@console/internal/module/k8s/k8s';
import {EventBus} from '../../../utils/dashboard';
import { StorageClassDropdown } from '../../../utils/storageclass-dropdown';
import { StorageClassResourceKind } from '@console/internal/module/k8s';
import { StorageClassModel } from '@console/internal/models';

const ocsResource: FirehoseResource = {
  kind: referenceForModel(StorageInstanceModel),
  namespaced: true,
  isList: true,
  prop: 'sto',
};
const scResource: FirehoseResource = {
  kind: StorageClassModel.kind,
  namespaced: false,
  isList: true,
  prop: 'sc',
};

var tmpCRname = "tmpCRname";

const StorageClassCard: React.FC<DashboardItemProps> = ({
  watchK8sResource,
  stopWatchK8sResource,
  resources,
}) => {
  const [crname, setCrname] = React.useState('');
  const [storageclassName,setstorageclassName] = React.useState('StorageClass');
  const handleSayHelloListener = (msg: string) => {
    setCrname(msg);
    if(msg != tmpCRname) {
      tmpCRname = msg;
      setstorageclassName(''); //reset storageclass
    }
  }
  EventBus.addListener("sayHello",handleSayHelloListener)
  
  React.useEffect(() => {
    watchK8sResource(ocsResource);
    watchK8sResource(scResource);
    return () => {
      stopWatchK8sResource(ocsResource);
      stopWatchK8sResource(scResource);
    };
  }, [watchK8sResource, stopWatchK8sResource]);

  const sto = resources?.sto;
  const stoLoaded = sto?.loaded || false;
  const stoError = sto?.loadError;
  const stoDataAll = sto?.data as StorageInstanceKind[];

  const stoIns = crname;
  const stoData = stoDataAll?.find((cr) => cr.metadata.name === stoIns);
  const currentProvisioner = _.get(stoData, ['spec', 'driverEndpoint', 'parameters', 'provisioner']);
  
  const handlestorageclassName = (name: string) => {
    setstorageclassName(name);
  };

  const sc = resources?.sc;
  //const scLoaded = sc?.loaded || false;
  //const scError = sc?.loadError;
  const scDataAll = sc?.data as StorageClassResourceKind[];

  const scIns = storageclassName;
  const scData = scDataAll?.find((cr) => cr.metadata.name === scIns);

  const sysPoolName = "Pool0";
  const sysPoolSize = "500GiB";
  const sysPoolFreeSize = "130GiB";
  const sysPoolUsedSize = "370GiB";
  const sysEncryption = "yes";
  const sysParameters = _.get(scData, ['parameters']);

  const filter = (sc: StorageClassResourceKind) =>
    !currentProvisioner ? false : sc?.provisioner.includes(currentProvisioner);

  return (
    <DashboardCard>
      <DashboardCardHeader>
        <DashboardCardTitle>{storageclassName || crname && ''}</DashboardCardTitle>
        <StorageClassDropdown
                dataTest="storageclass-dropdown"
                //namespace={namespace}
                onChange={handlestorageclassName}
                selectedKey={storageclassName}
                dataFilter={filter}
                desc={`StorageClass`}
              />
      </DashboardCardHeader>
      <DashboardCardBody>
        <DetailsBody>
          <DetailItem
            key="pool"
            title="Pool"
            error={!!stoError}
            isLoading={!stoLoaded}
          >
            {sysPoolName}
          </DetailItem>
          <DetailItem
            key="pool_size"
            title="Pool Size"
            error={!!stoError}
            isLoading={!stoLoaded}
          >
            {sysPoolSize}
          </DetailItem>
          <DetailItem
            key="pool_used_size"
            title="Pool Used Size"
            error={!!stoError}
            isLoading={!stoLoaded}
          >
            {sysPoolUsedSize}
          </DetailItem>
          <DetailItem
            key="pool_free_size"
            title="Pool Free Size"
            error={!!stoError}
            isLoading={!stoLoaded}
          >
            {sysPoolFreeSize}
          </DetailItem>
          <DetailItem
            key="encryption"
            title="Encryption"
            error={!!stoError}
            isLoading={!stoLoaded}
          >
            {sysEncryption}
          </DetailItem>
          <DetailItem
            key="parameters"
            title="Parameters"
            error={!!stoError}
            isLoading={!stoLoaded}
          >
            {(JSON.stringify(sysParameters))?.replace(/\{/g,"").replace(/\}/g,"").replace(/\"/g,"").replace(/,/g,"\r\n")}
          </DetailItem>
          
        </DetailsBody>
      </DashboardCardBody>
    </DashboardCard>
  );
};

export default withDashboardResources(StorageClassCard);
