import * as React from 'react';
import { withTranslation } from 'react-i18next';
import * as styles from './createOrder.styl';
import { Balance, DateFormat } from '../../ui';
import { getFee } from './parseTx';
import { getMoney } from '../../../utils/converters';
import {
  ComponentProps,
  MessageData,
} from 'ui/components/transactions/BaseTransaction';

class CreateOrderInfoComponent extends React.PureComponent<
  Pick<ComponentProps, 't' | 'message' | 'assets'>
> {
  render() {
    const { t, message, assets } = this.props;
    const { messageHash, data = {} as MessageData } = message;
    const tx = { type: data.type, ...data.data };

    const fee = getMoney(getFee(tx), assets);
    return (
      <div>
        <div className={styles.txRow}>
          <div className="tx-title tag1 basic500">{t('transactions.txid')}</div>
          <div className={styles.txValue}>{messageHash}</div>
        </div>

        <div className={styles.txRow}>
          <div className="tx-title tag1 basic500">{t('transactions.fee')}</div>
          <div className={styles.txValue}>
            <Balance isShortFormat={true} balance={fee} showAsset={true} />
          </div>
        </div>

        <div className={styles.txRow}>
          <div className="tx-title tag1 basic500">
            {t('transactions.txTime')}
          </div>
          <div className={styles.txValue}>
            <DateFormat date={tx.timestamp} />
          </div>
        </div>
      </div>
    );
  }
}

export const CreateOrderInfo = withTranslation()(CreateOrderInfoComponent);
