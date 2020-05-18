import { defineTest } from "jscodeshift/dist/testUtils";

describe("replaceGet", () => {
  defineTest(
    __dirname,
    "replaceGet",
    null,
    `replaceGet/replaceGet`,
  );
});