import type {
  JsonArray,
  JsonScalar,
  LiveList,
  LiveMap,
  LiveObject,
  ToImmutable,
} from "@liveblocks/core";
import { expectType } from "tsd";

{
  type Actual = ToImmutable<number>;
  type Expected = number;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToImmutable<string>;
  type Expected = string;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToImmutable<boolean>;
  type Expected = boolean;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToImmutable<null>;
  type Expected = null;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToImmutable<42>;
  type Expected = 42;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToImmutable<"hi">;
  type Expected = "hi";

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToImmutable<string | number>;
  type Expected = string | number;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToImmutable<string | LiveList<number>>;
  type Expected = string | readonly number[];

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToImmutable<LiveMap<string, LiveList<number>>>;
  type Expected = ReadonlyMap<string, readonly number[]>;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToImmutable<
    LiveObject<{ a: number; b: LiveList<string>; c?: null }>
  >;
  type Expected = {
    readonly a: number;
    readonly b: readonly string[];
    readonly c?: null;
  };

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToImmutable<string[]>;
  type Expected = string[];

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToImmutable<JsonScalar>;
  type Expected = JsonScalar;

  let ru!: Actual;
  expectType<Expected>(ru);
}

// {
//   type Actual = ToImmutable<JsonObject>;
//   type Expected = JsonObject;
//                   ^^^^^^^^^^ Issue: this infinitely expands!
//
//   let ru!: Actual;
//   expectType<Expected>(ru);
// }

{
  type Actual = ToImmutable<{
    [key: string]: JsonScalar | undefined;
    a: string;
  }>;
  type Expected = {
    readonly [x: string]: JsonScalar | undefined;
    readonly a: string;
  };

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToImmutable<{ [key: string]: JsonScalar | undefined }>;
  type Expected = {
    readonly [x: string]: JsonScalar | undefined;
  };

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToImmutable<{
    [key: string]: JsonScalar | JsonArray | undefined;
  }>;
  type Expected = {
    readonly [x: string]: JsonScalar | JsonArray | undefined;
  };

  let ru!: Actual;
  expectType<Expected>(ru);
}
