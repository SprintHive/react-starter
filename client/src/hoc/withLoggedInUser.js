
import {compose} from "recompose";
import {connect} from "react-redux";

export const withLoggedInUser = compose(
  connect((state) => ({loggedInUser: state.auth.user}))
);
