<script lang="ts">
  import Moon from "./moon.svelte";
  import Sun from "./sun.svelte";
  import { onMount } from "svelte";
  import { darkMode } from "../../stores/darkmode";
  import { browser } from "$app/environment";

  let value: boolean = false;

  onMount(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    darkMode.set(prefersDark);
  });

  // Subscribe to darkMode to toggle class on <html>
  $effect(() => {
    if (browser) {
      document?.documentElement.setAttribute(
        "data-theme",
        $darkMode ? "dark" : "light"
      );
    }
  });

  darkMode.subscribe((v) => {
    value = v;
    console.log("like and subscrive", v);
  });

  function toggle() {
    darkMode.update((n) => !n);
    console.log("toggle");
  }

  console.log("dark", $darkMode);
</script>

{#if $darkMode}
  <button class="contrast" onclick={toggle}>
    <Moon />
  </button>
{:else}
  <button class="contrast" onclick={toggle}>
    <Moon />
  </button>
{/if}
