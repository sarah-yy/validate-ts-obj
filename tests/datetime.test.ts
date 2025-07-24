import { ValidateFieldArr, ValidateObjStruct, ValueType, validateBodyObj } from "../src/validate";

const requiredDateTimeField: ValidateObjStruct = {
  name: "createdAt",
  type: ValueType.DateTime,
  required: true,
};

const optionalDateTimeField: ValidateObjStruct = {
  name: "createdAt",
  type: ValueType.DateTime,
};

const multipleDateTimeSchema: ValidateFieldArr = [requiredDateTimeField, {
  name: "updatedAt",
  type: ValueType.DateTime,
  required: true,
}];

describe("Date-time tests", () => {
  test("should return undefined for object with valid date-time field", async () => {
    const datetime = new Date().toISOString();
    const body = { createdAt: datetime };
    const result = validateBodyObj(body, [requiredDateTimeField]);
    expect(result).toBeUndefined();
  });

  test("should return undefined for missing optional date-time field", () => {
    const body = {};
    const result = validateBodyObj(body, [optionalDateTimeField]);
    expect(result).toBeUndefined();
  });

  test("should return error for missing required date-time field (empty map)", () => {
    const body = {};
    const result = validateBodyObj(body, [requiredDateTimeField]);
    expect(result).toBe("Missing createdAt field. Please make sure to submit all required fields: createdAt");
  });

  test("should return error if required value is undefined", () => {
    const body = { createdAt: undefined };
    const result = validateBodyObj(body, [requiredDateTimeField]);
    expect(result).toBe("Missing createdAt field. Please make sure to submit all required fields: createdAt");
  });

  test("should return error if required value is null", () => {
    const body = { createdAt: null };
    const result = validateBodyObj(body, [requiredDateTimeField]);
    expect(result).toBe("Invalid createdAt value, please enter a date in ISO 8601 format, i.e. YYYY-MM-DDTHH:mm:ss.sssZ");
  });

  test("should return error if the value is invalid, i.e. not a date string in ISO 8601 format", () => {
    const body = { createdAt: "This is the person's createdAt time" };
    const result = validateBodyObj(body, [requiredDateTimeField]);
    expect(result).toBe("Invalid createdAt value, please enter a date in ISO 8601 format, i.e. YYYY-MM-DDTHH:mm:ss.sssZ");
  });

  test("should return error if the date-time string is in the wrong format, i.e. not a date string in ISO 8601 format", () => {
    const body = { createdAt: "2024-02-27" };
    const result = validateBodyObj(body, [requiredDateTimeField]);
    expect(result).toBe("Invalid createdAt value, please enter a date in ISO 8601 format, i.e. YYYY-MM-DDTHH:mm:ss.sssZ");
  });

  test("should return the 1st error if there are multiple date-time errors", () => {
    const body = {
      createdAt: "2025-07-24",
      updatedAt: "2025-07-24",
    };
    const result = validateBodyObj(body, multipleDateTimeSchema);
    expect(result).toBe("Invalid createdAt value, please enter a date in ISO 8601 format, i.e. YYYY-MM-DDTHH:mm:ss.sssZ");
  });

  test("should return undefined if the validateBodyObj array is empty, i.e. no need to validate", () => {
    const body = { createdAt: "2025-07-24" };
    const result = validateBodyObj(body, []);
    expect(result).toBeUndefined();
  });
});