<template>
	<UFooter class="bg-cancel-gray text-white">
		<div class="flex w-full flex-col">
			<!-- Main Footer Content -->
			<div class="py-8 sm:py-10">
				<div class="grid gap-10 sm:grid-cols-2 xl:grid-cols-5 xl:gap-8">
					<!-- Brand -->
					<div class="flex flex-col gap-4 sm:col-span-2 xl:col-span-1">
						<img src="/CometCupboardLogo2.png" alt="Comet Cupboard" class="h-auto w-36 sm:w-40" />

						<SharedTextBase class="max-w-md text-sm leading-relaxed text-white/75">
							Supporting the UTD community by providing accessible food and resources to students.
						</SharedTextBase>
					</div>

					<!-- Contact -->
					<div class="space-y-4">
						<SharedTextBase class="text-lg font-bold text-white"> Contact </SharedTextBase>

						<div class="flex flex-col items-start gap-1">
							<!-- Location -->
							<div class="flex items-center gap-3 py-2">
								<SharedIcon name="i-lucide-map-pin" class="size-5 shrink-0 text-white" />

								<SharedTextBase class="text-white/75">{{ room }}</SharedTextBase>
							</div>

							<!-- Email -->
							<ULink :to="`mailto:${email}`" class="inline-flex items-center gap-3 py-2">
								<SharedIcon name="i-lucide-mail" class="size-5 shrink-0 text-white" />
								<SharedTextBase class="text-white/75">{{ email }}</SharedTextBase>
							</ULink>

							<!-- Phone -->
							<ULink :to="`tel:${phone}`" class="inline-flex items-center gap-3 py-2">
								<SharedIcon name="i-lucide-phone" class="size-5 shrink-0 text-white" />
								<SharedTextBase class="text-white/75">{{ phone }}</SharedTextBase>
							</ULink>
						</div>
					</div>

					<!-- Hours -->
					<div class="space-y-4">
						<SharedTextBase class="text-lg font-bold text-white"> Hours </SharedTextBase>

						<div class="space-y-4">
							<div class="space-y-1">
								<SharedTextBase class="leading-snug font-semibold text-white"> Monday, Wednesday, Friday </SharedTextBase>

								<SharedTextBase class="text-white/75"> 10 AM - 4 PM </SharedTextBase>
							</div>

							<div class="space-y-1">
								<SharedTextBase class="leading-snug font-semibold text-white"> Tuesday, Thursday </SharedTextBase>

								<SharedTextBase class="text-white/75"> 11 AM - 5 PM </SharedTextBase>
							</div>
						</div>
					</div>

					<!-- Connect With Us -->
					<div class="space-y-4">
						<SharedTextBase class="text-lg font-bold text-white"> Connect With Us </SharedTextBase>

						<div class="flex flex-wrap gap-3">
							<!-- Instagram -->
							<UTooltip text="Instagram">
								<ULink
									:to="instagram"
									target="_blank"
									rel="noopener noreferrer"
									class="flex size-11 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
									aria-label="Follow Comet Cupboard on Instagram"
								>
									<SharedIcon name="i-lucide-instagram" class="size-6" />
								</ULink>
							</UTooltip>

							<!-- Facebook -->
							<UTooltip text="Facebook">
								<ULink
									:to="facebook"
									target="_blank"
									rel="noopener noreferrer"
									class="flex size-11 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
									aria-label="Follow Comet Cupboard on Facebook"
								>
									<SharedIcon name="i-simple-icons-facebook" class="size-5" />
								</ULink>
							</UTooltip>

							<!-- LinkedIn -->
							<UTooltip text="LinkedIn">
								<ULink
									:to="linkedin"
									target="_blank"
									rel="noopener noreferrer"
									class="flex size-11 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
									aria-label="Follow Comet Cupboard on LinkedIn"
								>
									<SharedIcon name="i-simple-icons-linkedin" class="size-5" />
								</ULink>
							</UTooltip>

							<!-- Website -->
							<UTooltip text="Website">
								<ULink
									:to="website"
									target="_blank"
									rel="noopener noreferrer"
									class="flex size-11 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
									aria-label="Visit the Comet Cupboard website"
								>
									<SharedIcon name="i-lucide-globe" class="size-5" />
								</ULink>
							</UTooltip>
						</div>
					</div>

					<!-- Support Us -->
					<div class="space-y-4">
						<SharedTextBase class="text-lg font-bold text-white"> Support Us </SharedTextBase>

						<SharedTextBase class="text-sm leading-relaxed text-white/75">
							Help support Comet Cupboard by donating items from our wishlist.
						</SharedTextBase>

						<ULink
							:to="amazonWishlist"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex min-h-11 items-center gap-3 rounded-lg bg-white/10 px-4 py-2.5 font-medium text-white transition hover:bg-white/20"
						>
							<SharedIcon name="i-lucide-heart" class="size-5 shrink-0" />

							<SharedTextBase class="text-white">Amazon Wishlist</SharedTextBase>
						</ULink>
					</div>
				</div>
			</div>

			<!-- Copyright -->
			<div class="w-full border-t border-white/10 py-5 text-center">
				<SharedTextBase class="text-sm text-white/60"> © {{ new Date().getFullYear() }} Comet Cupboard </SharedTextBase>
			</div>
		</div>
	</UFooter>
</template>

<script setup lang="ts">
const room = "MC 1.608"
const email = "cupboard@utdallas.edu"
const phone = "972-883-6613"

const website = "https://cometcupboard.utdallas.edu/"

const instagram = "https://www.instagram.com/cometcupboard/"
const facebook = "https://www.facebook.com/CometCupboard/"
const linkedin = "https://www.linkedin.com/in/comet-cupboard-303736270/"

const amazonWishlist = "https://www.amazon.com/hz/wishlist/ls/3RHYFY5KHB7OE?ref_=wl_share"
</script>
