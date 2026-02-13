<template>
	<div>
		<!-- HERO SECTION -->
		<section class="relative text-white" style="background-image: url(&quot;/shelves.jpg&quot;); background-size: cover; background-position: center">
			<div class="absolute inset-0 bg-black/50" />
			<UContainer class="relative py-24">
				<div>
					<h1 class="text-4xl leading-tight font-bold md:text-6xl">
						Welcome to the <br />
						Comet Cupboard
					</h1>

					<p class="mt-6 text-lg md:text-xl">Supporting academic success by meeting basic needs.</p>

					<div class="mt-10 flex flex-row gap-4">
						<UButton size="xl" variant="solid" to="/landing/login"> Student Login </UButton>
						<UButton size="xl" variant="solid" to="/landing/login"> Volunteer Login </UButton>
					</div>
				</div>
			</UContainer>
		</section>

		<!-- CALENDAR & MESSAGES SECTION -->
		<section class="bg-gray-50 py-20">
			<UContainer>
				<div class="mx-auto max-w-2xl text-center">
					<h2 class="text-3xl font-bold">Upcoming Restocks and Notices</h2>
					<p class="mt-4 text-gray-600">I'm going to put a calendar here :)</p>
				</div>
			</UContainer>
		</section>
	</div>
</template>
