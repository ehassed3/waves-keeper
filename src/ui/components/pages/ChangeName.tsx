import * as styles from './styles/changeName.styl';
import * as React from 'react';
import {connect} from 'react-redux';
import { changeAccountName } from '../../actions';
import {Trans, translate} from 'react-i18next';
import { Button, Input } from '../ui';

@translate('extension')
class ChangeAccountNameComponent extends React.PureComponent {
    readonly props;
    readonly state = { newName: null };

    setNewName = event => this.setState({ newName: event.target.value });
    onSubmit = (event) => this.changeName(event);

    changeName(event) {
        event.preventDefault();
        const name = this.state.newName;
        const address = this.props.account.address;
        this.props.changeAccountName({ name, address });
        this.props.onBack();
    }

    render() {
        return <div className={styles.content}>
            <h2 className={`title1 margin3 left`}>
                <Trans i18nKey='changeName.title'>Change name</Trans>
            </h2>

            <div className="tag1 basic500 input-title">
                <Trans i18nKey='changeName.currentName'>Current account name</Trans>
            </div>

            <div className="body1 font400 margin-main-big">{this.props.account.name}</div>

            <div className="separator margin-main-big"></div>

            <form onSubmit={this.onSubmit}>
                <div className="tag1 basic500 input-title">
                    <Trans i18nKey='changeName.newName'>New account name</Trans>
                </div>

                <div className="margin-main-big">
                    <Input onChange={this.setNewName} value={this.state.newName} maxLength='26'/>
                </div>

                <Button type='submit'>
                    <Trans i18nKey='changeName.save'>Save</Trans>
                </Button>
            </form>
        </div>;
    }

    static getDerivedStateFromProps(props, state) {
        const newName = state.newName === null ? props.account.name : state.newName;
        return { newName };
    }
}


const mapToProps = (store) => {
    const activeAccount = store.selectedAccount.address;
    const selected =  store.localState.assets.account ?  store.localState.assets.account.address : activeAccount;

    return {
        account: store.accounts.find(({ address }) => address === selected)
    };
};

const actions = {
    changeAccountName,
};

export const ChangeAccountName = connect(mapToProps, actions)(ChangeAccountNameComponent);
