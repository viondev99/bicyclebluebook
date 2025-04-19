declare module '@kount/kount-web-client-sdk' {
  export interface KountConfig {
    clientID: string;
    hostname?: string;
    environment?: string;
    isSinglePageApp: boolean;
    'collect-begin'?: (params: any) => void;
    'collect-end'?: (params: any) => void;
  }

  function kountSDK(kountConfig: KountConfig, sessionId: string): void;

  export default kountSDK;
}
