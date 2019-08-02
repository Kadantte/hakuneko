const path = require('path');
const fs = require('fs-extra');
const assert = require('assert');
const ConfigurationLinux = require('../../src/app/ConfigurationLinux.js');

describe('ConfigurationLinux', function() {

    describe('defaults must be valid', function() {

        let testee = new ConfigurationLinux(undefined);

        it('isPortableMode', () => {
            let file = process.execPath + '.portable';
            fs.createFileSync(file);
            assert.equal(ConfigurationLinux.isPortableMode, true);
            fs.unlinkSync(file);
            assert.equal(ConfigurationLinux.isPortableMode, false);
        });

        it('publicKey', () => {
            assert.equal(testee.publicKey.startsWith('-----BEGIN PUBLIC KEY-----'), true);
            assert.equal(testee.publicKey.endsWith('-----END PUBLIC KEY-----'), true);
            assert.equal(testee.publicKey.includes('owIDAQAB'), true);
            assert.equal(testee.publicKey.length, 450);
        });

        it('applicationProtocol', () => {
            assert.equal(testee.applicationProtocol, 'cache');
        });

        it('applicationUpdateURL', () => {
            assert.equal(testee.applicationUpdateURL, 'http://static.hakuneko.download/5.0.8/latest');
        });

        it('connectorProtocol', () => {
            assert.equal(testee.connectorProtocol, 'connector');
        });

        it('applicationStartupURL', () => {
            assert.equal(testee.applicationStartupURL, 'cache://hakuneko/index.html');
        });

        (process.platform === 'linux' ? it : it.skip)('applicationCacheDirectory', () => {
            assert.equal(testee.applicationCacheDirectory, path.join(process.env.HOME, '.cache', 'Electron'));
        });

        (process.platform === 'linux' ? it : it.skip)('applicationUserDataDirectory', () => {
            // NOTE: Mocha changes the user data directory, so we check against this instead against the real one
            assert.equal(testee.applicationUserDataDirectory, require('electron').app.getPath('userData'));
            //assert.equal(testee.applicationUserDataDirectory, path.join(process.env.HOME, '.config', 'Electron'));
        });
    });

    describe('must accept supported options', function() {

        let expected = {
            publicKey: 'publicKey',
            applicationProtocol: 'applicationProtocol',
            applicationUpdateURL: 'applicationUpdateURL',
            connectorProtocol: 'connectorProtocol',
            applicationStartupURL: 'protocol://applicationStartupURL',
            applicationCacheDirectory: 'applicationCacheDirectory',
            applicationUserDataDirectory: 'applicationUserDataDirectory'
        };
        let testee = new ConfigurationLinux(expected);

        it('publicKey', () => {
            assert.notEqual(testee.publicKey, expected.publicKey);
        });

        it('applicationProtocol', () => {
            assert.equal(testee.applicationProtocol, expected.applicationStartupURL.split(':')[0]);
        });

        it('applicationUpdateURL', () => {
            assert.equal(testee.applicationUpdateURL, expected.applicationUpdateURL);
        });

        it('connectorProtocol', () => {
            assert.notEqual(testee.connectorProtocol, expected.connectorProtocol);
        });

        it('applicationStartupURL', () => {
            assert.equal(testee.applicationStartupURL, expected.applicationStartupURL);
        });

        it('applicationCacheDirectory', () => {
            assert.equal(testee.applicationCacheDirectory.endsWith(expected.applicationCacheDirectory), true);
        });

        it('applicationUserDataDirectory', () => {
            assert.equal(testee.applicationUserDataDirectory.endsWith(expected.applicationUserDataDirectory), true);
        });
    });
});