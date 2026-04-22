/// <reference types="vite/client" />

declare const __HAS_GATEWAY_KEY__: boolean;

declare module '*?url' {
  const src: string;
  export default src;
}
