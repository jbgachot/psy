import { readable, type Readable } from 'svelte/store';

export const cluster: Readable<{ [key: string]: any }> = readable({
	'cluster-a': {
		nodes: {
			'node-1': {
				size: 100,
				pods: {
					'pod-a': {
						size: 50,
						containers: {
							'container-1': {
								size: 50,
								cpu: {
									request: 1,
									limit: 1
								}
							},
							'container-2': {
								size: 50,
								cpu: {
									request: 1,
									limit: 1
								}
							}
						}
					},
					'pod-b': {
						size: 25,
						containers: {
							'container-1': {
								size: 50,
								cpu: {
									request: 0.5,
									limit: 0.5
								}
							},
							'container-2': {
								size: 50,
								cpu: {
									request: 0.5,
									limit: 0.5
								}
							}
						}
					},
					'pod-c': {
						size: 25,
						containers: {
							'container-1': {
								size: 75,
								cpu: {
									request: 0.75,
									limit: 0.75
								}
							},
							'container-2': {
								size: 25,
								cpu: {
									request: 0.25,
									limit: 0.25
								}
							}
						}
					}
				}
			},
			'node-2': {
				size: 50,
				pods: {
					'pod-a': {
						size: 50,
						containers: {
							'container-1': {
								size: 50,
								cpu: {
									request: 0.5,
									limit: 0.5
								}
							},
							'container-2': {
								size: 50,
								cpu: {
									request: 0.5,
									limit: 0.5
								}
							}
						}
					},
					'pod-b': {
						size: 25,
						containers: {
							'container-1': {
								size: 100,
								cpu: {
									request: 0.5,
									limit: 0.5
								}
							}
						}
					}
				}
			}
		}
	}
});
