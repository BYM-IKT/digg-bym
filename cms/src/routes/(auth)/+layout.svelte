<script lang="ts">
  import DarkmodeBtn from "$lib/components/darkmode-btn.svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { checkAuth } from "$lib/stores/auth";

  const queryClient = new QueryClient();
  let { children } = $props();
  let authorized = false;

  onMount(() => {
    authorized = checkAuth();
    if (!authorized) {
      goto("/");
    }
  });
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
