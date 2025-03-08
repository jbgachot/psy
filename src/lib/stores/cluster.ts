// stores.ts

import { writable } from 'svelte/store';

interface CPU {
    request: number;
    limit: number;
}

interface Container {
    size: number;
    cpu: CPU;
    labels?: Record<string, string>;
    status?: string;
    startDate?: string;
}

interface Pod {
    size: number;
    containers: { [key: string]: Container };
}

interface Node {
    size: number;
    pods: { [key: string]: Pod };
}

interface Cluster {
    nodes: { [key: string]: Node };
}

const clusters = writable<{ [key: string]: Cluster }>({});

export default clusters;
export type { Cluster, Node, Pod, Container, CPU };
