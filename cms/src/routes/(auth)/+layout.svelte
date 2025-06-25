<script lang="ts">
  import DarkmodeBtn from "$lib/components/darkmode-btn.svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { user } from "$lib/stores/auth";
  import { userManager } from "$lib/auth";

  export function checkAuth() {
    if (!$user) {
      return false;
    }
    return true;
  }

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
        <li>Hei {$user?.profile.name}</li>
        <li><a href="/">home</a></li>
        <li><a href="/posts">posts</a></li>
        <DarkmodeBtn />
        <button
          style="margin-left: 0.5rem;"
          onclick={() => userManager.signoutRedirect()}>Logg out</button
        >
      </ul>
    </nav>
  </header>
  <main class="container">
    {@render children()}
  </main>
</QueryClientProvider>
