import { handleLoanAction } from "../../../utils/loanActions";

export default defineEventHandler(async (event) => {
  return handleLoanAction(event, "approve");
});
