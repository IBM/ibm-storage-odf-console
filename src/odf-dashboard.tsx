import * as React from 'react';
import * as _ from 'lodash';
import Dashboard from '@console/shared/src/components/dashboard/Dashboard';
import DashboardGrid from '@console/shared/src/components/dashboard/DashboardGrid';

import InventoryCard from './components/dashboard-page/storage-dashboard-odf/inventory-card';
import DetailsCard from './components/dashboard-page/storage-dashboard-odf/details-card';
import StatusCard from './components/dashboard-page/storage-dashboard-odf/status-card/status-card';
import StorageEfficiencyCard from './components/dashboard-page/storage-dashboard-odf/storage-efficiency-card/storage-efficiency-card';
import UtilizationCard from './components/dashboard-page/storage-dashboard-odf/utilization-card/utilization-card';
import RawCapacityCard from './components/dashboard-page/storage-dashboard-odf/raw-capacity-card/raw-capacity-card';
import CapacityBreakdownCard from './components/dashboard-page/storage-dashboard-odf/capacity-breakdown/capacity-breakdown-card';
import ActivityCard from './components/dashboard-page/storage-dashboard-odf/activity-card/activity-card';
//import {StorageInstanceModel} from './models';
import {StorageInstanceKind} from './types';
//import {StorageInstanceStatus} from './types';

export const OdfDashboardContext = React.createContext<OdfDashboardContext>({
  });
  
export type OdfDashboardContext = {
    obj?: StorageInstanceKind;
  };

const leftCards = [{ Card: DetailsCard }, { Card: StorageEfficiencyCard }, { Card: InventoryCard }];
const mainCards = [{ Card: StatusCard }, { Card: RawCapacityCard }, { Card: CapacityBreakdownCard }, { Card: UtilizationCard }];
const rightCards = [{ Card: ActivityCard }];

export enum ActionType {
  OBJ = 'OBJ',
}

export const initialState = (obj: StorageInstanceKind): OdfDashboardState => ({
  obj,
});

export const reducer = (state: OdfDashboardState, action: OdfDashboardAction) => {
  switch (action.type) {
    case ActionType.OBJ: {
      if (action.payload === state.obj) {
        return state;
      }
      return {
        ...state,
        obj: action.payload,
      };
    }
    default:
      return state;
  }
};

const OdfDashboard: React.FC<OdfDashboardProps> = ({ obj }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState(obj));

  if (obj !== state.obj) {
    dispatch({ type: ActionType.OBJ, payload: obj });
  }

  const context = {
    obj,
  };

  return (
    <OdfDashboardContext.Provider value={context}>
      <Dashboard>
        <DashboardGrid mainCards={mainCards} leftCards={leftCards} rightCards={rightCards} />
      </Dashboard>
    </OdfDashboardContext.Provider>
  );
};

export default OdfDashboard;

type OdfDashboardProps = {
  obj: StorageInstanceKind;
};

type OdfDashboardState = {
  obj: StorageInstanceKind;
};

type OdfDashboardAction =
  | { type: ActionType.OBJ; payload: StorageInstanceKind };
