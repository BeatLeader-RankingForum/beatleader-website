<script>
	import {fade} from 'svelte/transition';
	import ContentBox from '../components/Common/ContentBox.svelte';
	import {fetchJson} from '../network/fetch';
	import {RF_DISCUSSION_API_URL} from '../network/queues/beatleader/api-queue';
	import CommentsList from '../components/RankingForumTest/CommentsList.svelte';

	let testMapDiscussionId = "502bd2ff-ea01-4594-a299-7b797e0e030f";
	let diffDiscussions = [];
	let selectedDiff;

	function getMapDiscussion(mapDiscussionId) {
		fetchJson(RF_DISCUSSION_API_URL + `mapdiscussion/${mapDiscussionId}`).then(data => {
			console.log(data);
			diffDiscussions = data.body.discussions;
		});
	}

	$: getMapDiscussion(testMapDiscussionId);
</script>

<section class="align-content">
	<article class="page-content" transition:fade|global>
		<ContentBox class="main-content">
			<h1>Ranking Forum Test</h1>

			<div>
				<h2>The list of Difficulty Discussions in MapDiscussion {testMapDiscussionId}</h2>
				{#each diffDiscussions as diff}
					<div
						on:click|preventDefault={() => {
							selectedDiff = diff.id;
						}}>
						<h2 class="difficultyOption" class:selected={diff.id === selectedDiff}>
							[{diff.id}] - Difficulty index: {diff.difficulty} - Characteristic: {diff.characteristic}
						</h2>
					</div>
				{/each}
			</div>
		</ContentBox>
		{#if selectedDiff !== undefined}
			<CommentsList diffDiscussionId={selectedDiff} mapDiscussionId={testMapDiscussionId} />
		{/if}
	</article>
</section>

<style>
	.selected {
		color: cadetblue !important;
	}
</style>
