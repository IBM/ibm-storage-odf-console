import * as React from 'react';
import * as _ from 'lodash';
import {
  Alert,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  //DropdownSeparator,
} from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons';
//import { StatusBox } from '@console/internal/components/utils/status-box';
import {
  useK8sWatchResource,
} from '@console/internal/components/utils/k8s-watch-hook';
import { ProvisionerProps } from '@console/plugin-sdk';
import { PrometheusEndpoint } from '@console/internal/components/graphs/helpers';
import { usePrometheusPoll } from '@console/internal/components/graphs/prometheus-poll-hook';
import { StorageInstanceKind } from '../../types';
import {stoClusterResource} from '../../constants/resources';

export const getStorageName1=() =>{
  const [storageInstances] = useK8sWatchResource<
  StorageInstanceKind[]
  >(stoClusterResource);

  const name = storageInstances?.[0]?.metadata?.name;
  
  return name;
}

export const getStorageName: React.FC<ProvisionerProps> = ({
  parameterKey,
  parameterValue,
  onParamChange,
}) =>{
  const [storageInstances, storageInstanceLoaded, storageInstanceLoadError] = useK8sWatchResource<
  StorageInstanceKind[]
  >(stoClusterResource);

  const name = storageInstances?.[0]?.metadata?.name;
  if(storageInstanceLoaded && !storageInstanceLoadError && name && name!=parameterValue){
    onParamChange(parameterKey, name, false);
  }
  return (<div/>);
}
export const getStorageNamespace : React.FC<ProvisionerProps> = ({
  parameterKey,
  parameterValue,
  onParamChange,
}) =>{
  const [storageInstances, storageInstanceLoaded, storageInstanceLoadError] = useK8sWatchResource<
  StorageInstanceKind[]
  >(stoClusterResource);

  const namespace = storageInstances?.[0]?.metadata?.namespace;
  if(storageInstanceLoaded && !storageInstanceLoadError && namespace && namespace!=parameterValue){
    onParamChange(parameterKey, namespace, false);
  }
  return (<div/>);
}

export const PoolResourceComponent: React.FC<ProvisionerProps> = ({
  parameterKey,
  onParamChange,
}) => {

  const [storageInstances, storageInstanceLoaded, storageInstanceLoadError] = useK8sWatchResource<
  StorageInstanceKind[]
  >(stoClusterResource);

  const name = storageInstances?.[0]?.metadata?.name;
  const namespace = storageInstances?.[0]?.metadata?.namespace;
  const query = `pool_metadata{container='${name}'}`;
  const [response, poolDataLoadError, poolDataloading] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY,
    namespace: namespace,
    query: query,
  });
  //console.log({storageInstances: storageInstances, response:response});
  const resultArray = response?.data?.result;
  //resultArray?[0].metric?.pool_name;
  var poolSet = new Set();

  const [isOpen, setOpen] = React.useState(false);
  const [poolName, setPoolName] = React.useState('');
  const handleDropdownChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const name = e.currentTarget.id;
    setPoolName(name);
    onParamChange(parameterKey, name, false);
  };

  const poolDropdownItems = _.reduce(
    resultArray,
    (res, pool) => {
      const poolState = pool?.metric?.state;
      const item = (
        <DropdownItem
            key={pool?.metric?.pool_name}
            component="button"
            id={pool?.metric?.pool_name}
            data-test={pool?.metric?.pool_name}
            onClick={handleDropdownChange}
            description={`Pool state: ${poolState}`}
          >
            {pool?.metric?.pool_name}
          </DropdownItem>
      );
      if(!poolSet.has(pool?.metric?.pool_name)){
        res.push(item);
        poolSet.add(pool?.metric?.pool_name);
      }
      return res;
    },
    [
    ],
  );
  
