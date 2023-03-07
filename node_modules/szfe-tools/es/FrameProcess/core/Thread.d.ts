export interface ThreadConfig {
    maxTaskCount?: number;
}
export interface Task {
    frame: Function;
    startTime: number;
}
export default class Thread {
    maxTaskCount: number;
    constructor({ maxTaskCount }?: ThreadConfig);
    taskList: Set<Task>;
    isAvailable: () => boolean;
    isRunning: boolean;
    private frame;
    run: (frame: Function) => Function;
}
