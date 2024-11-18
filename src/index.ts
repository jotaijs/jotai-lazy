import { useAtomValue } from "./use-atom-value";
import { useSetAtom } from "jotai";
import type {
  Atom,
  ExtractAtomArgs,
  ExtractAtomResult,
  ExtractAtomValue,
  PrimitiveAtom,
  SetStateAction,
  WritableAtom,
} from "jotai/vanilla";

type SetAtom<Args extends unknown[], Result> = (...args: Args) => Result;

type Options = Parameters<typeof useAtomValue>[1];

export function useAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  options?: Options,
): [Awaited<Value>, SetAtom<Args, Result>];

export function useAtom<Value>(
  atom: PrimitiveAtom<Value>,
  options?: Options,
): [Awaited<Value>, SetAtom<[SetStateAction<Value>], void>];

export function useAtom<Value>(
  atom: Atom<Value>,
  options?: Options,
): [Awaited<Value>, never];

export function useAtom<
  AtomType extends WritableAtom<unknown, never[], unknown>,
>(
  atom: AtomType,
  options?: Options,
): [
  Awaited<ExtractAtomValue<AtomType>>,
  SetAtom<ExtractAtomArgs<AtomType>, ExtractAtomResult<AtomType>>,
];

export function useAtom<AtomType extends Atom<unknown>>(
  atom: AtomType,
  options?: Options,
): [Awaited<ExtractAtomValue<AtomType>>, never];

export function useAtom<Value, Args extends unknown[], Result>(
  atom: Atom<Value> | WritableAtom<Value, Args, Result>,
  options?: Options,
): any {
  const object = useAtomValue(atom, options);
  // We do wrong type assertion here, which results in throwing an error.
  const setter = useSetAtom(atom as WritableAtom<Value, Args, Result>, options);
  return {
    get 0() {
      return object.value;
    },
    get 1() {
      return setter;
    },
    [Symbol.iterator]: function* () {
      yield object.value;
      yield setter;
    },
  };
}

export { useAtomValue, useSetAtom };
