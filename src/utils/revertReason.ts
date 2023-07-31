import { REVERT_REASON } from "../state/enums";

export const revertReason = (reason:any) => {
    let message:string;
    if (reason["code"] === REVERT_REASON.INSUFFICENT_FUNDS) {
        message ="Insufficent funds";
      } else if (reason["code"] === REVERT_REASON.TRANSACTION_ERROR) {
        message = reason["message"];
      } else {
        message = reason["message"]?.split('"message": "')[1]?.split('"')[0] ;
      }
    return message;
  };
  