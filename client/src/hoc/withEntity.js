
import {compose, lifecycle} from "recompose";
import {connect} from "react-redux";
import {calcKey} from "../reducers/index";

export const dispatchSubscribeToEntity = ({entityKey, entityId}) => (
  {
    type: "SUBSCRIBE_TO_ENTITY",
    meta: {remote: true},
    payload: {entityKey, entityId}
  }
);

export const dispatchUnSubscribeToEntity = ({entityKey, entityId}) => (
  {
    type: "UNSUBSCRIBE_FROM_ENTITY",
    meta: {remote: true},
    payload: {entityKey, entityId}
  }
);

const getEntity = ({state, entityKey, entityId}) => {
  if (entityKey) {
    return entityId
      ? state.entities[entityKey] && state.entities[entityKey][entityId]
      : state.entities[entityKey];
  } else {
    return undefined;
  }
};

export const withEntity = () => compose(
  connect((state, {entityKey, entityId}) => {
    const props = {};
    const key = calcKey(entityKey, entityId);
    const payload = getEntity({state, entityKey, entityId}) || {};
    props.entity = {entityKey, entityId, payload};
    props.entity.loading = state.loading[key] === undefined
      ? true
      : state.loading[key];
    return props;
  }, {dispatchSubscribeToEntity, dispatchUnSubscribeToEntity}),
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
