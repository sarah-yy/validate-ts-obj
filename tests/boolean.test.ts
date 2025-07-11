import { ValidateFieldArr, ValidateObjStruct, ValueType, validateBodyObj } from '../src';

const requiredBooleanField: ValidateObjStruct = {
  name: "isSubmitted",
  type: ValueType.Boolean,
  required: true,
};

const optionalBooleanField: ValidateObjStruct = {
  name: "isSubmitted",
  type: ValueType.Boolean,
};

const multipleInvalidFields: ValidateFieldArr = [requiredBooleanField, {
  name: "isValid",
  type: ValueType.Boolean,
  required: true,
}];

describe("Boolean tests", () => {
  test("should return undefined for object with valid boolean field", () => {
    const body = { isSubmitted: false };
    const result = validateBodyObj(body, [requiredBooleanField]);
    expect(result).toBeUndefined();
  });

  test("should return undefined for missing optional boolean field", () => {
    const body = {};
    const result = validateBodyObj(body, [optionalBooleanField]);
    expect(result).toBeUndefined();
  });

  test("should return error for missing required boolean field (empty map)", () => {
    const body = {};
    const result = validateBodyObj(body, [requiredBooleanField]);
    expect(result).toBe("Missing isSubmitted field. Please make sure to submit all required fields: isSubmitted");
  });

  test("should return error if required value is undefined", () => {
    const body = { isSubmitted: undefined };
    const result = validateBodyObj(body, [requiredBooleanField]);
    expect(result).toBe("Missing isSubmitted field. Please make sure to submit all required fields: isSubmitted");
  });

  test("should return error if required value is null", () => {
    const body = { isSubmitted: null };
    const result = validateBodyObj(body, [requiredBooleanField]);
    expect(result).toBe("Invalid isSubmitted value, please enter a boolean");
  });

  test("should return error if required value is invalid", () => {
    const body = { isSubmitted: 26 };
    const result = validateBodyObj(body, [requiredBooleanField]);
    expect(result).toBe("Invalid isSubmitted value, please enter a boolean");
  });

  test("should return the 1st error if there are multiple boolean errors", () => {
    const body = {
      isSubmitted: "This indicates if the person has submitted the form.",
      altEmail: "This indicates if the person's submission is valid.",
    };
    const result = validateBodyObj(body, multipleInvalidFields);
    expect(result).toBe("Invalid isSubmitted value, please enter a boolean");
  });

  test("should return undefined if the validateBodyObj array is empty, i.e. no need to validate", () => {
    const body = { isSubmitted: false };
    const result = validateBodyObj(body, []);
    expect(result).toBeUndefined();
  });
});