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
