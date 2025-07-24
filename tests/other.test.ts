import { ValidateFieldArr, ValueType, validateBodyObj } from "../src/validate";

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
  }, {
    name: "gender",
    type: ValueType.String,
    required: true,
    acceptedValues: ["male", "female"],
  }, {
    name: "favouriteFruits",
    type: ValueType.Array,
    arrayType: {
      type: ValueType.String,
    },
  }];

  test("Return undefined for mixed valid object", () => {
    const body = {
      name: "Sarah Thong",
      age: 28,
      email: "abcdefg@gmail.com",
      isSubmitted: true,
      gender: "female",
      favouriteFruits: ["apple", "orange", "banana"],
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
      gender: "female",
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
      gender: "prefer not to say",
      favouriteFruits: ["apple", "orange", 24],
    };
    const result = validateBodyObj(body, validateObj);
    expect(result).toBe("Missing name field. Please make sure to submit all required fields: name, email, isSubmitted, gender");
  });
});