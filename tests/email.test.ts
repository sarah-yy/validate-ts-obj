import { ValidateFieldArr, ValidateObjStruct, ValueType, validateBodyObj } from '../src';

describe("Email tests", () => {
  const requiredEmailField: ValidateObjStruct = {
    name: "email",
    type: ValueType.Email,
    required: true,
  };

  const optionalEmailField: ValidateObjStruct = {
    name: "email",
    type: ValueType.Email,
  };

  const multipleInvalidFields: ValidateFieldArr = [requiredEmailField, {
    name: "altEmail",
    type: ValueType.Email,
    required: true,
  }];

  test("should return undefined for object with valid email field", () => {
    const body = { email: "abcdefg@email.com" };
    const result = validateBodyObj(body, [requiredEmailField]);
    expect(result).toBeUndefined();
  });

  test("should return undefined for missing optional email field", () => {
    const body = {};
    const result = validateBodyObj(body, [optionalEmailField]);
    expect(result).toBeUndefined();
  });

  test("should return error for missing required email field (empty map)", () => {
    const body = {};
    const result = validateBodyObj(body, [requiredEmailField]);
    expect(result).toBe("Missing email field. Please make sure to submit all required fields: email");
  });

  test("should return error if required value is undefined", () => {
    const body = { email: undefined };
    const result = validateBodyObj(body, [requiredEmailField]);
    expect(result).toBe("Missing email field. Please make sure to submit all required fields: email");
  });

  test("should return error if required value is null", () => {
    const body = { email: null };
    const result = validateBodyObj(body, [requiredEmailField]);
    expect(result).toBe("Invalid email value, please enter a valid email");
  });

  test("should return the 1st error if there are multiple email errors", () => {
    const body = {
      email: "This is the person's age",
      altEmail: "This is the person's birthYear",
    };
    const result = validateBodyObj(body, multipleInvalidFields);
    expect(result).toBe("Invalid email value, please enter a valid email");
  });

  test("should return undefined if the validateBodyObj array is empty, i.e. no need to validate", () => {
    const body = { email: "abcdefg@email.com" };
    const result = validateBodyObj(body, []);
    expect(result).toBeUndefined();
  });
});