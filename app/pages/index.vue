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

					<SharedTextHeroDescription class="mt-4 text-white"> Supporting academic success by meeting basic needs. </SharedTextHeroDescription>

					<div class="mt-4 flex flex-row gap-4">
						<SharedButtonNavigateTo text="Login with SSO" @click="startLogin" />
						<UForm v-if="isDevMode" @submit="startDevLogin">
							<UFormField>
								<UInput v-model="devUsernameInput" placeholder="NONPROD Dev Username" class="w-64" @keyup.enter="startDevLogin" />
							</UFormField>
						</UForm>
					</div>
				</div>
			</UContainer>
		</section>

		<section class="py-16">
			<UContainer>
				<div class="mx-auto max-w-4xl text-center">
					<SharedTextSectionTitle> Comet Cupboard Calendar </SharedTextSectionTitle>
					<div class="mt-4 overflow-hidden rounded-lg shadow">
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

		<section class="relative overflow-hidden bg-gray-50/50 py-16">
			<UContainer class="relative flex flex-col items-center gap-4 text-center">
				<SharedTextSectionTitle> Find an Emergency Bag </SharedTextSectionTitle>
				<SharedTextBase class="max-w-xl"> Check availability at locations across campus </SharedTextBase>
				<!-- <img src="/placeholderAsset.png" class="aspect-square w-48" alt="placeholder image" /> -->
				<SharedButtonNavigateTo text="View Locations" to="/public/emergency-bag/locations" />
			</UContainer>
		</section>
	</div>
</template>

<script lang="ts" setup>
const startLogin = async () => {
	await navigateTo("/api/public/auth/login", { external: true })
}

const isDevMode = useRuntimeConfig().public.NODE_ENV === "nonprod"
const devUsernameInput = ref("")

const startDevLogin = async () => {
	await navigateTo(`/api/public/auth/DEV_MODE-callback?username=${devUsernameInput.value}`, { external: true })
}

</script>
