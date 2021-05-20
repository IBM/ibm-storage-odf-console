import * as React from 'react';
import {
    CreateIBMStorage,
    isCreateIBMStorage,
    useResolvedExtensions,
  } from '@console/dynamic-plugin-sdk';

export const StorageInstance = ({ match: { params }}) => {
    const [createIBMStorageExtensions, resolved] = useResolvedExtensions<CreateIBMStorage>(isCreateIBMStorage);
    console.log({createIBMStorageExtensions: createIBMStorageExtensions, resolved: resolved});
    const createIBMStorage = createIBMStorageExtensions[0]?.properties.handler({ns: params?.ns});
    console.log(createIBMStorage);
    return createIBMStorage? createIBMStorage: (<div>Loading Failed</div>);
};


