export type BobAction = "text" | "file" | "dir" | "script" | "qr";

export interface BobActionData {
  action_name: string;
  content: string;
  type: BobAction;
  description?: string;
  learntAt: Date;
}

export type CreateBobAction = Omit<BobActionData, "learntAt">;
