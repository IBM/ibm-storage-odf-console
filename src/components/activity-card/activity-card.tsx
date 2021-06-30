import * as React from 'react';
import * as _ from 'lodash';
import {
  DashboardCard,
  DashboardCardBody,
  DashboardCardHeader,
  DashboardCardTitle,
  ActivityBody,
  RecentEventsBody,
} from '@console/dynamic-plugin-sdk/provisional';
import {
  useK8sWatchResource,
} from "@console/dynamic-plugin-sdk/api";
import { FirehoseResource } from "@console/dynamic-plugin-sdk";
import {getNamespace} from "../../selectors/index";
//import { IBM_STORAGE_ODF_OPERATOR } from '../../constants/index';
import {
   PersistentVolumeClaimModel, 
   EventModel,    
  } from '../../models';
import './activity-card.scss';
import {GetFlashSystemResource} from '../../constants/resources';
import { StorageInstanceKind, EventKind } from '../../types';

const eventsResource: FirehoseResource = { isList: true, kind: EventModel.kind, prop: 'events' };

const RecentEvent = (props) =>{
  const [data, loaded, loadError] = useK8sWatchResource<StorageInstanceKind>(GetFlashSystemResource(props?.match?.params?.name, props?.match?.params?.namespace));
  const namespace= loaded && !loadError? data?.[0]?.metadata.namespace: '';
  const odfEventNamespaceKindFilter = (event: EventKind): boolean => {
    const eventKind = event?.involvedObject?.kind;
    const eventNamespace = getNamespace(event);
    return eventNamespace === namespace || eventKind === PersistentVolumeClaimModel.kind;
  };
  const [events, eventsLoaded] = useK8sWatchResource(eventsResource);
  return (
    <RecentEventsBody
      events={{ data: events, loaded: eventsLoaded } as any}
      filter={odfEventNamespaceKindFilter}
    />
  );
};

export const ActivityCard: React.FC<any> = (props) => {
  return (
  <DashboardCard gradient>
    <DashboardCardHeader>
      <DashboardCardTitle>Activity</DashboardCardTitle>
    </DashboardCardHeader>
    <DashboardCardBody>
      <ActivityBody className="flashsystem-activity-card__body">
        <RecentEvent {...props}/>
      </ActivityBody>
    </DashboardCardBody>
  </DashboardCard>
  )
};

export default ActivityCard;
