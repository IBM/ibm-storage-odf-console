// import * as React from "react";
// import { useTranslation } from "react-i18next";
// import {
//   Card,
//   CardBody,
//   CardHeader,
//   CardTitle,
//   Grid,
//   GridItem,
// } from "@patternfly/react-core";

// import { 
//   DashboardPrometheusUtilizationItem,  
//  } from "@console/dynamic-plugin-sdk/provisional";

//  import {
//   FlashsystemDashboardQuery,  
//   UTILIZATION_QUERY_ODF,
// } from '../constants/queries';

// import {
//   humanizeNumber,
//   humanizeSeconds,
//   secondsToNanoSeconds,
//   humanizeBinaryBytes,
//   humanizeDecimalBytesPerSec,
// } from "../humanize";

// const humanizeIOPS = (value) => {
//   const humanizedNumber = humanizeNumber(value);
//   const unit = 'IOPS';
//   return {
//     ...humanizedNumber,
//     string: `${humanizedNumber.value} ${humanizedNumber.unit}`,
//     unit,
//   };
// };

// const humanizeLatency = (value) => {
//   const humanizedTime = humanizeSeconds(secondsToNanoSeconds(value), null, 'ms');
//   return humanizedTime;
// };


// const UtilizationCard: React.FC = () => {
//   const { t } = useTranslation();
//   return (
//     <Card className="co-dashboard-card co-dashboard-card--gradient">
//     <CardHeader className="co-dashboard-card__header">
//       <CardTitle className="co-dashboard-card__title">{t('Utilization')}</CardTitle>
//       {/* <Dropdown items={Duration(t)} onChange={setDuratsion} selectedKey={duration} title={duration} /> */}
//     </CardHeader>
//     <CardBody className="co-dashboard-card__body">
//       <Grid>
//         <GridItem span={12}>
//           <DashboardPrometheusUtilizationItem
//             title={t("Capacity")}
//             utilizationQuery={UTILIZATION_QUERY_ODF[FlashsystemDashboardQuery.UTILIZATION_CAPACITY_QUERY]}
//             duration="1 hour"
//             humanizeValue={humanizeBinaryBytes}
//           />
//         </GridItem>
//         <GridItem span={12}>
//           <DashboardPrometheusUtilizationItem
//             title={t("IOPS")}
//             utilizationQuery={UTILIZATION_QUERY_ODF[FlashsystemDashboardQuery.UTILIZATION_IOPS_QUERY]}
//             duration="1 hour"
//             humanizeValue={humanizeIOPS}
//           />
//         </GridItem>
//         <GridItem span={12}>
//           <DashboardPrometheusUtilizationItem
//             title={t("Latency")}
//             utilizationQuery={UTILIZATION_QUERY_ODF[FlashsystemDashboardQuery.UTILIZATION_LATENCY_QUERY]}
//             duration="1 hour"
//             humanizeValue={humanizeLatency}
//           />
//         </GridItem>
//         <GridItem span={12}>
//           <DashboardPrometheusUtilizationItem
//             title={t("Throughput")}
//             utilizationQuery={UTILIZATION_QUERY_ODF[FlashsystemDashboardQuery.UTILIZATION_THROUGHPUT_QUERY]}
//             duration="1 hour"
//             humanizeValue={humanizeDecimalBytesPerSec}
//           />
//         </GridItem>    
//       </Grid>
//     </CardBody>
//   </Card>
//   )
// };

// export default UtilizationCard