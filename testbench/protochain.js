// import { describe, test, expect } from '@jest/globals'; // Expliziter Import

let start = 0;

const info = {
  refFirstName: "Jim",
};
const infoExt = {
  refSecondName: "Jack",
  __proto__: info,
};
const infoAnotherExt = {
  refThirdName: "Johnny",
  __proto__: infoExt,
};

// simple test using jest
describe("protochain", () => {
  test("prototype chaining", () => {
    expect(infoAnotherExt.refFirstName).toBe(info.refFirstName);
  });
});

// console.log(info.refFirstName);
// console.log(infoAnotherExt.refFirstName);
