<script>
    // importing components
</script>
<div class="flex-wrapper">
      </div>
      <div class="ntfbform">
      <div class="center">
<h1>North Texas Food Bank Form</h1>
<p><b>The Comet Cupboard is working in </b></p>
<p><b>partnership with the North Texas Food </b></p> 
<p><b>Bank. In doing so, we are asked to collect </b> </p> 
<p><b>some additional data.</b></p>
<p>You will complete this section on a annual basis or anytime a change occurs to impact your response</p>
</div>
<hr>
<p>Please enter your UTD ID Number (ex: 202111111)</p>
<form>
    <input type="number" min = "1000000000" max = "9999999999">
</form>
<hr>

<p>Tell us about your family, how many people are living in your current household?</p>

<form>
    <label for="childcount">Number of Children </label>
    <input type="text" id="childcount" name="childcount"><p>(Under 18)</p>
    <label for="adultcount">Number of Adults </label>
    <input type="text" id="adultcount" name="adultcount"> <p>(18-64)</p> 
    <label for="seniorcount">Number of Seniors </label>
    <input type="text" id="seniorcount" name="seniorcount"><p>(65+)</p>
  </form>

<hr>


<p>Are you interested in learning about SNAP (USDA-Supplemental Nutrition Assistance Program)?</p>

<input type="radio" id="yes" name="decision" value="YES">
  <label for="yes">YES</label><br>
  
  <input type="radio" id="no" name="decision" value="NO">
  <label for="no">NO</label><br><br>

<hr>

<p>Please enter your information so we can contact you about SNAP information.</p>

<form>
    <label for="fname">First Name </label>
    <input type="text" id="fname" name="fname"> <br> <br>
    <label for="lname">Last Name </label>
    <input type="text" id="lname" name="lname"> <br> <br> 
    <label for="email">UTD email address </label>
    <input type="text" id="email" name="email">
  </form>


<div class = "submit">
<input type="submit" value="Submit">
</div>



</div>
<style>

.header {
      /* make header stay on top of page at all times */
      position: sticky;
      top: 0;
  
      /* make header stay in front of all items */
      z-index: 2;
    }

.center {
  margin: auto;
  width: 70%;
  padding: 30px;
}

.submit{
    /* Checkout */

position: absolute;
width: 266px;
height: 129px;
left: 17px;
top: 1203px;



/* button background */

position: absolute;
left: 1.43%;
right: 7.88%;
top: 13.18%;
bottom: 16.28%;

background: #154734;
box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
border-radius: 40px;


/* Verify Checkout */

position: absolute;
width: 228px;
height: 50px;
left: 24px;
top: 48px;

font-family: 'Inter';
font-style: normal;
font-weight: 600;
font-size: 28px;
line-height: 34px;
display: flex;
align-items: center;

color: #FFFFFF;


}

.footer {
    margin-top: auto; /* push footer to the bottom when content overflows the page and when content is short */  
}

    
    </style>
