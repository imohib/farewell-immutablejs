import { defineTest } from "jscodeshift/dist/testUtils";

describe("removeToJS", () => {
  defineTest(
    __dirname,
    "removeToJS",
    null,
    `removeToJS/removeToJS`,
  );
});