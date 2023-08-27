# SvelteKit UnoCSS Template

This is a template containing the following:

- SvelteKit
  with adapter-static for easier Github Pages deployment
- UnoCSS
  using Svelte scoped mode
- - and unocss-preset-heropatterns, unocss-preset-theme
- Prettier Plugin TailwindCSS
  for auto sorting of classes
- Commit-and-Tag-Version
  for CHANGELOG generation and Github tagging of versions
- PrismJS
  with Prism-Svelte for syntax highlighting of code blocks
- svelte-local-storage-store
  for using session/local storage with stores

Prettier Plugin TailwindCSS auto loading is broken when using pnpm so I recommend npm.

Don't forget to import the base path alias:

```
<script>
	import { base } from "$app/paths";
</script>

```

and write `{base}` before local links for them to work on Github Pages! (see /routes/+page.svelte)

Have fun!
