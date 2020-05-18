import { defineTest } from "jscodeshift/dist/testUtils";

describe("replaceMerge", () => {
  defineTest(
    __dirname,
    "replaceMerge",
    null,
    `replaceMerge/replaceMerge`,
  );
});