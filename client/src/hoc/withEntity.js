
import {compose, lifecycle} from "recompose";
import {connect} from "react-redux";
import {calcKey} from "../reducers/index";

const dispatchSubscribeToEntity = ({entityKey, entityId}) => (
  {
    type: "SUBSCRIBE_TO_ENTITY",
    meta: {remote: true},
    payload: {entityKey, entityId}
  }
);

const dispatchUnSubscribeToEntity = ({entityKey, entityId}) => (
  {
    type: "UNSUBSCRIBE_FROM_ENTITY",
    meta: {remote: true},
    payload: {entityKey, entityId}
  }
);

const getEntity = ({state, entityKey, entityId}) =>
  entityId
    ? state.entities[entityKey][entityId]
    : state.entities[entityKey];


export const withEntity = ({entityKey, entityId, actions}) => compose(
  connect((state) => {
    const props = {};
    const key = calcKey(entityKey, entityId);
    const payload = getEntity({state, entityKey, entityId}) || {};
    props.entity = {entityKey, entityId, payload};
    props.entity.loading = state.loading[key] === undefined
      ? true
      : state.loading[key];
    return props;
  }, {dispatchSubscribeToEntity, dispatchUnSubscribeToEntity, ...actions}),
  lifecycle({
    componentWillMount() {
      const {entity, dispatchSubscribeToEntity} = this.props;
      const {entityKey, entityId} = entity;
      dispatchSubscribeToEntity({entityKey, entityId})
    },
    componentWillUnmount() {
      const {entity, dispatchUnSubscribeToEntity} = this.props;
      const {entityKey, entityId} = entity;
      dispatchUnSubscribeToEntity({entityKey, entityId});
    }
  })
);