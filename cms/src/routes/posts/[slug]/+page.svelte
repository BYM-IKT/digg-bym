<script lang="ts">
  import { page } from "$app/state";
  import {
    fetchFile,
    publishWorkflow,
    uploadImage,
    uploadMarkdown,
  } from "$lib/api";

  import MilkdownEditor from "$lib/components/editor.svelte";
  import Metadata from "$lib/components/metadata.svelte";
  import { parse } from "$lib/frontmatter-parse";
  import { formatMetadata } from "$lib/metadata";
  //import { postData } from "$lib/stores";
  import { createQuery } from "@tanstack/svelte-query";

  import type { MetadataProps } from "$lib/types";
  import { buildPath, getBucketKey } from "$lib/utils";
  import { toast } from "@zerodevx/svelte-toast";

  let slug = page.params.slug;

  let metadataState: MetadataProps = {
    title: "",
    slug: "",
    author: "",
    summary: "",
  };
  let markdownContent = "";

  const query = createQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchFile(slug.concat(".mdx"), "md"),
  });

  query.subscribe(({ isFetched, data: serverPost }) => {
    if (isFetched && serverPost) {
      console.log("post", serverPost);

      const { data, content } = parse<MetadataProps>(serverPost.base64);

      metadataState = { ...data };
      markdownContent = content;
    }
  });

  function updatePost() {
    const metadata = formatMetadata(metadataState);
    const mergedFile = metadata.concat(markdownContent);
    if (!metadataState.slug) {
      return;
    }

    uploadMarkdown(metadataState.slug, mergedFile);
  }

  async function handlePublish() {
    const res = await publishWorkflow();
    if (res.ok) {
      toast.push("Artikkel publisert");
    }
  }

  async function onUpload(file: File) {
    return await uploadImage(file);
  }
</script>

{#if $query.isSuccess}
  <h1>Blog post: {slug}</h1>
  <div style="text-align: right;">
    <button on:click={updatePost}>Lagre utkast</button>
    <button on:click={handlePublish}>Publiser </button>
  </div>
  <Metadata bind:metadata={metadataState} />

  <h2>Innhold</h2>
  <p>Her kan du redigere riktekst-innhold og bilder</p>

  <MilkdownEditor {onUpload} bind:content={markdownContent} />
{:else}
  <p>Laster inn post...</p>
{/if}
