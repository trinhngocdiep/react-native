import ReactNativeBiometrics from 'react-native-biometrics';

const BASE_URL = 'http://localhost:8080/api/v1';

class AuthService {

  private readonly rnBiometrics = new ReactNativeBiometrics();
  private readonly deviceId = 'simulator_' + Math.random();

  constructor() {
    console.log('>>>>>>constructor', this.deviceId)
  }

  async getMethods() {
    return this.rnBiometrics.isSensorAvailable().then(e => {
      return e.biometryType;
    });
  }

  async setupKeys(deleteOldKeys = true): Promise<{ success: boolean, details?: string }> {
    const { keysExist } = await this.rnBiometrics.biometricKeysExist();
    if (keysExist) {
      console.log('key existed');
      if (deleteOldKeys) {
        const { keysDeleted } = await this.rnBiometrics.deleteKeys();
        console.log('old keys deleted', keysDeleted);
      } else {
        return { success: false, details: 'Key existed' };
      }
    }
    const res = await this.rnBiometrics.createKeys();
    console.log('created new keys', res)
    const payload = {
      ...this.getCommonPayload(),
      publicKey: res.publicKey
    }
    const registerRs = await fetch(`${BASE_URL}/bio/register`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const registerJson = await registerRs.json();
    return { success: true, details: registerJson };

  }

  private getCommonPayload() {
    return {
      userId: 'test user',
      appId: 'app id',
      deviceId: this.deviceId,
    }
  }

  async sendAuth(promptMessage: string): Promise<{ success: boolean, details?: string }> {
    const commonFields = this.getCommonPayload();
    const payload = JSON.stringify(commonFields);
    const { success, signature, error } = await this.rnBiometrics.createSignature({
      promptMessage,
      payload,
    });
    if (!success) {
      return { success: false };
    }
    const requestBody = {
      signature,
      payload,
      ...commonFields,
    };
    console.log('>> request', requestBody)
    const resp = await fetch(`${BASE_URL}/bio/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    const json = await resp.json();
    return { success: true, details: json }
  }

}

const instance = new AuthService();
export default instance;