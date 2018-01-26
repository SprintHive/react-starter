import React from 'react';
import PropTypes from 'prop-types';
import {compose, setDisplayName, setPropTypes, withHandlers, withState} from 'recompose';
import FlexBox from "../FlexBox";
import moment from 'moment';

const inputStyle = {
  backgroundColor: 'transparent',
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  borderBottomWidth: 2,
  borderBottomColor: '#c1c1c1',
  borderBottomStyle: 'solid',
  outline: 'none',
  paddingTop: 15,
  paddingBottom: 15,
  textAlign: 'center',
  maxWidth: 300,
  minWidth: 200,
  fontSize: '200%',
  color: '#c1c1c1'
};

const whitelist = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "/"];
const slashAllowed = [2, 5];
const enhance = compose(
  setDisplayName('DateOfBirthInput'),
  setPropTypes({done: PropTypes.func.isRequired}),
  withState("dateOfBirth", "updateDateOfBirth", ""),
  withHandlers({
    filterInput: ({dateOfBirth, socket, updateDateOfBirth, done}) => e => {
      const inputString = String.fromCharCode(e.charCode);
      let currLength = dateOfBirth.length;
      if (currLength > 9) {
        e.preventDefault();
        return false;
      }

      if ((currLength === 2 || currLength === 5) && inputString !== "/") {
        e.preventDefault();
        return false;
      }

      if ((slashAllowed.indexOf(currLength) === -1) && inputString === "/") {
        e.preventDefault();
        return false;
      }

      if (whitelist.indexOf(inputString) === -1) {
        e.preventDefault();
        return false;
      }

      const proposedDateOfBirth = dateOfBirth + inputString;
      if (proposedDateOfBirth.length === 2 && parseInt(proposedDateOfBirth, 10) > 31) {
        e.preventDefault();
        return false;
      }
      if (proposedDateOfBirth.length === 5 && parseInt(proposedDateOfBirth.substr(3, 4), 10) > 12) {
        e.preventDefault();
        return false;
      }

      if (proposedDateOfBirth.length === 10 && parseInt(proposedDateOfBirth.substr(6, 9), 10) > 2018) {
        e.preventDefault();
        return false;
      }

      if (proposedDateOfBirth.length === 10) {
        const dob = moment(proposedDateOfBirth, 'DD/MM/YYYY');
        if (dob.isValid()) {
          done({dateOfBirth: dob});
        }
      }
    },
    onDateOfBirthUpdated: ({updateDateOfBirth}) => e => {
      updateDateOfBirth(e.target.value);
    }
  })
);

export const DateOfBirthInput = (props) => {
  return (
    <FlexBox centered item>
      <input style={inputStyle}
             type="text"
             placeholder="dd/mm/yyyy"
             onKeyPress={props.filterInput}
             onChange={props.onDateOfBirthUpdated}
             value={props.dateOfBirth.length ? props.dateOfBirth : props.defaultDateOfBirth}
      />
    </FlexBox>
  );
};

export default enhance(DateOfBirthInput);