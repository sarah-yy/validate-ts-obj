import { getOrdinalNumber } from "./utils";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;

export interface ValueTypeObj {
  String: string;
  Email: string;
  Number: string;
  Boolean: string;
  Array: string;
}

export const ValueType: ValueTypeObj = {
  String: "string",
  Email: "email",
  Number: "number",
  Boolean: "boolean",
  Array: "array",
};

export type ValueTypeKey = typeof ValueType[keyof typeof ValueType];

export interface ValidateObjStruct {
  name: string;
  type: ValueTypeKey;
  required?: boolean;

  /**
   * To indicate minimum and maximum length of string/array
   * For strings and arrays only
   */
  minLength?: number;
  maxLength?: number;

  /**
   * To indicate minimum and maximum required value
   * For numbers only
   */
  minNum?: number;
  maxNum?: number;

  // For arrays only
  arrayType?: ValidateFieldArr | ArrayItemStruct;

  /**
   * To indicate set of accepted values (acts like an enum)
   * For strings and numbers only
   */
  acceptedValues?: string[] | number[];
}

export type ArrayItemStruct = Omit<ValidateObjStruct, "name">;

export type ValidateFieldArr = ValidateObjStruct[];

export const isArray = (item: any): boolean => {
  if (typeof item !== "object") return false;
  if (!!Array.isArray) return Array.isArray(item);
  return Object.prototype.toString.call(item) === "[object Array]";
};

export const isObject = (item: any): boolean => {
  if (typeof item !== "object") return false;
  if (!!Array.isArray) return !Array.isArray(item);
  return Object.prototype.toString.call(item) === "[object Object]";
};

export const hasObjItem = (obj: {
  [key: string]: any
}, key: string) => {
  return obj.hasOwnProperty(key);
};

interface BodyObj {
  [key: string]: any;
}

export const validateBodyObj = (body: BodyObj, validateObj: ValidateFieldArr, parentField?: string): string | undefined => {
  const requiredFieldsStr = validateObj.reduce((prev: string[], validateItem: ValidateObjStruct) => {
    if (!validateItem.required) return prev;
    prev.push(validateItem.name);
    return prev;
  }, []);

  for (let ii = 0; ii < validateObj.length; ii++) {
    const validateItem = validateObj[ii];

    const validateOutcome = validateIndivItem(body, validateItem, requiredFieldsStr, parentField);
    if (typeof validateOutcome === "string") {
      return validateOutcome;
    }
  }
  return undefined;
};

const validateArr = (arr: any[], validateItem: ValidateObjStruct): string | undefined => {
  for (let ii = 0; ii < arr.length; ii++) {
    let validateOutcome: string | undefined;
    if (validateItem.arrayType && isArray(validateItem.arrayType)) {
      validateOutcome = validateBodyObj(arr[ii], validateItem.arrayType as ValidateFieldArr, validateItem.name);
    } else {
      validateOutcome = validateIndivItem(arr, { ...validateItem.arrayType, name: ii.toString(10) } as ValidateObjStruct, undefined, validateItem.name);
    }
    if (typeof validateOutcome === "string") {
      return validateOutcome;
    }
  }
  return undefined;
};

