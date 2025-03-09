/**
 * Custom interfaces for processed Kubernetes data.
 * These interfaces represent a simplified version of the data from @kubernetes/client-node,
 * optimized for frontend rendering with additional UI-specific properties.
 */

export interface CPU {
    request: number;
    limit: number;
}

export interface ContainerStatus {
    name: string;
    status?: 'Created' | 'Started' | 'Failed' | 'Killing' | 'Preempting' | 'BackOff' | 'ExceededGracePeriod';
    startDate: string;
    visible?: boolean;
    cpu?: CPU;
    labels?: Record<string, string>;
}

export interface Container {
    size: number;
    cpu: CPU;
    labels?: Record<string, string>;
    status?: ContainerStatus['status'];
    startDate?: string;
}

export interface Pod {
    size: number;
    containers: Record<string, Container>;
}

export interface Node {
    size: number;
    pods: Record<string, Pod>;
}

export interface Cluster {
    nodes: Record<string, Node>;
}

export interface Clusters {
    [key: string]: Cluster;
}
