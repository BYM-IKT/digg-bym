<script lang="ts">
  import { getBucketKey, uploadMarkdown } from "$lib/api";
  import MilkdownEditor from "$lib/components/editor.svelte";
  import Metadata from "$lib/components/metadata.svelte";
  import { formatMetadata } from "$lib/metadata";
  import type { MetadataProps } from "$lib/types";
  import { buildPath, formatDateToLocalISO } from "$lib/utils";

  let metadataState: MetadataProps = $state({
    title: "",
    slug: "",
    author: "",
    summary: "",
    publishedAt: formatDateToLocalISO(new Date()),
  });

  let markdownContent = $state("");

  function submitPost() {
    console.log("hvorfor er jeg ehr");
    return;
    if (!metadataState.title) {
      return alert("Post må tittel din dumbass");
    }
    const metadata = formatMetadata(metadataState);
    const mergedFile = metadata.concat(markdownContent);
    const fileName = buildPath(
      getBucketKey("md"),
      metadataState.slug.concat(".mdx")
    );

    uploadMarkdown(fileName, mergedFile);
  }

  async function uploadImage(file: File) {
    return await uploadImage(file);
  }
</script>

<h1>Legg til ny artikkel</h1>
<Metadata bind:metadata={metadataState} />
<button onclick={submitPost}>Lagre</button>
<h2>Legg til markdown</h2>
<p>Her kan du legge til riktekst og bilder</p>
<MilkdownEditor bind:content={markdownContent} onUpload={uploadImage} />
