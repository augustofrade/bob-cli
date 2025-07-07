export type BobActionType =
  | "text"
  | "file"
  | "dir"
  | "list-dir"
  | "script"
  | "qr"
  | "open"
  | "alias";

export interface BobActionData {
  actionName: string;
  content: string;
  type: BobActionType;
  description?: string;
  learntAt: Date;
}

export interface BobActionCollection {
  [actionName: string]: Omit<BobActionData, "actionName">;
}

export type CreateBobAction = Omit<BobActionData, "learntAt">;
