import { defineTest } from "jscodeshift/dist/testUtils";

describe("replaceSetIn", () => {
  defineTest(
    __dirname,
    "replaceSetIn",
    null,
    `replaceSetIn/replaceSetIn`,
  );
});