import { writable } from 'svelte/store';

interface Container {
	name: string;
	status?:
		| 'Created'
		| 'Started'
		| 'Failed'
		| 'Killing'
		| 'Preempting'
		| 'BackOff'
		| 'ExceededGracePeriod';
	startDate: string;
	visible: boolean;
}

let container: Container | null = null;

const { subscribe, set } = writable<Container | null>(container);

export const containerInfo = {
	subscribe,
	set,
	clear: () => set(null)
};
