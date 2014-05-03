<?php
  $json = json_encode($_POST);
  file_put_contents("data/{$_POST['file']}.json" , $json);
  print $json;
?>