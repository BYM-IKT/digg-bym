<script lang="ts">
  import DarkmodeBtn from "$lib/components/darkmode-btn.svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteToast } from "@zerodevx/svelte-toast";

  const queryClient = new QueryClient();

  let { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
  <SvelteToast />

  <header class="container">
    <nav>
      <ul>
        <li><strong>DIGG CMS</strong></li>
      </ul>
      <ul>
        <li><a href="/">home</a></li>
        <li><a href="/posts">posts</a></li>
        <DarkmodeBtn />
      </ul>
    </nav>
  </header>
  <main class="container">
    {@render children()}
  </main>
</QueryClientProvider>
