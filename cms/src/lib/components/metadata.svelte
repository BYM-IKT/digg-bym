<script lang="ts">
  import { CMS_CDN_URL, uploadImage } from "$lib/api";
  import type { MetadataProps } from "$lib/types";
  import { buildPath, slugify } from "$lib/utils";

  export let metadata: MetadataProps = {
    title: "",
    slug: "",
    author: "",
    summary: "sa",
  };

  const onInput = (e: Event) => {
    const { id, value } = e.target as HTMLInputElement;
    switch (id) {
      case "tittel":
        metadata.title = value;
        metadata.slug = slugify(value);
        break;
      case "slug":
        metadata.slug = value;
        break;
      case "author":
        metadata.author = value;
        break;
      case "summary":
        metadata.summary = value;
        break;
      case "publishedAt":
        metadata.publishedAt = value;
      case "mainImageCaption":
        metadata.mainImageCaption = value;
      default:
        break;
    }
  };

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (file && file.type.startsWith("image/")) {
      metadata.mainImageUrl = buildPath(CMS_CDN_URL, url);
    }
  }
</script>

<h2>Metadata</h2>
<form>
  <fieldset class="grid">
    <label
      >Tittel
      <input id="tittel" value={metadata.title} on:input={onInput} />
    </label>
    <label
      >Slug
      <input
        id="slug"
        readonly
        placeholder="dette feltet blir auto-gen"
        value={metadata.slug}
        on:input={onInput}
      />
    </label>
    <label for="author"
      >Author
      <input id="author" value={metadata.author} on:input={onInput} />
    </label>
    <label for="publishedAt"
      >Publiseringsdato
      <input
        id="publishedAt"
        type="datetime-local"
        value={metadata.publishedAt}
        on:input={onInput}
      />
    </label>
  </fieldset>
  <fieldset class="grid">
    <label>
      Last opp hovedbilde
      <input type="file" accept="image/*" on:change={handleFileChange} />
    </label>

    {#if metadata.mainImageUrl}
      <img class="preview" src={metadata.mainImageUrl} alt="header preview" />
      <label for="mainImageCaption"
        >Legg til caption
        <textarea
          style="height: 150px;"
          id="mainImageCaption"
          on:input={onInput}
          value={metadata.mainImageCaption}
        ></textarea>
      </label>
    {/if}
    <label for="summary"
      >Summary
      <textarea
        style="height:150px;"
        id="summary"
        value={metadata.summary}
        on:input={onInput}
      ></textarea>
    </label>
    <label for="utkast"
      >Utkast (wip)<input
        style="margin-left: 1rem;"
        disabled
        id="utkast"
        type="checkbox"
      />
    </label>
  </fieldset>
</form>