const validateIndivItem = (body: BodyObj, validateItem: ValidateObjStruct, requiredFieldsStr?: string[], parentField?: string): string | undefined => {
  const parentStr = parentField ? ` in ${parentField}` : "";
  const isArrayItem = !!new RegExp(/^(\d)+$/i).test(validateItem.name);
  const keyName = isArrayItem
    ? getOrdinalNumber(parseInt(validateItem.name) + 1)
    : validateItem.name;

  // Missing field check
  if (validateItem.required && (!hasObjItem(body, validateItem.name) || typeof body[validateItem.name] === "undefined")) {
    return `Missing ${keyName} field${parentStr}. Please make sure to submit all required fields: ${requiredFieldsStr?.join(", ") ?? ""}`;
  }

  switch (validateItem.type) {
    case ValueType.Number: {
      if (hasObjItem(body, validateItem.name)) {
        const strToNum = parseInt(body[validateItem.name]);

        // Check if value is valid number
        // Throw error if this is not a valid number
        if (!isFinite(strToNum)) {
          return `Invalid ${keyName} value${parentStr}, please enter a number`;
        }

        // Check if value is included in the list of accepted values
        // Throw error if the value cannot be found in the list
        if (validateItem.acceptedValues && !(validateItem.acceptedValues as number[]).includes(strToNum)) {
          return `Invalid ${keyName} value${parentStr}, please enter only the following values: ${validateItem.acceptedValues.join(", ")}`;
        }

        // Check if a value is more than or equal the minimum value
        // Throw error if value < minimum value
        if (validateItem.minNum && strToNum < validateItem.minNum) {
          return `${keyName} value${parentStr} too small, please enter a number >= ${validateItem.minNum}`;
        }

        // Check if a value is less than or equal the maximum value
        // Throw error if value > maximum value
        if (validateItem.maxNum && strToNum > validateItem.maxNum) {
          return `${keyName} value${parentStr} too big, please enter a number <= ${validateItem.maxNum}`;
        }
      }
      break;
    }
    case ValueType.Boolean: {
      if (hasObjItem(body, validateItem.name) && typeof body[validateItem.name] !== "boolean") {
        return `Invalid ${keyName} value${parentStr}, please enter a boolean`;
      }
      break;
    }
    case ValueType.Email: {
      if (hasObjItem(body, validateItem.name) && !emailRegex.test(body[validateItem.name])) {
        return `Invalid ${keyName} value${parentStr}, please enter a valid email`;
      }
      break;
    }
    case ValueType.String: {
      if (hasObjItem(body, validateItem.name)) {
        if (body[validateItem.name] === null || typeof body[validateItem.name] !== "string") {
          return `Invalid ${keyName} item${parentStr}, please enter a string`;
        }

        // Check if value is included in the list of accepted values
        // Throw error if the value cannot be found in the list
        if (validateItem.acceptedValues && !(validateItem.acceptedValues as string[]).includes(body[validateItem.name])) {
          return `Invalid ${keyName} value${parentStr}, please enter only the following values: ${validateItem.acceptedValues.join(", ")}`;
        }

        // Check if this string has the correct min length
        // Throw error if this value's length < min length
        if (validateItem.minLength && body[validateItem.name]?.length < validateItem.minLength) {
          return `Invalid string length for ${keyName} field${parentStr}. Please input a string with ${validateItem.minLength} or more characters`;
        }

        // Check if this string has the correct max length
        // Throw error if this value's length > max length
        if (validateItem.maxLength && body[validateItem.name]?.length > validateItem.maxLength) {
          return `Invalid string length for ${keyName} field${parentStr}. Please input a string with ${validateItem.maxLength} or fewer characters`;
        }
      }
      break;
    }
    case ValueType.Array: {
      if (hasObjItem(body, validateItem.name)) {
        if (body[validateItem.name] === null || !isArray(body[validateItem.name])) {
          const arrayTypes = validateItem.arrayType && isArray(validateItem.arrayType) ? "objects" : `${(validateItem.arrayType as ValidateObjStruct).type}s`;
          return `Invalid ${keyName} value, please enter an array of ${arrayTypes}`;
        }

        // Check if this array has the correct min length
        // Throw error if this value's length < min length
        if (validateItem.minLength && body[validateItem.name]?.length < validateItem.minLength) {
          return `Invalid array length for ${keyName} field. Please input an array with ${validateItem.minLength} or more items`;
        }

        // Check if this array has the correct max length
        // Throw error if this value's length > max length
        if (validateItem.maxLength && body[validateItem.name]?.length > validateItem.maxLength) {
          return `Invalid array length for ${keyName} field. Please input an array with ${validateItem.maxLength} or fewer items`;
        }

        if (validateItem.arrayType) {
          const validateOutcome = validateArr(body[validateItem.name], validateItem);
          if (validateOutcome) return validateOutcome;
        }
      }
      break;
    }
    default: {
      break;
    }
  }
  return undefined;
};