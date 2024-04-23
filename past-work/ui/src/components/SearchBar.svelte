<script>
    // right now the search bar is non functional and will be connected to the back end
</script>

<div class="search-bar">
    <i class="fa fa-search icon"></i>
    <input type="text" id="search" placeholder="Search for items">
</div>


<style>
    .search-bar {
        box-sizing: border-box;
        width:50%;
        position: relative;
    }

    #search {
        background-color: #f5f5f5;
        box-sizing: border-box;
        color:#111;

        box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.4);

        border-radius: 20px;
        border-color: #aaa;
        padding: 3px 10px;
        padding-left: 30px;

        /* margin: 30px auto; */
        width:100%;
        height: 2.7rem;
    }
    
    .icon {
        position: absolute;
        top: 13px;
        left: 11px;
        color: #111;
    }

    #search:focus {
        outline: 2px solid #154734;
    }

</style>