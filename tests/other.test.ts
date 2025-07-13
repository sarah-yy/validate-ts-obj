import { ValidateFieldArr, ValueType, validateBodyObj } from '../src';

describe("Other tests", () => {
  const validateObj: ValidateFieldArr = [{
    name: "name",
    type: ValueType.String,
    required: true,
    minLength: 2,
  }, {
    name: "age",
    type: ValueType.Number,
    minNum: 18,
  }, {
    name: "email",
    type: ValueType.Email,
    required: true,
  }, {
    name: "isSubmitted",
    type: ValueType.Boolean,
    required: true,
  }];

  test("Return undefined for mixed valid object", () => {
    const body = {
      name: "Sarah Thong",
      age: 28,
      email: "abcdefg@gmail.com",
      isSubmitted: true,
    };
    const result = validateBodyObj(body, validateObj);
    expect(result).toBeUndefined();
  });
  
  test("Return error if 1 of the items is invalid", () => {
    const body = {
      name: "Sarah Thong",
      age: 13,
      email: "abcdefg@gmail.com",
      isSubmitted: true,
    };
    const result = validateBodyObj(body, validateObj);
    expect(result).toBe("age value too small, please enter a number >= 18");
  });

  test("Return 1st error if 3 of the items is invalid", () => {
    const body = {
      name: undefined,
      age: 13,
      email: "abdcd",
      isSubmitted: true,
    };
    const result = validateBodyObj(body, validateObj);
    expect(result).toBe("Missing name field. Please make sure to submit all required fields: name, email, isSubmitted");
  });
});