import { writable } from 'svelte/store';
import type { Clusters } from '$lib/types/kubernetes';

const clusters = writable<Clusters>({});

export default clusters;
export type * from '$lib/types/kubernetes';
