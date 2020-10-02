<?php
$cm_id = '29775'; // Moodle CM_ID
$quiz_id = '12187'; // Moodle QUIZ_ID
$metric_id = '2313123123123123123'; // Moodle STUDENT_ID
$sesskey = 'sVqE4GiQL7'; // Moodle SESSKEY
$auth_id = file_get_contents("https://id.polytechonline.kz/get/auth_id?cm_id=$cm_id&quiz_id=$quiz_id&metric_id=$metric_id&sesskey=$sesskey");
?>
<script type="text/javascript">
    window.authId = '<?php echo $auth_id; ?>';
</script>
<div id="container"></div>
<script type="text/javascript" src="script.js"></script>
