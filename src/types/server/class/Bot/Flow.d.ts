export interface FlowResponse {
    flow: FlowObject[];
    trigger: string;
}
export interface FlowObject {
    type: "message" | "response";
    message?: string;
    response?: FlowResponse[];
}
