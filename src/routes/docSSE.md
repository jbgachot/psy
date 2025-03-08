### Server Sent Events (SSE)

It is possible to connect your clients to Sveltekit and set it up to send events from the server to your clients. This is also known as [Server-Sent Events (SSE)](https://en.wikipedia.org/wiki/Server-sent_events). This is an alternative to WebSockets, and is supported by all modern browsers. SSE can be implemented as follows, with a chat application as example:

```js
/// file: src/routes/[id].js
// Store all connections in a set-map
const clients = new Set();

export const GET = ({ params }) => {
	let controller;

	return {
		// These headers are important for the browser to detect a SSE request
		headers: {
			'Content-Type': 'text/event-stream',
			Connection: 'keep-alive',
			'Cache-Control': 'no-cache'
		},
		body: new ReadableStream({
			start: (_) => {
				controller = _;
				clients.add({ id: params['id'], connection: controller });
			},
			cancel: () => {
				clients.delete({ id: params['id'], connection: controller });
			}
		})
	};
};

export const POST = async ({ request, params }) => {
	const encoder = new TextEncoder();
	const message = await request.text();
	for (const { id, connection } of clients) {
		if (id === params['id']) {
			continue;
		}

		// First format the message correctly with 'data: ' as prefix and 2 new lines as suffix
		// Then encode the message to a Uint8Array to be sent to the client
		connection.enqueue(encoder.encode('data: ' + message + '\n\n'));
	}

	return { status: 204 };
};
```

```html
/// file: src/routes/index.svelte

<script lang="ts">
	import { onMount } from 'svelte';
	onMount(() => {
		const events = new EventSource('/<ID of client>');
		events.onmessage = (event) => {
			console.log(JSON.parse(event.data));
		};
		setInterval(async () => {
			await fetch('/<ID of client>', {
				method: 'POST',
				body: 'Hello world!'
			});
		}, 3000);
	});
</script>
```