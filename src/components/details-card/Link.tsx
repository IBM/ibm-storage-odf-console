import * as React from 'react';

export const ExternalLink: React.FC<ExternalLinkProps> = ({
    children,
    href,
    text,
    dataTestID,
    stopPropagation,
  }) => (
    <a
      className='co-external-link'
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-test-id={dataTestID}
      {...(stopPropagation ? { onClick: (e) => e.stopPropagation() } : {})}
    >
      {children || text}
    </a>
  );

type ExternalLinkProps = {
href: string;
text?: React.ReactNode;
additionalClassName?: string;
dataTestID?: string;
stopPropagation?: boolean;
};
