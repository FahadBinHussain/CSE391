<?php
// Basic PHP test for InfinityFree
header('Content-Type: application/json');

echo '{"status": "PHP is working", "time": "' . date('Y-m-d H:i:s') . '", "post_data": ' . json_encode($_POST) . '}';
?>