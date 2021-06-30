import * as React from 'react';
import * as _ from 'lodash';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Gallery,
  GalleryItem,
} from "@patternfly/react-core";
import {
  useK8sWatchResource,
} from "@console/dynamic-plugin-sdk/api";
import {
  HealthItem,
} from "@console/dynamic-plugin-sdk/provisional";
import { getFlashsystemHealthState } from './utils';
import { StorageInstanceKind } from '../../types';
//import { StorageInstanceModel } from '../../../../models';
import {GetFlashSystemResource} from '../../constants/resources'

export const StatusCard: React.FC<any> = (props) => {
  const [data, loaded, loadError] = useK8sWatchResource<StorageInstanceKind>(GetFlashSystemResource(props?.match?.params?.name, props?.match?.params?.namespace));
  const flashHealthState = getFlashsystemHealthState({ sto: { data: data, loaded: loaded, loadError: loadError } });

  return (
    <Card className="co-dashboard-card co-dashboard-card--gradient">
      <CardHeader className="co-dashboard-card__header">
        <CardTitle className="co-dashboard-card__title">Status</CardTitle>
      </CardHeader>
      <CardBody className="co-dashboard-card__body">
        <div className="co-dashboard-card__body--top-margin co-status-card__health-body">
          <Gallery className="co-overview-status__health" hasGutter>
            <GalleryItem>
              <HealthItem
                title={props?.match?.params?.name}
                state={flashHealthState.state}
                details={flashHealthState.message}
              />
            </GalleryItem>
          </Gallery>
        </div>
      </CardBody>
    </Card>
  );
};

export default StatusCard;
