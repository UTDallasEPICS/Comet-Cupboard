<template>
	<div>
		<section class="relative text-white" style="background-image: url(&quot;/shelves.jpg&quot;); background-size: cover; background-position: center">
			<div class="absolute inset-0 bg-black/50" />
			<UContainer class="relative py-24">
				<div>
					<SharedTextHero class="text-white">
						Welcome to the <br />
						Comet Cupboard
					</SharedTextHero>

					<SharedTextHeroDescription class="mt-6 text-white"> Supporting academic success by meeting basic needs. </SharedTextHeroDescription>

					<div class="mt-10 flex flex-row gap-4">
						<UButton size="xl" variant="solid" to="/login"> Student Login </UButton>
						<UButton size="xl" variant="solid" to="/vol-login"> Volunteer Login </UButton>
					</div>
				</div>
			</UContainer>
		</section>

		<section class="py-20">
			<UContainer>
				<div class="mx-auto max-w-4xl text-center">
					<SharedTextSectionTitle> Upcoming Restocks and Notices </SharedTextSectionTitle>
					<div class="mt-8 overflow-hidden rounded-lg shadow">
						<iframe
							src="https://calendar.google.com/calendar/embed?src=utdcometcupboard%40gmail.com&ctz=America%2FChicago&showTitle=0"
							style="border: 0"
							width="100%"
							height="600"
							frameborder="0"
							scrolling="no"
						/>
					</div>
				</div>
			</UContainer>
		</section>

		<USeparator />

		<section class="relative overflow-hidden bg-gray-50/50 py-24">
			<UContainer class="relative z-10 flex flex-col items-center text-center">
				<SharedTextSectionTitle class="mb-4"> Find an Emergency Bag </SharedTextSectionTitle>

				<SharedTextBase class="mb-10 max-w-xl leading-relaxed text-gray-600"> Check availability at all the locations across campus. </SharedTextBase>

				<UButton size="xl" variant="solid" to="/public/emergency-bag/locations" class="rounded-xl px-10 py-4 text-lg font-semibold shadow-lg" trailing>
					View All Locations
				</UButton>
			</UContainer>
		</section>
	</div>
</template>
