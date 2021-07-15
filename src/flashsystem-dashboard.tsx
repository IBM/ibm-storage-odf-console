/**
 * Copyright contributors to the ibm-storage-odf-console project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 import * as React from 'react';
 import * as _ from 'lodash';
 import { Helmet } from "react-helmet";
 import { RouteComponentProps } from "react-router";
 import { HorizontalNav, PageHeading } from "@console/dynamic-plugin-sdk/provisional";
 import { Grid, GridItem } from "@patternfly/react-core";
 
 import StorageEfficiencyCard from './components/storage-efficiency-card/storage-efficiency-card';

 export type ODFDashboardProps = {
  match: RouteComponentProps["match"];
};

 const UpperSection: React.FC = (props) => {
   return (
     <Grid hasGutter>
       <GridItem span={3}>          
          <StorageEfficiencyCard/>
       </GridItem>
       <GridItem span={6}>         
       </GridItem>
       <GridItem span={3} >
       </GridItem>
     </Grid>
   );
 };
 
 const FlashsystemDashboard: React.FC<ODFDashboardProps> = (props) => {
   return (
     <>
       <div className="co-dashboard-body">
         <UpperSection {...props}/>
       </div>
     </>
   );
 };
 
 const FlashsystemDashboardPage: React.FC<ODFDashboardProps> = ({ match }) => {
   const title = "IBM FlashSystem";
   const allPages = [
     {
       href: "",
       name: "Overview",
       component: FlashsystemDashboard,
     },
   ];
   return (
     <>
       <Helmet>
         <title>{title}</title>
       </Helmet>
       <PageHeading title={title} detail={true} />
       <HorizontalNav match={match} pages={allPages} noStatusBox />
     </>
   );
 };
 
 export default FlashsystemDashboardPage;
