// import * as React from "react";
// import { useTranslation } from "react-i18next";

// import {
//   Card,
//   CardBody,
//   CardHeader,
//   CardTitle,
// } from "@patternfly/react-core";

// import { ResourceInventoryItem } from "@console/dynamic-plugin-sdk/provisional";

// const currentProvisioner = "block.csi.ibm.com";

// const InventoryCard: React.FC = () => {
//   const { t } = useTranslation();
//   const podHref = `/k8s/cluster/pods?rowFilter-pod-provisioner=${currentProvisioner}`;
//   return (
//     <Card className="co-dashboard-card co-dashboard-card--gradient">
//     <CardHeader className="co-dashboard-card__header">
//       <CardTitle className="co-dashboard-card__title">{t('Inventory')}</CardTitle>
//     </CardHeader>
//     <CardBody className="co-dashboard-card__body">
//       <ResourceInventoryItem
//         // kind={"pod"}
//         // resources={getCustomizedPods(podsData, currentProvisioner, filteredPVCs)}
//         // mapper={getPodStatusGroups}
//         showLink={true}
//         basePath={podHref}
//         />
//     </CardBody>
//   </Card>
//   )
// };

// export default InventoryCard;