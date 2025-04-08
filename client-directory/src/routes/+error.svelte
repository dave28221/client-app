<script>
  import { page } from '$app/stores';;
  import companyLogo from "../lib/assets/company-logo.svg";
</script>

  <img class="llLogoError" alt="Lift Legal Logo" src={companyLogo} />
  <hr>
  <h1>{$page.status}: {$page.error.message}</h1>

<style>

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family:Arial, Helvetica, sans-serif;
}

hr {
  border: none;
  border-top: 1px solid rgb(222, 218, 218) ;

}
  
h1{
  margin-top:20px;
  text-align:center;
  
}

</style>