import { defineTest } from "jscodeshift/dist/testUtils";

describe("removeFromJS", () => {
  defineTest(
    __dirname,
    "removeFromJS",
    null,
    `removeFromJS/removeFromJS`,
  );
});