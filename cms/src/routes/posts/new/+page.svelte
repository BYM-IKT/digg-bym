<script lang="ts">
  import { uploadMarkdown } from "$lib/api";
  import MilkdownEditor from "$lib/components/editor.svelte";
  import Metadata from "$lib/components/metadata.svelte";
  import { formatMetadata } from "$lib/metadata";
  import type { MetadataProps } from "$lib/types";
  import { formatDateToLocalISO } from "$lib/utils";

  let metadataState: MetadataProps = $state({
    title: "",
    slug: "",
    author: "",
    summary: "",
    publishedAt: formatDateToLocalISO(new Date()),
  });

  let markdownContent = $state("");

  function handleSave() {
    const metadata = formatMetadata(metadataState);
    const mergedFile = metadata.concat(markdownContent);
    if (!metadataState.slug) {
      return alert("Artikkel må ha tittel");
    }

    uploadMarkdown(metadataState.slug, mergedFile);
  }

  async function uploadImage(file: File) {
    return await uploadImage(file);
  }
</script>

<h1>Legg til ny artikkel</h1>
<Metadata bind:metadata={metadataState} />
<button onclick={handleSave}>Lagre</button>
<h2>Legg til markdown</h2>
<p>Her kan du legge til riktekst og bilder</p>
<MilkdownEditor bind:content={markdownContent} onUpload={uploadImage} />
