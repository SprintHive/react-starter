
export const DATE_OF_BIRTH_CAPTURED = "DATE_OF_BIRTH_CAPTURED";
export const AGE_CALCULATED = "AGE_CALCULATED";
export const CALCULATE_AGE_FAILURE = "CALCULATE_AGE_FAILURE";
export function dateOfBirthCaptured(payload) {
  return {
    type: DATE_OF_BIRTH_CAPTURED,
    meta: {remote: true},
    payload
  }
}

export const DATE_OF_BIRTH_UPDATED = "DATE_OF_BIRTH_UPDATED";
export function dateOfBirthUpdated(payload) {
  return {
    type: DATE_OF_BIRTH_UPDATED,
    payload
  }
}