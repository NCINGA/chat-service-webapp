export interface IMessage {
    session: string;
    user: string;
    message: string;
    timestamp: number;
    inputType: string;
    args: any;
}

export const TEXT = "text";
export const YES_NO = "yes_no";
export const PROBLEM="problem";
export const LIST = "list";

