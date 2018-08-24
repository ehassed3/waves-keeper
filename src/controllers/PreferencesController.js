import ObservableStore from 'obs-store';
import log from 'loglevel'

export class PreferencesController {
    constructor(options = {}) {
        const defaults = {
            currentLocale: options.initLangCode || 'en',
            accounts: [],
            selectedAccount: undefined
        };

        const initState = Object.assign({}, defaults, options.initState);
        this.store = new ObservableStore(initState)
    }


    setCurrentLocale(key) {
        this.store.updateState({currentLocale: key})
    }

    addAccount(account) {
        const accounts = this.store.getState().accounts;
        if (!this._getAccountByAddress(account.address)) {
            accounts.push(Object.assign({name: `Account ${accounts.length + 1}`}, account));
            this.store.updateState({accounts})
        } else {
            log.log(`Account with address key ${account.address} already exists`)
        }
    }

    syncAccounts(fromKeyrings) {
        const oldAccounts = this.store.getState().accounts;
        const accounts = fromKeyrings.map((account, i) => {
            return Object.assign(
                {name: `Account ${i + 1}`},
                account,
                oldAccounts.find(oldAcc => oldAcc.address === account.address)
            )
        });
        this.store.updateState({accounts});

        // Ensure we have selected account
        let selectedAccount = this.store.getState().selectedAccount;
        if (!selectedAccount || !accounts.find(account => account.address === selectedAccount)){
            selectedAccount = accounts.length > 0 ? accounts[0].address : undefined;
            this.store.updateState({selectedAccount})
        }
    }

    addLabel(account, label) {
        const accounts = this.store.getState().accounts;
        const index = accounts.findIndex(current => current.address === account.address);
        accounts[index].name = label;
        this.store.updateState({accounts})
    }

    selectAccount(address) {
        //const selectedAccount = this._getAccountByAddress(publicKey);
        this.store.updateState({selectedAccount: address})
    }

    _getAccountByAddress(address) {
        const accounts = this.store.getState().accounts;
        return accounts.find(account => account.address === address)
    }
}