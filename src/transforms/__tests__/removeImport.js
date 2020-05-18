import { defineTest } from "jscodeshift/dist/testUtils";

describe("removeImport", () => {
  defineTest(
    __dirname,
    "removeImport",
    null,
    `removeImport/removeImport`,
  );
});