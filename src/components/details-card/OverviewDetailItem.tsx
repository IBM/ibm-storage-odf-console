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
import {
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Skeleton,
} from '@patternfly/react-core';

type OverviewDetailItemProps = {
  title: string;
  isLoading?: boolean;
  children: React.ReactNode;
};

export const OverviewDetailItem: React.FC<OverviewDetailItemProps> = ({
  title,
  isLoading = false,
  children,
}) => {
  return (
    <DescriptionListGroup>
      <DescriptionListTerm>{title}</DescriptionListTerm>
      <DescriptionListDescription>
        {isLoading ? <Skeleton /> : children}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

