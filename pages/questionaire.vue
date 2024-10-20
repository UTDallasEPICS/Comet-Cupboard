<template lang="pug">
div
    div.mx-auto(class="w-3/4 sm:w-6/12")
        div
            div(style="background-color: #f1f1f1;").p-4.rounded-lg.text-center.mt-4
                p.font-bold Thank you for taking part
                p Please complete this survey to help us improve our program 
        div
            div.py-4.items-center 
                p.font-bold Statement of Understanding: 
                p I assume any and all risks associated with consuming the items I have selected from the Comet Cupboard. I agree to release UT Dallas from liability if I sustain any health or medical issues as a result of consuming foods taken from the Comet Cupboard. I understand that the Comet Cupboard distributes products that may contain nuts or have been processed in plants that use peanuts and/or tree nuts. I also understand that some of Comet Cupboard items may conflict with my allergies or dietary restrictions. 
                br
                p.font-bold Nondiscrimination clause: 
                p UTD Comet Cupboard does not and shall not discriminate on the basis of race, color, religion (creed), gender, gender expression, age, national origin (ancestry), disability, marital status, sexual orientation, or military status, in any of its activities or operations
        div.flex.place-content-evenly.items-center.mb-8
            NuxtLink(to="/shopping")
                button.button.bg-red-negative.text-white.w-28.sm_w-40 Decline        
            button.button.bg-utd-green.text-white.w-28.sm_w-40 Accept
</template>
