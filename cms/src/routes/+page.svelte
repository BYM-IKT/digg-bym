<script lang="ts">
  import { login } from "$lib/auth";

  // here goes global

  //
  let username = "";
  let password = "";
  async function handleSubmit(event: Event) {
    event.preventDefault();
    const result = await login({ username, password });
    if (result.isSuccess()) {
      localStorage.setItem("token", result.data);
    } else if (result.isFailure()) {
      alert(result.error);
    } 
  }
</script>

<h1>Hei og velkommen til Digg-CMS</h1>
<form class="container" on:submit={handleSubmit}>
  <h2>Log inn</h2>
  <label
    >Brukernavn
    <input id="username" bind:value={username} />
  </label>
  <label
    >Passord
    <input id="passord" type="password" bind:value={password} />
  </label>
  <button type="submit">Logg inn</button>
</form>
