import type {
  JsonArray,
  JsonObject,
  JsonScalar,
  LiveList,
  LiveMap,
  LiveObject,
  ToJson,
} from "@liveblocks/core";
import { expectType } from "tsd";

{
  type Actual = ToJson<number>;
  type Expected = number;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<string>;
  type Expected = string;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<boolean>;
  type Expected = boolean;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<null>;
  type Expected = null;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<42>;
  type Expected = 42;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<"hi">;
  type Expected = "hi";

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<string | number>;
  type Expected = string | number;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<string | LiveList<number>>;
  type Expected = string | number[];

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<LiveMap<string, LiveList<number>>>;
  type Expected = { [x: string]: number[] };

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<
    LiveObject<{ a: number; b: LiveList<string>; c?: null }>
  >;
  type Expected = {
    a: number;
    b: string[];
    c?: null;
  };

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<string[]>;
  type Expected = string[];

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<JsonScalar>;
  type Expected = JsonScalar;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<JsonObject>;
  type Expected = JsonObject;

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<{
    [key: string]: JsonScalar | undefined;
    a: string;
  }>;
  type Expected = {
    [x: string]: JsonScalar | undefined;
    a: string;
  };

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<{ [key: string]: JsonScalar | undefined }>;
  type Expected = { [x: string]: JsonScalar | undefined };

  let ru!: Actual;
  expectType<Expected>(ru);
}

{
  type Actual = ToJson<{
    [key: string]: JsonScalar | JsonArray | undefined;
  }>;
  type Expected = { [x: string]: JsonScalar | JsonArray | undefined };

  let ru!: Actual;
  expectType<Expected>(ru);
}
