<script>
	import {fetchJson} from '../../network/fetch';
	import {RF_COMMENT_API_URL} from '../../network/queues/beatleader/api-queue';
	import ContentBox from '../Common/ContentBox.svelte';
	import ReplyForm from './ReplyForm.svelte';

	export let diffDiscussionId;
	export let mapDiscussionId;

	let beatNumberedComments;
	let generalDiffComments;
	let generalMapComments;
	let mapReviews;

	let stats;

	let activeList;

	let openedSection = 'generalDiffComments';

	function getDiffComments(diffDiscussionId) {
		fetchJson(RF_COMMENT_API_URL + `comment/all/difficulty/${diffDiscussionId}`).then(data => {
			console.log('diff', data.body);
			beatNumberedComments = sortReplies(data.body.beatNumberedComments);
			generalDiffComments = sortReplies(data.body.generalDiffComments);
		});
	}

	function getMapComments(mapDiscussionId) {
		fetchJson(RF_COMMENT_API_URL + `comment/all/mapset/${mapDiscussionId}`).then(data => {
			console.log('mapset', data.body);
			generalMapComments = sortReplies(data.body.generalMapComments);
			mapReviews = data.body.mapReviews;
		});
	}

	function getCommentStats(mapDiscussionId, diffDiscussionId) {
		fetchJson(RF_COMMENT_API_URL + `comment/stats/${mapDiscussionId}/${diffDiscussionId}`).then(data => {
			console.log('stats', data.body);
			stats = data.body;
		});
	}

	function getMapReviewsComments(mapReviews) {
		mapReviews.forEach(entry => {
			let mapCommentIds = entry.commentIds;
			let comments = [];
			mapCommentIds.forEach(id => {
				fetchJson(RF_COMMENT_API_URL + `comment/${id}`).then(data => {
					comments.push(data.body);
				});
			});
			entry.Comments = comments;
		});
	}

	const sortReplies = comments => {
		return comments.map(comment => {
			if (comment.replies) {
				comment.replies.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
			}
			return comment;
		});
	};

	$: getDiffComments(diffDiscussionId);
	$: getMapComments(mapDiscussionId);
	$: getCommentStats(mapDiscussionId, diffDiscussionId);
	$: mapReviews ? getMapReviewsComments(mapReviews) : null;
	$: activeList =
		openedSection === 'mapReviews'
			? mapReviews
			: openedSection === 'generalMapComments'
			? generalMapComments
			: openedSection === 'generalDiffComments'
			? generalDiffComments
			: beatNumberedComments;
</script>

<ContentBox class="main-content">
	<h2>Comments</h2>
	{#if stats !== undefined}
		<p>
			Your: {stats.userCommentsCount} | Notes: {stats.notesCount} | Praises: {stats.praiseCount} | Resolved: {stats.resolvedCount} | Open: {stats.openCount}
			| All: {stats.allCommentsCount}
		</p>
	{/if}
	<div class="comment-sort-choices">
		{#if mapReviews !== undefined}
			<div
				on:click|preventDefault={() => {
					openedSection = 'mapReviews';
				}}>
				<h2 class:selected={openedSection === 'mapReviews'}>
					Map Reviews ({mapReviews.length})
				</h2>
			</div>
		{/if}
		{#if generalMapComments !== undefined}
			<div
				on:click|preventDefault={() => {
					openedSection = 'generalMapComments';
				}}>
				<h2 class:selected={openedSection === 'generalMapComments'}>
					General (All difficulties) ({generalMapComments.length})
				</h2>
			</div>
		{/if}
		{#if generalDiffComments !== undefined}
			<div
				on:click|preventDefault={() => {
					openedSection = 'generalDiffComments';
				}}>
				<h2 class:selected={openedSection === 'generalDiffComments'}>
					General (This difficulty) ({generalDiffComments.length})
				</h2>
			</div>
		{/if}
		{#if beatNumberedComments !== undefined}
			<div
				on:click|preventDefault={() => {
					openedSection = 'beatNumberedComments';
				}}>
				<h2 class:selected={openedSection === 'beatNumberedComments'}>
					Timeline ({beatNumberedComments.length})
				</h2>
			</div>
		{/if}
	</div>
	{#if activeList}
		<div class="comments-container">
			{#if openedSection === 'mapReviews'}
				{#each mapReviews as entry}
					<div class="comment-box">
						<h3>Author: {entry.authorId} <small class="gray"> review id: {entry.id}</small></h3>
						<p>{entry.body}</p>
						<h3>Comments:</h3>
						{#each entry?.Comments as entry}
							<div class="comment-box lighter-comment-background">
								<h3>Author: {entry.authorId} <small class="gray"> comment id: {entry.id}</small></h3>
								<p>{entry.body}</p>
								{#if entry.beatNumber}
									<p>Beat Number: {entry.beatNumber}</p>
								{/if}
							</div>
						{/each}
						<h3>{entry.replies.length > 0 ? 'Replies' : ''}</h3>
						<div>
							{#each entry.replies as reply}
								<div>
									<h4>Author: {reply.authorId}</h4>
									<p>{reply.body}</p>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			{:else}
				{#each activeList as entry}
					<div class="comment-box">
						<h3>Author: {entry.authorId} <small class="gray"> comment id: {entry.id}</small></h3>
						<p>{entry.body}</p>
						{#if entry.beatNumber}
							<p>Beat Number: {entry.beatNumber}</p>
						{/if}
						<h3>{entry.replies.length > 0 ? 'Replies' : ''}</h3>
						<div>
							{#each entry.replies as reply}
								<div class="comment-box lighter-comment-background">
									<h3>Author: {reply.authorId} <small class="gray"> reply id: {reply.id}</small></h3>
									<p>{reply.body}</p>
								</div>
							{/each}
							<ReplyForm commentId={entry.id} />
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</ContentBox>

<style>
	.selected {
		color: cadetblue !important;
	}

	.comment-sort-choices {
		display: flex;
		justify-content: space-around;
		margin-bottom: 1em;
	}

	.comments-container {
		display: flex;
		flex-direction: column;
		gap: 0.25em;
	}

	.comment-box {
		background-color: #313131;
		padding: 0.5em;
		margin-top: 0.4em;
		margin-bottom: 0.4em;
		border-radius: 0.5em;
	}

	.lighter-comment-background {
		background-color: #414141;
	}

	.gray {
		color: gray !important;
	}
</style>
