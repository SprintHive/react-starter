/**
 * A HOC which takes a log function and logs out the props
 */
export const logProps = (log = console.log) => (BaseComponent) => (props) => {
  log(props);
  return BaseComponent({...props});
};
