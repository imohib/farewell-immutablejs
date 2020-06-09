import { defineTest } from "jscodeshift/dist/testUtils";

describe("addDeprecationComment", () => {
  defineTest(
    __dirname,
    "addDeprecationComment",
    null,
    `addDeprecationComment/addDeprecationComment`,
  );
});
