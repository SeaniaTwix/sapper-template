<script lang="ts">
	let i: number = 100
</script>
<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<h1>Great success! {i}</h1>

<figure>
	<img alt='Success Kid' src='successkid.jpg'>
	<figcaption>Have fun with Sapper!</figcaption>
</figure>

<p><strong>Try editing this file (src/routes/index.svelte) to test live reloading.</strong></p>
<style lang="scss">
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	figure {
		margin: 0 0 1em 0;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;

		strong {
			font-size: 2rem;
		}
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
