<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center p-4">
    
    <div class="w-full max-w-sm bg-white shadow-xl rounded-lg p-6 mt-10">
      
      <div class="bg-[#E87500] text-black text-center py-4 rounded-md font-bold text-xl uppercase tracking-tight">
        Location
      </div>

      <hr class="border-t border-black my-6 opacity-20" />

      <div class="mb-8">
        <input 
          type="text" 
          placeholder="Bag ID" 
          class="w-full border border-gray-400 p-3 rounded text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
        />
      </div>

      <div class="flex justify-end">
        <SharedButtonPositiveAction text="Submit" />
      </div>

    </div>
  </div>
</template>
