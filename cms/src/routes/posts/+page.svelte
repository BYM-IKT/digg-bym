<script lang="ts">
  import { fetchPosts } from "$lib/api";
  import { postData } from "$lib/stores";
  import { createQuery } from "@tanstack/svelte-query";

  const query = createQuery({
    queryKey: ["todos"],
    queryFn: () => fetchPosts(),
  });
  function updatePostStore(string: string) {
    postData.set(string);
  }
</script>

<h1>Artikler</h1>
<a class="contrast" href="/posts/new">Legg til ny artikkel</a>
<div>
  {#if $query.isLoading}
    <p>Loading...</p>
  {:else if $query.isError}
    <p>Error: {$query.error.message}</p>
  {:else if $query.isSuccess}
    <table>
      <thead>
        <tr>
          <th style="text-align: left;">Title</th>
        </tr>
      </thead>
      <tbody>
        {#each $query.data as post}
          <tr>
            <td
              ><a
                onclick={() => updatePostStore(post.base64)}
                href={`posts/${post.key}`}>{post.key}</a
              ></td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
