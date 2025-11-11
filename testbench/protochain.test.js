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
  refThirdName: "John",
  __proto__: infoExt,
};

//defining jest test, that test whether info..refFirstName is equal to infoAnotherExt.refFirstName

describe("protochain", () => {
  test("protochain", () => {
    expect(infoAnotherExt.refFirstName).toBe(info.refFirstName);
  });
});

// console.log(info.refFirstName);
// console.log(infoAnotherExt.refFirstName);
