
export const DATE_OF_BIRTH_CAPTURED = "DATE_OF_BIRTH_CAPTURED";
export const AGE_CALCULATED = "AGE_CALCULATED";
export function dateOfBirthCaptured(payload) {
  return {
    type: DATE_OF_BIRTH_CAPTURED,
    meta: {remote: true},
    payload
  }
}