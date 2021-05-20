import { NS } from '../utils/consts';

export const poolData = {
  apiVersion: 'ceph.rook.io/v1',
  kind: 'CephBlockPool',
  metadata: {
    name: 'foo',
    namespace: NS,
  },
  spec: {
    compressionMode: '',
    replicated: {
      size: 2,
    },
  },
};
