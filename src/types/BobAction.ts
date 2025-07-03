export type BobAction = "text" | "file" | "dir" | "script" | "qr";

export interface BobActionData {
  actionName: string;
  content: string;
  type: BobAction;
  description?: string;
  learntAt: Date;
}

export interface BobActionCollection {
  [actionName: string]: Omit<BobActionData, "action_name">;
}

export type CreateBobAction = Omit<BobActionData, "learntAt">;
