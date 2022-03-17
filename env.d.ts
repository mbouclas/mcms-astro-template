interface ImportMetaEnv {
    readonly PUBLIC_API_URL: string;
    readonly ASTRO_KEY: string;
    readonly API_BASE_URL: string;
    // more env variables...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }