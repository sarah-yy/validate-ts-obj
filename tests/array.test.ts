import { ValidateFieldArr, ValidateObjStruct, ValueType, validateBodyObj } from "../src/validate";

const requiredArrField: ValidateObjStruct = {
  name: "columns",
  type: ValueType.Array,
  required: true,
  arrayType: {
    type: ValueType.String,
  },
};

const optionalArrField: ValidateObjStruct = {
  name: "columns",
  type: ValueType.Array,
  arrayType: {
    type: ValueType.String,
  },
};

const requiredArrOfObjsField: ValidateObjStruct = {
  name: "columns",
  type: ValueType.Array,
  required: true,
  arrayType: [{
    name: "name",
    type: ValueType.String,
  }, {
    name: "count",
    type: ValueType.Number,
  }],
};

const missingFieldsInArr: ValidateObjStruct = {
  name: "columns",
  type: ValueType.Array,
  required: true,
  arrayType: [{
    name: "name",
    type: ValueType.String,
    required: true,
  }, {
    name: "count",
    type: ValueType.Number,
    required: true,
  }],
};

const arrayLengthWithinRange: ValidateObjStruct = {
  ...optionalArrField,
  minLength: 2,
  maxLength: 10,
};

const arrayLengthBelowMaxLength: ValidateObjStruct = {
  ...optionalArrField,
  maxLength: 10,
};

const arrayLengthAboveMinLength: ValidateObjStruct = {
  ...optionalArrField,
  minLength: 2,
};

const requiredMinLengthForStrItems: ValidateObjStruct = {
  name: "columns",
  type: ValueType.Array,
  required: true,
  arrayType: {
    type: ValueType.String,
    minLength: 2,
  },
};

const requiredMinLengthForObjField: ValidateObjStruct = {
  name: "columns",
  type: ValueType.Array,
  required: true,
  arrayType: [{
    name: "name",
    type: ValueType.String,
    required: true,
    minLength: 2,
  }, {
    name: "count",
    type: ValueType.Number,
    required: true,
  }],
};

const multipleArraysInObjSchema: ValidateFieldArr = [{
  name: "columns",
  type: ValueType.Array,
  required: true,
  arrayType: {
    type: ValueType.String,
    minLength: 2,
  },
}, {
  name: "rows",
  type: ValueType.Array,
  required: true,
  arrayType: {
    type: ValueType.Number,
    minLength: 2,
  },
}];

