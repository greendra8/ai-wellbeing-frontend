<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  export let form: ActionData;
</script>

<div class="auth-container">
  <h1>Login</h1>
  <form method="POST" use:enhance>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" id="password" name="password" required />
    </div>
    {#if form?.message}
      <p class="error">{form.message}</p>
    {/if}
    <button type="submit">Login</button>
  </form>
  <p>Don't have an account? <a href="/register">Register</a></p>
</div>

<style>
  .auth-container {
    font-family: 'Lato', sans-serif;
    width: 100%;
    max-width: 400px;
    margin: 2rem auto;
    padding: 0 1rem;
    box-sizing: border-box;
  }

  h1 {
    font-family: 'Poppins', sans-serif;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #0e0e0e;
    color: #E1E1E1;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }

  button:hover {
    background-color: #000000;
  }

  .error {
    color: red;
    margin-top: 1rem;
  }

  p {
    text-align: center;
    margin-top: 1rem;
  }

  a {
    color: #000000;
  }

  a:hover {
    text-decoration: underline;
  }
</style>