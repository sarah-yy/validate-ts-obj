import { ValidateFieldArr, ValidateObjStruct, ValueType, validateBodyObj } from '../src';

const requiredNumField: ValidateObjStruct = {
  name: "age",
  type: ValueType.Number,
  required: true,
};

const optionalNumField: ValidateObjStruct = {
  name: "age",
  type: ValueType.Number,
};

const numWithinRange: ValidateObjStruct = {
  ...optionalNumField,
  minNum: 1,
  maxNum: 20,
};

const numBelowMaxNum: ValidateObjStruct = {
  ...optionalNumField,
  maxNum: 50,
};

const numAboveMinNum: ValidateObjStruct = {
  ...optionalNumField,
  minNum: 1,
};

const multipleInvalidFields: ValidateFieldArr = [requiredNumField, {
  name: "birthYear",
  type: ValueType.Number,
  required: true,
}];

describe("Number tests", () => {
  test("should return undefined for object with valid number field", async () => {
    const body = { age: 30 };
    const result = validateBodyObj(body, [requiredNumField]);
    expect(result).toBeUndefined();
  });

  test("should return undefined for missing optional number field", () => {
    const body = {};
    const result = validateBodyObj(body, [optionalNumField]);
    expect(result).toBeUndefined();
  });

  test("should return error for missing required number field (empty map)", () => {
    const body = {};
    const result = validateBodyObj(body, [requiredNumField]);
    expect(result).toBe("Missing age field. Please make sure to submit all required fields: age");
  });

  test("should return error if required value is undefined", () => {
    const body = { age: undefined };
    const result = validateBodyObj(body, [requiredNumField]);
    expect(result).toBe("Missing age field. Please make sure to submit all required fields: age");
  });

  test("should return error if required value is null", () => {
    const body = { age: null };
    const result = validateBodyObj(body, [requiredNumField]);
    expect(result).toBe("Invalid age value, please enter a number");
  });

  test("should return error if the value is invalid, i.e. not a number", () => {
    const body = { age: "This is the person's age" };
    const result = validateBodyObj(body, [requiredNumField]);
    expect(result).toBe("Invalid age value, please enter a number");
  });

  test("should return undefined if the value within specified range, i.e. between minNum and maxNum", () => {
    const body = { age: 10 };
    const result = validateBodyObj(body, [numWithinRange]);
    expect(result).toBeUndefined();
  });

  test("should return undefined if the value is less than specified maxNum", () => {
    const body = { age: 0 };
    const result = validateBodyObj(body, [numBelowMaxNum]);
    expect(result).toBeUndefined();
  });

  test("should return undefined if the value is more than specified minNum", () => {
    const body = { age: 21 };
    const result = validateBodyObj(body, [numAboveMinNum]);
    expect(result).toBeUndefined();
  });

  test("should return error if the value out of specified range, i.e. less than minNum or more than maxNum", () => {
    const body = { age: 21 };
    const result = validateBodyObj(body, [numWithinRange]);
    expect(result).toBe(`age value too big, please enter a number <= ${numWithinRange.maxNum}`);
  });

  test("should return error if the value is more than specified maxNum", () => {
    const body = { age: 51 };
    const result = validateBodyObj(body, [numBelowMaxNum]);
    expect(result).toBe(`age value too big, please enter a number <= ${numBelowMaxNum.maxNum}`);
  });

  test("should return error if the value is less than specified minNum", () => {
    const body = { age: 0 };
    const result = validateBodyObj(body, [numAboveMinNum]);
    expect(result).toBe(`age value too small, please enter a number >= ${numAboveMinNum.minNum}`);
  });

  test("should return the 1st error if there are multiple number errors", () => {
    const body = {
      age: "This is the person's age",
      birthYear: "This is the person's birthYear",
    };
    const result = validateBodyObj(body, multipleInvalidFields);
    expect(result).toBe("Invalid age value, please enter a number");
  });

  test("should return undefined if the validateBodyObj array is empty, i.e. no need to validate", () => {
    const body = { age: 51 };
    const result = validateBodyObj(body, []);
    expect(result).toBeUndefined();
  });
});