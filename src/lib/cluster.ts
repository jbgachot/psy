import { readable, type Readable } from 'svelte/store';

export const cluster: Readable<{ [key: string]: any }> = readable({
	'cluster-a': {
		'node-1': {
			'pod-a': {
				'container-1': {
					cpu: {
						request: 1,
						limit: 2
					}
				}
			}
		}
	}
});
