import { defineTest } from "jscodeshift/dist/testUtils";

describe("replaceGetIn", () => {
  defineTest(
    __dirname,
    "replaceGetIn",
    null,
    `replaceGetIn/replaceGetIn`,
  );
});