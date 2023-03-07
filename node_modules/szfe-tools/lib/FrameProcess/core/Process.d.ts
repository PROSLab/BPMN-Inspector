import Thread, { ThreadConfig } from './Thread';
/**
 * 帧任务进程
 * 作用：为任务分配适宜线程，并控制线程任务总数，以保证执行性能
 */
export default class Process {
    static defaultProcess: Process;
    maxTaskCount?: number;
    threadList: Thread[];
    constructor(config?: ThreadConfig);
    getAvailableThread: () => Thread;
    start: (frame: Function) => Function;
    once: (frame: Function) => void;
}
