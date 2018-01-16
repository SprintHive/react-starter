
import {DATE_OF_BIRTH_CAPTURED, AGE_CALCULATED} from "./DateOfBirthActions";

const initialState = {age: 0};
export default function (state = initialState, action) {
  console.log("Received action ", action);
  switch (action.type) {
    case DATE_OF_BIRTH_CAPTURED:
    case AGE_CALCULATED:
      return {...state, ...action.payload};

    default:
      return state;
  }
}