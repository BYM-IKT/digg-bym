<script lang="ts">
  import { page } from "$app/state";
  import { getBucketKey, uploadMarkdown, uploadImage } from "$lib/api";

  import MilkdownEditor from "$lib/components/editor.svelte";
  import Metadata from "$lib/components/metadata.svelte";
  import { parse } from "$lib/frontmatter-parse";
  import { formatMetadata } from "$lib/metadata";
  import { postData } from "$lib/stores";
  import type { MetadataProps } from "$lib/types";
  import { buildPath } from "$lib/utils";

  let slug = page.params.slug;

  let metadataState: MetadataProps = {
    title: "",
    slug: "",
    author: "",
    summary: "",
  };
  let markdownContent = "";

  postData.subscribe((value) => {
    const { data, content } = parse<MetadataProps>(value);

    metadataState = { ...data };
    markdownContent = content;
  });

  function updatePost() {
    const metadata = formatMetadata(metadataState);
    const mergedFile = metadata.concat(markdownContent);
    if (!metadataState.slug) {
      return;
    }

    const fileName = buildPath(
      getBucketKey("md"),
      metadataState.slug.concat(".mdx")
    );

    uploadMarkdown(fileName, mergedFile);
  }

  async function onUpload(file: File) {
    return await uploadImage(file);
  }
</script>

<h1>Blog post: {slug}</h1>
<Metadata bind:metadata={metadataState} />
<button on:click={updatePost}>Lagre</button>
<h2>Innhold</h2>
<p>Her kan du redigere riktekst-innhold og bilder</p>
<MilkdownEditor {onUpload} bind:content={markdownContent} />
