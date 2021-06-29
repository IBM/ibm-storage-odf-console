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
import { useTranslation } from 'react-i18next';

export const DetailItem: React.FC<DetailItemProps> = React.memo(
  ({ title, isLoading = false, children, error = false, errorMessage }) => {
    const { t } = useTranslation();

    let status: React.ReactNode;

    if (error) {
      status = (
        <span className="text-secondary">{errorMessage || t('console-shared~Not available')}</span>
      );
    } else if (isLoading) {
      status = <div className="skeleton-text" />;
    } else {
      status = children;
    }
    return (
      <>
        <dt className="co-details-card__item-title">{title}</dt>
        <dd className='co-details-card__item-value'>{status}</dd>
      </>
    );
  },
);

export default DetailItem;

type DetailItemProps = {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  error?: boolean;
  valueClassName?: string;
  errorMessage?: string;
};
