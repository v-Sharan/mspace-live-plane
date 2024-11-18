import { addtargetCNF } from '~/features/target/slice';

export const handleIncomeTargetCNF = (message, dispatch) => {
  dispatch(addtargetCNF(message));
};
