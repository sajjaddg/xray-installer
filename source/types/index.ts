export interface Config {
    name: string;
    email: string;
    port: number;
    sni: string;
    path: string;
    inbounds: Array<{
      port: number;
      settings: {
        clients: Array<{
          email: string;
          id: string;
          flow:string
        }>;
      };
      streamSettings: {
        realitySettings: {
          dest: string;
          serverNames: string[];
          privateKey: string;
          shortIds: string[];
        };
      };
    }>;
  }