return (
  <>
    {!poolDataLoadError && storageInstanceLoaded && !poolDataloading && (
      <div className="form-group">
        <label className="co-required" htmlFor="odf-storage-pool">
          {'Storage Pool'}
        </label>
        <Dropdown
          className="dropdown dropdown--full-width"
          toggle={
            <DropdownToggle
              id="pool-dropdown-id"
              data-test="pool-dropdown-toggle"
              onToggle={() => setOpen(!isOpen)}
              toggleIndicator={CaretDownIcon}
            >
              {poolName || 'Select a Pool'}
            </DropdownToggle>
          }
          isOpen={isOpen}
          dropdownItems={poolDropdownItems}
          onSelect={() => setOpen(false)}
          id="odf-storage-pool"
        />
        <span className="help-block">
          {'Storage pool into which volume data shall be stored'}
        </span>
      </div>
    )}
    {(poolDataLoadError || storageInstanceLoadError) && (
      <Alert
        className="co-alert"
        variant="danger"
        title={'Error retrieving Parameters'}
        isInline
      />
    )}
  </>
);

};

export const FsTypeComponent: React.FC<ProvisionerProps> = ({
  parameterKey,
  onParamChange,
}) => {
  const fsArray = ['xfs','ext4'];
  const [isOpen, setOpen] = React.useState(false);
  const [fsType, setfsType] = React.useState('');
  const handleDropdownChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const name = e.currentTarget.id;
    setfsType(name);
    onParamChange(parameterKey, name, false);
  };

  const fsTypeDropdownItems = _.reduce(
    fsArray,
    (res, fsType) => {
      const item = (
        <DropdownItem
            key={fsType}
            component="button"
            id={fsType}
            data-test={fsType}
            onClick={handleDropdownChange}
            description={`Filesystem Type: ${fsType}`}
          >
            {fsType}
          </DropdownItem>
      );
      res.push(item);  
      return res;
    },
    [
    ],
  );
  
return (
  <>
    {(
      <div className="form-group">
        <label className="co-required" htmlFor="odf-storage-fsType">
          {'Filesystem Type'}
        </label>
        <Dropdown
          className="dropdown dropdown--full-width"
          toggle={
            <DropdownToggle
              id="fsType-dropdown-id"
              data-test="fsType-dropdown-toggle"
              onToggle={() => setOpen(!isOpen)}
              toggleIndicator={CaretDownIcon}
            >
              {fsType || 'Select a filesystem'}
            </DropdownToggle>
          }
          isOpen={isOpen}
          dropdownItems={fsTypeDropdownItems}
          onSelect={() => setOpen(false)}
          id="odf-storage-fsType"
        />
        <span className="help-block">
          {'Filesystem Type'}
        </span>
      </div>
    )}
  </>
);

};

export const StorageEfficiencyComponent: React.FC<ProvisionerProps> = ({
  parameterKey,
  onParamChange,
}) => {
  const storageEfficiencyArray = ['thin','thick','compressed','deduplicated'];
  const [isOpen, setOpen] = React.useState(false);
  const [storageEfficiency, setstorageEfficiency] = React.useState('');
  const handleDropdownChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const name = e.currentTarget.id;
    setstorageEfficiency(name);
    onParamChange(parameterKey, name, false);
  };

  const storageEfficiencyDropdownItems = _.reduce(
    storageEfficiencyArray,
    (res, storageEfficiency) => {
      const item = (
        <DropdownItem
            key={storageEfficiency}
            component="button"
            id={storageEfficiency}
            data-test={storageEfficiency}
            onClick={handleDropdownChange}
            description={`Storage Efficiency: ${storageEfficiency}`}
          >
            {storageEfficiency}
          </DropdownItem>
      );
      res.push(item);  
      return res;
    },
    [
    ],
  );
  
return (
  <>
    {(
      <div className="form-group">
        <label className="co-required" htmlFor="odf-storage-storageEfficiency">
          {'Storage Efficiency'}
        </label>
        <Dropdown
          className="dropdown dropdown--full-width"
          toggle={
            <DropdownToggle
              id="storageEfficiency-dropdown-id"
              data-test="storageEfficiency-dropdown-toggle"
              onToggle={() => setOpen(!isOpen)}
              toggleIndicator={CaretDownIcon}
            >
              {storageEfficiency || 'Select a filesystem'}
            </DropdownToggle>
          }
          isOpen={isOpen}
          dropdownItems={storageEfficiencyDropdownItems}
          onSelect={() => setOpen(false)}
          id="odf-storage-storageEfficiency"
        />
        <span className="help-block">
          {'Storage Efficiency Type'}
        </span>
      </div>
    )}
  </>
);

};
