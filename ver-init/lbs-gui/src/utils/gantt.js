import { formatDatetime, parseDate } from './datetime';

export class Task {
    constructor(original, id, text, start_date, end_date, progress, color, progressColor, parent) {
        this.original = original;
        this.id = id;
        this.text = text;
        this.start_date = formatDatetime(parseDate(start_date));
        this.end_date = formatDatetime(parseDate(end_date));
        if (progress) this.progress = progress;
        if (color) this.color = color;
        if (progressColor) this.progressColor = progressColor;
        if (parent) this.parent = parent;
    }
}

export class Link {
    constructor(id, source, target, type) {
        this.id = id;
        this.source = source;
        this.target = target;
        this.type = type;
    }
}

// export interface GanttData {
//     data: Task[];
//     links: Link[];
// }

export function getMachineGanttData(machines, scheduleResult, scheduleStart) {
    let mjMap = new Map();
    machines.forEach((m) => {
        const name = m.machine_group ? m.machine_group : m.name;
        if (mjMap.has(name)) return;
        const mJobOps = scheduleResult.filter((j) => {
            const mn = j.production_machine_name ? j.production_machine_name : j.scheduled_machine_name;
            const start = j.production_start_time ? j.production_start_time : j.scheduled_start_time;
            return mn === name && start;
        });
        if (mJobOps.length > 0) {
            mJobOps.sort((a, b) => {
                const a_start = a.production_start_time ? a.production_start_time : a.scheduled_start_time;
                const b_start = b.production_start_time ? b.production_start_time : b.scheduled_start_time;
                return a_start.getTime() - b_start.getTime();
            });
            mjMap.set(name, mJobOps);
        }
    });

    let taskId = 1;
    let linkId = 1;
    let tasks = [];
    let links = [];

    mjMap.forEach((v, k) => {
        tasks.push(
            new Task(
                undefined,
                taskId,
                k,
                v[0].production_start_time ? v[0].production_start_time : v[0].scheduled_start_time,
                v[v.length - 1].production_end_time
                    ? v[v.length - 1].production_end_time
                    : v[v.length - 1].scheduled_end_time,
                Math.min(
                    1,
                    Math.max(
                        0,
                        (scheduleStart.getTime() - v[0].scheduled_start_time.getTime()) /
                            (v[v.length - 1].scheduled_end_time.getTime() - v[0].scheduled_start_time.getTime())
                    )
                ),
                undefined,
                undefined,
                // '#2E8B57',
                // '#8FBC8B',
                undefined
            )
        );
        let parent = taskId++;
        let last = 0;
        for (const j of v) {
            const start = j.production_start_time ? j.production_start_time : j.scheduled_start_time;
            const end = j.production_end_time ? j.production_end_time : j.scheduled_end_time;
            tasks.push(
                new Task(
                    j,
                    taskId,
                    j.job_no + '-' + j.operation,
                    start,
                    end,
                    j.production_end_time
                        ? 1
                        : j.production_start_time
                        ? (scheduleStart.getTime() - j.production_start_time.getTime()) /
                          (j.scheduled_end_time.getTime() - j.production_start_time.getTime())
                        : 0,
                    undefined,
                    undefined,
                    // '#D3D3D3',
                    // '#808080',
                    parent
                )
            );
            if (last !== 0) {
                links.push(new Link(linkId++, last, taskId, '0'));
            }
            last = taskId++;
        }
    });

    return { data: tasks, links: links };
}

export function getJobOpGanttData(machines, scheduleResult, scheduleStart) {
    let jobOpMap = new Map();
    scheduleResult.forEach((j) => {
        if (!j.scheduled_start_time && !j.production_start_time) return;
        if (!jobOpMap.has(j.job_no)) {
            jobOpMap.set(j.job_no, [j]);
        } else {
            jobOpMap.get(j.job_no).push(j);
        }
    });
    jobOpMap.forEach((ops) =>
        ops.sort((a, b) => {
            const a_start = a.production_start_time ? a.production_start_time : a.scheduled_start_time;
            const b_start = b.production_start_time ? b.production_start_time : b.scheduled_start_time;
            return a_start.getTime() - b_start.getTime();
        })
    );

    let taskId = 1;
    let linkId = 1;
    let tasks = [];
    let links = [];

    jobOpMap.forEach((v, k) => {
        tasks.push(
            new Task(
                undefined,
                taskId,
                k,
                v[0].production_start_time ? v[0].production_start_time : v[0].scheduled_start_time,
                v[v.length - 1].production_end_time
                    ? v[v.length - 1].production_end_time
                    : v[v.length - 1].scheduled_end_time,
                Math.min(
                    1,
                    Math.max(
                        0,
                        (scheduleStart.getTime() - v[0].scheduled_start_time.getTime()) /
                            (v[v.length - 1].scheduled_end_time.getTime() - v[0].scheduled_start_time.getTime())
                    )
                ),
                undefined,
                undefined,
                // '#2E8B57',
                // '#8FBC8B',
                undefined
            )
        );
        let parent = taskId++;
        let last = 0;
        for (const j of v) {
            const machine = machines.find((m) => {
                const name = m.machine_group ? m.machine_group : m.name;
                return j.production_machine_name
                    ? j.production_machine_name === name
                    : j.scheduled_machine_name === name;
            });
            const start = j.production_start_time ? j.production_start_time : j.scheduled_start_time;
            const end = j.production_end_time ? j.production_end_time : j.scheduled_end_time;
            tasks.push(
                new Task(
                    j,
                    taskId,
                    j.operation + ': ' + (machine.machine_group ? machine.machine_group : machine.name),
                    start,
                    end,
                    j.production_end_time
                        ? 1
                        : j.production_start_time
                        ? (scheduleStart.getTime() - j.production_start_time.getTime()) /
                          (j.scheduled_end_time.getTime() - j.production_start_time.getTime())
                        : 0,
                    undefined,
                    undefined,
                    // '#D3D3D3',
                    // '#808080',
                    parent
                )
            );
            if (last !== 0) {
                links.push(new Link(linkId++, last, taskId, '0'));
            }
            last = taskId++;
        }
    });

    return {
        data: tasks,
        links: links,
    };
}
