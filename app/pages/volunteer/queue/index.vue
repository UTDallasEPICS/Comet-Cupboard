<template>
	<header>
			<SharedButtonNavigateBack text="Back to Dashboard" :to="{ path: '/volunteer' }" />
	</header>
	<UContainer class="py-8">
		<header>
			<SharedTextPageTitle>Manage Queue</SharedTextPageTitle>
		</header>

		<section class="mt-4">
			<QueueCartSessionsView />
		</section>

		<section class="mt-4">
			<QueueVolunteerView />
		</section>
	</UContainer>
</template>
