export type BobActionType = "text" | "file" | "dir" | "script" | "qr";

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
