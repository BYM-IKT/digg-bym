<script>
  import { userManager } from "$lib/auth";
  import { onMount } from "svelte";

  onMount(async () => {
    try {
      const user = await userManager.signinRedirectCallback();
      localStorage.setItem("token", user.access_token);
      window.location.href = "/posts";
    } catch (err) {
      console.error("OIDC callback error:", err);
    }
  });
</script>

<div class="container">
  <p>
    Espen har sagt at vi må snakke med Onelogin.. <br />
    sjekker om du får lov til å være her...
  </p>
</div>
