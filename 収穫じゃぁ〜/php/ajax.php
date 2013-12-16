<?php
    if(isset($_GET["url"])){
        header("Content-type: application/html;");
        header("Expires: Thu, 01 Dec 1994 16:00:00 GMT");
        header("Last-Modified: ". gmdate("D, d M Y H:i:s"). " GMT");
        header("Cache-Control: no-cache, must-revalidate");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        readfile($_GET["url"]);
    }
?>
