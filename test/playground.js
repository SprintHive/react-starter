const {createStore} = require("redux");

const initialState = {counter: 0};
const reducer = (state = initialState, action) => {

  switch(action.type) {
    case "INC":
      return {...state, ...{counter: state.counter + 1}};

    default:
      return state;
  }
};


const store = createStore(reducer);

const render = () => {
  console.log(JSON.stringify(store.getState(), null, 2));
};

store.subscribe(render);

setTimeout(() => {
  console.log("Dispatching action");
  store.dispatch({type: "INC"});
}, 1000);

console.log("hello");
