import { defineTest } from "jscodeshift/dist/testUtils";

describe("nestFromJS", () => {
  defineTest(
    __dirname,
    "nestFromJS",
    null,
    `nestFromJS/nestFromJS`,
  );
});