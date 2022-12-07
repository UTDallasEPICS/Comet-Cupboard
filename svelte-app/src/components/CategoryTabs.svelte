<!--The different category tabs that will be on the left side of the screen-->

<head>
    <title>Pantry Staples</title>
</head>

<body>
    <button id="toBlue">Blue</button>
    
    <script lang="ts">

        document.getElementById("toBlue").onclick = function () {
            document.getElementById("output_text").style.color = '#38B6FF';
        }

    </script>
    <div>
        <p id="output_text">Pantry Staples</p>
    </div>
</body>

<head>
    <title>Snacks</title>
</head>

<body>
    <button id="tolightBlue">Light Blue</button>
    <script lang="ts">
        document.getElementById("toLightBlue").onclick = function () {
            document.getElementById("output_text").StyleSheet.color = '#9EDBFF'
        }
    </script>
    <p id="output_text">Snacks</p>
</body>

<head>
    <title>Grains</title>
</head>

<body>
    <button id="toYellow">Yellow</button>
    <script lang="ts">
        document.getElementById("toYellow").onclick = function (){
            document.getElementById("output_text").StyleSheet.color = 'FED111'
        }
    </script>
    <p id="output_text">Grains</p>
</body>

<head>
<title>Breakfast Grains</title>
<body>
    <button id="toLightYellow">Light Yellow</button>
    <script lang="ts">
        document.getElementById("toLightYellow").onclick = function (){
            document.getElementById("output_text").StyleSheet.color = 'FFEB95'
        }
        </script>
</body>
<p id="output_text">Breakfast Grains</p>
</head>

<head>
    <title>Soup</title>
    <body>
        <button id="toOrange">Orange</button>
        <script lang="ts">
            document.getElementById("toOrange").onclick = function (){
                document.getElementById("output_text").StyleSheet.color = 'E57528'
            }
            </script>
    </body>
    <p id="output_text">Soup</p>
    </head>

    <head>
        <title>Protein</title>
        <body>
            <button id="toRed">Red</button>
            <script lang="ts">
                document.getElementById("toRed").onclick = function (){
                    document.getElementById("output_text").StyleSheet.color = 'DC4631'
                }
                </script>
        </body>
        <p id="output_text">Protein</p>
        </head>

        <head>
            <title>Household Items</title>
            <body>
                <button id="toWhite">White</button>
                <script lang="ts">
                    document.getElementById("toWhite").onclick = function (){
                        document.getElementById("output_text").StyleSheet.color = 'F6F6ED'
                    }
                    </script>
            </body>
            <p id="output_text">Household Items</p>
            </head>

            <head>
                <title>Personal Care</title>
                <body>
                    <button id="toGrey">Grey</button>
                    <script lang="ts">
                        document.getElementById("toGrey").onclick = function (){
                            document.getElementById("output_text").StyleSheet.color = '929292'
                        }
                        </script>
                </body>
                <p id="output_text">Personal Care</p>
                </head>

                <head>
                    <title>Fruits</title>
                    <body>
                        <button id="toLightRed">Light Red</button>
                        <script lang="ts">
                            document.getElementById("toLightRed").onclick = function (){
                                document.getElementById("output_text").StyleSheet.color = 'DA6F61'
                            }
                            </script>
                    </body>
                    <p id="output_text">Fruits</p>
                    </head>

                    <head>
                        <title>Vegetables</title>
                        <body>
                            <button id="toGrey">Grey</button>
                            <script lang="ts">
                                document.getElementById("toGrey").onclick = function (){
                                    document.getElementById("output_text").StyleSheet.color = '929292'
                                }
                                </script>
                        </body>
                        <p id="output_text">Vegetables</p>
                        </head>



<div>  
    <p><a href='./routes/PantryStaples.svelte' rel="noopener noreferrer">Pantry Staples</a></p>
    <input type="button" name = "Pantry Staples">
    <p>Snacks</p>
    <input type="button" name = "Snacks">
    <p>Grains</p>
    <input type="button" name = "Grains">
    <p>Breakfast Grains</p>
    <input type="button" name = " Breakfast Grains">
    <p>Soup</p>
    <input type="button" name = "Soup">
    <p>Protein</p>
    <input type="button" name = "Protein">
    <p>Household Items</p>
    <input type="button" name = "Household Items">
    <p>Personal Care</p>
    <input type="button" name = "Personal Care">
    <p>Fruits</p>
    <input type="button" name = "Fruits">
    <p>Vegetables</p>
    <input type="button" name = "Vegetables">
</div>
 
<style>
    p {
        text-align: center;
        color: white;
    }
</style>