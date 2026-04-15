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

		<section class="py-24 bg-gray-50/50 relative overflow-hidden">
			<UContainer class="flex flex-col items-center text-center relative z-10">
				<SharedTextSectionTitle class="mb-4"> 
				Find an Emergency Bag
				</SharedTextSectionTitle>
			
				<SharedTextBase class="max-w-xl text-gray-600 mb-10 leading-relaxed">
				Check availability at all the locations across campus. 
				</SharedTextBase>

				<UButton 
					size="xl" 
					variant="solid" 
					to="/public/emergency-bag/locations"
					class="px-10 py-4 text-lg font-semibold rounded-xl shadow-lg"
					trailing
					> 
					View All Locations 
				</UButton>
			</UContainer>
		</section>

		<USeparator />

		<section class="py-20">
			<UContainer>
				<div class="mx-auto max-w-2xl text-center">
					<SharedTextSectionTitle> Upcoming Restocks and Notices </SharedTextSectionTitle>
					<SharedTextBase class="mt-4"> I'm going to put a calendar here :) </SharedTextBase>
				</div>
			</UContainer>
		</section>
	</div>
</template>
