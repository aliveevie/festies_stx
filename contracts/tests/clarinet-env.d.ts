// TypeScript declaration for the Clarinet simnet global
declare const simnet: import("@hirosystems/clarinet-sdk").Simnet;

// Custom Vitest matchers for Clarity values
declare module "vitest" {
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
  
  interface AsymmetricMatchersContaining {
    toBeOk(expected?: any): any;
    toBeErr(expected?: any): any;
    toBeSome(expected?: any): any;
    toBeNone(): any;
    toBeUint(expected: number | bigint): any;
    toBeInt(expected: number | bigint): any;
    toBeBool(expected: boolean): any;
    toBeAscii(expected: string): any;
    toBeUtf8(expected: string): any;
    toBePrincipal(expected: string): any;
    toBeBuff(expected: Uint8Array): any;
    toBeTuple(expected: Record<string, any>): any;
    toBeList(expected: any[]): any;
  }
} 