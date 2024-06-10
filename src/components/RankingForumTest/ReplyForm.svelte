<script>
	import {onMount} from 'svelte';
	import {RF_COMMENT_API_URL} from '../../network/queues/beatleader/api-queue';

	export let commentId = '';
	let body = '';
	let forumAuth = localStorage.getItem('forumAuth');

	const submitReply = async () => {
		const response = await fetch(RF_COMMENT_API_URL + 'reply', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${forumAuth}`,
			},
			body: JSON.stringify({commentId, body}),
		});

		if (response.ok) {
			// Handle successful reply submission
			console.log('Reply submitted successfully');
		} else {
			// Handle error
			console.error('Failed to submit reply');
		}
	};
</script>

{#if forumAuth}
	<div class="reply-form">
		<input type="hidden" bind:value={commentId} />
		<textarea placeholder="Write your reply..." bind:value={body} />
		<button on:click={submitReply}>Submit</button>
	</div>
{/if}

<style>
	.reply-form {
		display: flex;
		align-items: center;
		margin: 10px 0;
	}

	.reply-form input,
	.reply-form textarea {
		margin-right: 10px;
		background-color: #414141;
		color: white;
	}

	.reply-form textarea::placeholder {
		color: rgb(204, 204, 204) !important;
	}
</style>
