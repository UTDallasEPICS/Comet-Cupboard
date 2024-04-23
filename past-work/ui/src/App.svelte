<!-- displays the application -->

<!-- the stylesheets used in this app -->
<svelte:head>
	<!-- Fonts -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"> -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"> 
	
  <!-- Material Typography -->
	<link rel="stylesheet" href="https://unpkg.com/@material/typography@14.0.0/dist/mdc.typography.css" />
	
	<!-- SMUI -->
	<link rel="stylesheet" href="https://unpkg.com/svelte-material-ui/bare.css" />
	<!-- <link rel="stylesheet" href="node_modules/svelte-material-ui/bare.css" /> -->

    <!-- import font awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</svelte:head>

<script>
  import Router from 'svelte-spa-router';
  import routes from './routes';
</script>

<!-- displays all the routes -->
<main>
	<Router {routes} />
</main>