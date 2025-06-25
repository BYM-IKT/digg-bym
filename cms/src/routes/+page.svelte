<script lang="ts">
  import { userManager } from "$lib/auth";

  async function handleSubmit(event: Event) {
    event.preventDefault();
    await userManager.signinRedirect();
  }
</script>

<h1>Hei og velkommen til Digg-CMS</h1>
<form class="container" on:submit={handleSubmit}>
  <button type="submit">Logg inn</button>
</form>
