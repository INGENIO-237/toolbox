import { parsePhoneNumber } from "libphonenumber-js";

export default function isValidPhoneNumber(phone: string) {
  try {
    const parsedPhone = parsePhoneNumber(phone);
    return parsedPhone.isValid();
  } catch (error) {
    return false;
  }
}