describe("Array tests", () => {
  test("should return undefined for object with valid array field", () => {
    const body = { columns: ["name", "age", "email"] };
    const result = validateBodyObj(body, [requiredArrField]);
    expect(result).toBeUndefined();
  });

  test("should return undefined for object with empty array field", () => {
    const body = { columns: [] };
    const result = validateBodyObj(body, [requiredArrField]);
    expect(result).toBeUndefined();
  });

  test("should return undefined for missing optional array field", () => {
    const body = {};
    const result = validateBodyObj(body, [optionalArrField]);
    expect(result).toBeUndefined();
  });

  test("should return error for missing required array field (empty map)", () => {
    const body = {};
    const result = validateBodyObj(body, [requiredArrField]);
    expect(result).toBe("Missing columns field. Please make sure to submit all required fields: columns");
  });

  test("should return error if required value is undefined", () => {
    const body = { columns: undefined };
    const result = validateBodyObj(body, [requiredArrField]);
    expect(result).toBe("Missing columns field. Please make sure to submit all required fields: columns");
  });

  test("should return error if required value is null", () => {
    const body = { columns: null };
    const result = validateBodyObj(body, [requiredArrField]);
    expect(result).toBe("Invalid columns value, please enter an array of strings");
  });

  test("should return error if the value is invalid, i.e. not an array", () => {
    const body = { columns: 24 };
    const result = validateBodyObj(body, [requiredArrField]);
    expect(result).toBe("Invalid columns value, please enter an array of strings");
  });

  test("should return error if the value is invalid (object instead of array)", () => {
    const body = { columns: {} };
    const result = validateBodyObj(body, [requiredArrField]);
    expect(result).toBe("Invalid columns value, please enter an array of strings");
  });

  test("should return error if the value is invalid, i.e. invalid object fields in the array", () => {
    const body = {
      columns: [{
        name: "title",
        count: 20,
      }, {
        name: "description",
      }],
    };
    const result = validateBodyObj(body, [missingFieldsInArr]);
    expect(result).toBe("Missing count field in columns. Please make sure to submit all required fields: name, count");
  });

  test("should return error if the value is invalid, i.e. missing object fields in the array", () => {
    const body = {
      columns: [{
        name: "title",
        count: 20,
      }, {
        name: "description",
        count: "count",
      }],
    };
    const result = validateBodyObj(body, [requiredArrOfObjsField]);
    expect(result).toBe("Invalid count value in columns, please enter a number");
  });

  test("should return error if the value is invalid, i.e. invalid items in the array", () => {
    const body = {
      columns: ["title", "count", 24],
    };
    const result = validateBodyObj(body, [requiredArrField]);
    expect(result).toBe("Invalid 3rd item in columns, please enter a string");
  });

  const arrayLengthPositiveCase = { columns: ["title", "count", "isDone"] };

  test("should return undefined if the array length is within specified range, i.e. between minLength and maxLength", () => {
    const result = validateBodyObj(arrayLengthPositiveCase, [arrayLengthWithinRange]);
    expect(result).toBeUndefined();
  });

  test("should return undefined if the value is shorter than maxLength", () => {
    const result = validateBodyObj(arrayLengthPositiveCase, [arrayLengthBelowMaxLength]);
    expect(result).toBeUndefined();
  });

  test("should return undefined if the value is longer than minLength", () => {
    const result = validateBodyObj(arrayLengthPositiveCase, [arrayLengthAboveMinLength]);
    expect(result).toBeUndefined();
  });

  test("should return error if the string length out of specified range, i.e. less than minLength or more than maxLength", () => {
    const body = { columns: ["title"] };
    const result = validateBodyObj(body, [arrayLengthWithinRange]);
    expect(result).toBe(`Invalid array length for columns field. Please input an array with ${arrayLengthWithinRange.minLength} or more items`);
  });

  test("should return error if the string length is more than specified maxLength", () => {
    const body = { columns: ["title", "count", "is_done", "description", "id", "category_id", "status_id", "created_at", "updated_at", "is_deleted", "nonce"] };
    const result = validateBodyObj(body, [arrayLengthBelowMaxLength]);
    expect(result).toBe(`Invalid array length for columns field. Please input an array with ${arrayLengthBelowMaxLength.maxLength} or fewer items`);
  });

  test("should return error if the string length is lesser than specified minLength", () => {
    const body = { columns: ["title"] };
    const result = validateBodyObj(body, [arrayLengthAboveMinLength]);
    expect(result).toBe(`Invalid array length for columns field. Please input an array with ${arrayLengthAboveMinLength.minLength} or more items`);
  });

  test("should return undefined if all items fulfil the required minLength", () => {
    const body = { columns: ["title", "description", "ab"] };
    const result = validateBodyObj(body, [requiredMinLengthForStrItems]);
    expect(result).toBeUndefined();
  });

  test("should return error if 1 of the items is shorter than required minLength", () => {
    const body = { columns: ["title", "description", "a"] };
    const result = validateBodyObj(body, [requiredMinLengthForStrItems]);
    expect(result).toBe(`Invalid string length for 3rd field in columns. Please input a string with 2 or more characters`);
  });

  test("should return undefined if all fields in objects fulfil the required minLength", () => {
    const body = {
      columns: [{
        name: "title",
        count: 20,
      }, {
        name: "aa",
        count: 8,
      }],
    };
    const result = validateBodyObj(body, [requiredMinLengthForObjField]);
    expect(result).toBeUndefined();
  });

  test("should return error if 1 of the item field is shorter than required minLength", () => {
    const body = {
      columns: [{
        name: "title",
        count: 20,
      }, {
        name: "a",
        count: 8,
      }],
    };
    const result = validateBodyObj(body, [requiredMinLengthForObjField]);
    expect(result).toBe(`Invalid string length for name field in columns. Please input a string with 2 or more characters`);
  });

  test("should return the 1st error if there are multiple array errors", () => {
    const body = {
      columns: ["name", "age", 24],
      rows: [1, 2, "three"],
    };
    const result = validateBodyObj(body, multipleArraysInObjSchema);
    expect(result).toBe("Invalid 3rd item in columns, please enter a string");
  });
});