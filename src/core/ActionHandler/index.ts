import { BobActionData, BobActionType } from "../../types/BobAction"

export default class ActionHandler {
    private static handlers: Record<BobActionType, (action: BobActionData) => Promise<void>> = {
        file: this.handleTextualAction,
        text: this.handleTextualAction,
        dir: this.handleTextualAction,
        script: this.handleTextualAction,
        qr: this.handleTextualAction,
    }


    public static handle(action: BobActionData): Promise<void> {
        const handler = this.handlers[action.type];
        if (!handler) {
            throw new Error(`No handler found for action type: ${action.type}`);
        }
        return handler(action);

    }


    private static handleTextualAction(action: BobActionData): Promise<void> {
        return new Promise((resolve) => {
            console.log(action.content);
            console.log("\n");
        });
    }
}