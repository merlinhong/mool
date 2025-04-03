import {GetInitialState} from 'mooljs';
export default (initialState:GetInitialState) => {
  const { role } = initialState;
  return {
    hasPermision: role == "admin",
  };
};
