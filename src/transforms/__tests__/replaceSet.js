import { defineTest } from "jscodeshift/dist/testUtils";

describe("replaceSet", () => {
  defineTest(
    __dirname,
    "replaceSet",
    null,
    `replaceSet/replaceSet`,
  );
});