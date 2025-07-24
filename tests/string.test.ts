import { ValidateFieldArr, ValidateObjStruct, ValueType, validateBodyObj } from "../src/validate";

const requiredStrField: ValidateObjStruct = {
  name: "name",
  type: ValueType.String,
  required: true,
};

const optionalStrField: ValidateObjStruct = {
  name: "name",
  type: ValueType.String,
};

const lengthWithinRange: ValidateObjStruct = {
  ...optionalStrField,
  minLength: 1,
  maxLength: 20,
};

const lengthBelowMaxLength: ValidateObjStruct = {
  ...optionalStrField,
  maxLength: 20,
};

const lengthAboveMinLength: ValidateObjStruct = {
  ...optionalStrField,
  minLength: 1,
};

const objFieldSchema: ValidateFieldArr = [{
  ...requiredStrField,
  minLength: 2,
}, {
  name: "description",
  type: ValueType.String,
  required: true,
  minLength: 2,
}];

describe("String tests", () => {
  test("should return undefined for object with valid string field", () => {
    const body = { name: "Black Widow" };
    const result = validateBodyObj(body, [requiredStrField]);
    expect(result).toBeUndefined();
  });

  test("should return undefined for missing optional string field", () => {
    const body = {};
    const result = validateBodyObj(body, [optionalStrField]);
    expect(result).toBeUndefined();
  });

  test("should return error for missing required string field (empty map)", () => {
    const body = {};
    const result = validateBodyObj(body, [requiredStrField]);
    expect(result).toBe("Missing name field. Please make sure to submit all required fields: name");
  });

  test("should return error if required value is undefined", () => {
    const body = { name: undefined };
    const result = validateBodyObj(body, [requiredStrField]);
    expect(result).toBe("Missing name field. Please make sure to submit all required fields: name");
  });

  test("should return error if required value is null", () => {
    const body = { name: null };
    const result = validateBodyObj(body, [requiredStrField]);
    expect(result).toBe("Invalid name item, please enter a string");
  });

  test("should return error if the value is invalid, i.e. not a string", () => {
    const body = { name: 24 };
    const result = validateBodyObj(body, [requiredStrField]);
    expect(result).toBe("Invalid name item, please enter a string");
  });

  test("should return undefined if the string length is within specified range, i.e. between minLength and maxLength", () => {
    const body = { name: "Scarlet Witch" };
    const result = validateBodyObj(body, [lengthWithinRange]);
    expect(result).toBeUndefined();
  });

  test("should return undefined if the value is shorter than maxLength", () => {
    const body = { name: "Captain America" };
    const result = validateBodyObj(body, [lengthBelowMaxLength]);
    expect(result).toBeUndefined();
  });

  test("should return undefined if the value is longer than minLength", () => {
    const body = { name: "Iron Man" };
    const result = validateBodyObj(body, [lengthAboveMinLength]);
    expect(result).toBeUndefined();
  });

  test("should return error if the string length out of specified range, i.e. less than minLength or more than maxLength", () => {
    const body = { name: "Bruce Wayne aka Batman" };
    const result = validateBodyObj(body, [lengthWithinRange]);
    expect(result).toBe(`Invalid string length for name field. Please input a string with ${lengthWithinRange.maxLength} or fewer characters`);
  });

  test("should return error if the string length is more than specified maxLength", () => {
    const body = { name: "Bruce Wayne aka Batman" };
    const result = validateBodyObj(body, [lengthBelowMaxLength]);
    expect(result).toBe(`Invalid string length for name field. Please input a string with ${lengthBelowMaxLength.maxLength} or fewer characters`);
  });

  test("should return error if the string length is lesser than specified minLength", () => {
    const body = { name: "" };
    const result = validateBodyObj(body, [lengthAboveMinLength]);
    expect(result).toBe(`Invalid string length for name field. Please input a string with ${lengthAboveMinLength.minLength} or more characters`);
  });

  test("should return the 1st error if there are multiple string errors", () => {
    const body = {
      name: "a",
      description: "b",
    };
    const result = validateBodyObj(body, objFieldSchema);
    expect(result).toBe("Invalid string length for name field. Please input a string with 2 or more characters");
  });
});