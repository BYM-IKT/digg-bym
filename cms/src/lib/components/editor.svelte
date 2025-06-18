<script lang="ts">
  import { Crepe } from "@milkdown/crepe";
  import "@milkdown/crepe/theme/common/style.css";
  import "@milkdown/crepe/theme/frame.css";

  import { onDestroy } from "svelte";
  // We have some themes for you to choose
  // available themes: frame, classic, nord, frame-dark, classic-dark, nord-dark

  import { imageBlockConfig } from "@milkdown/kit/component/image-block";

  import { CMS_CDN_URL } from "$lib/api";
  import { buildPath } from "$lib/utils";
  import { onMount } from "svelte";

  let { content = $bindable(), onUpload } = $props<{
    content?: string;
    onUpload: (file: File) => Promise<string>;
  }>();

  let editorRoot: HTMLDivElement;
  let crepe: Crepe | null = null;

  onMount(() => {
    crepe = new Crepe({
      root: editorRoot,
      defaultValue: content,
    });

    //crepe.editor.use(commonmark).use(gfm);

    crepe.create().then(() => {
      console.log("Editor created");
    });
    crepe.on((listener) => {
      listener.markdownUpdated((ctx, markdown, prev) => {
        content = markdown;
        ctx.update(imageBlockConfig.key, (defaultConfig) => ({
          ...defaultConfig,
          onUpload: async (file) => {
            const id = await onUpload(file);
            // Here you can handle the file upload
            // For example, you can upload it to a server or do something else with it
            const url = buildPath(CMS_CDN_URL, id);
            return url;
          },
          proxyDomURL: async (url) => {
            // if empty string, do not proxy to cdn
            console.log("proxy", url);
            if (!url) return url;

            return "".concat(url); // This is a proxy function to handle the image URL
            // You can modify it to suit your needs, e.g., to use a CDN or a specific domain
            //
          },
        }));
      });
    });
  });

  onDestroy(() => {
    // To destroy the editor
    crepe?.destroy();
  });
</script>

<div class="editor" bind:this={editorRoot}></div>
