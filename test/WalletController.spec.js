import {expect, assert} from 'chai';
import {WalletController} from "../src/controllers";
import {encrypt} from "../src/lib/encryprtor";

describe('WalletController', () => {
    const password = 'example';
    const initState = {vault: encrypt([], password)}
    const seed = 'some useful example seed with needed length of twenty bytes'
    it('Should init vault', () => {
        const controller = new WalletController();
        controller.initVault(password);
        expect(controller.store.getState().vault).to.be.a('string')
    });

    it('Should not init vault without password', () => {
        const controller = new WalletController();
        expect(() => controller.initVault()).to.throw('Password is required')
    });

    it('Should create controller from init state and lock/unlock it', () => {
        const controller = new WalletController({initState});
        controller.unlock(password);
        expect(controller.store.getState().locked).to.be.false;
        controller.lock();
        expect(controller.store.getState().locked).to.be.true;
    });

    it('Should set new password', () => {
        const controller = new WalletController({initState});
        controller.newPassword(password, 'newPassword');
        controller.unlock('newPassword');
        expect(controller.store.getState().locked).to.be.false;
    });

    it('Should not set new password with invalid old pass', () => {
        const controller = new WalletController({initState});
        expect(()=>controller.newPassword('bad pass', 'newPassword')).to.throw('Invalid password')
    });

    it('Should not set new password with no new password', () => {
        const controller = new WalletController({initState});
        expect(()=>controller.newPassword(undefined, 'newPassword')).to.throw('Password is required')
    });

    it('Should add wallets', () => {
        const controller = new WalletController({initState});
        controller.unlock(password);
        controller.addWallet({type: 'seed', networkCode: 'T', seed});
        expect(controller.wallets.length).to.eq(1)
    });

    it('Should not add duplicate wallets', () => {
        const controller = new WalletController({initState});
        controller.unlock(password);
        controller.addWallet({type: 'seed', networkCode: 'T', seed});
        expect(() => controller.addWallet({type: 'seed', networkCode: 'T', seed})).to.throw(/Account with address .+/)
    });

    it('Should not add wallets with same seed for different networks', () => {
        const controller = new WalletController({initState});
        controller.unlock(password);
        controller.addWallet({type: 'seed', networkCode: 'T', seed});
        controller.addWallet({type: 'seed', networkCode: 'W', seed});
        expect(controller.wallets.length).to.eq(2)
    });

    it('Should remove wallets', () => {
        const controller = new WalletController({initState});
        controller.unlock(password);
        controller.addWallet({type: 'seed', networkCode: 'T', seed});
        controller.addWallet({type: 'seed', networkCode: 'T', seed:seed + '1'});

        controller.removeWallet(controller.wallets[0].getAccount().address);
        expect(controller.wallets.length).to.eq(1)
    });

    it('Should export account', () => {
        const controller = new WalletController({initState});
        controller.unlock(password);
        controller.addWallet({type: 'seed', networkCode: 'T', seed});

        const exported = controller.exportAccount(controller.wallets[0].getAccount().address);
        expect(exported).to.eq(seed)
    });
});