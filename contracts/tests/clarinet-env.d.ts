// TypeScript declaration for the Clarinet simnet global
declare const simnet: import("@hirosystems/clarinet-sdk").Simnet;

// Custom Vitest matchers for Clarity values
declare global {
  namespace Vi {
    interface Assertion<T = any> {
      toBeOk(expected?: any): T;
      toBeErr(expected?: any): T;
      toBeSome(expected?: any): T;
      toBeNone(): T;
      toBeUint(expected: number | bigint): T;
      toBeInt(expected: number | bigint): T;
      toBeBool(expected: boolean): T;
      toBeAscii(expected: string): T;
      toBeUtf8(expected: string): T;
      toBePrincipal(expected: string): T;
      toBeBuff(expected: Uint8Array): T;
      toBeTuple(expected: Record<string, any>): T;
      toBeList(expected: any[]): T;
    }
  }
} 