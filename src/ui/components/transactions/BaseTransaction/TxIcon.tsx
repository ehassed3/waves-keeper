import * as React from 'react';
import cn from 'classnames';

export function TxIcon({
  txType,
  small = null,
  className = '',
  children = null,
}: {
  txType: string;
  small?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  className = cn(
    className,
    `${txType}-transaction-icon${small ? '-small' : ''}`
  );
  return <div className={className}>{children}</div>;
}
