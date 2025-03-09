import { writable } from 'svelte/store';
import type { ContainerStatus } from '$lib/types/kubernetes';

const containerStore = writable<ContainerStatus | null>(null);

export const containerInfo = {
	subscribe: containerStore.subscribe,
	set: (container: ContainerStatus) => containerStore.set(container),
	clear: () => containerStore.set(null)
};
