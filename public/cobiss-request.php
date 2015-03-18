<?php
include_once(realpath(__DIR__."/../library/Cobiss/Cobiss.php"));

$action = $_POST["action"];
if(!$action) return;

switch($action){
    case "search":
        $search = $_POST["search"];
        $csw = new Cobiss_Search_Window();
        $csw->search($search);
        echo $csw->toJSON();
        break;
    case "paginator":
        $userAgent = $_POST["userAgent"];
        $url = str_replace("&amp;", "&", $_POST["url"]);
        $csw = new Cobiss_Search_Window();
        $csw->setUserAgent($userAgent);
        $csw->loadFromUrl($url);
        echo $csw->toJSON();
        break;
    case "srtsel":
    case "perpage":
        $userAgent = $_POST["userAgent"];

        $csw = new Cobiss_Search_Window();
        $csw->setUserAgent($userAgent);
        $csw->loadFromUrl($url);
        echo $csw->toJSON();

        break;
    case "url";
        //$userAgent = $_POST["userAgent"];
        $url = $_POST["url"];
        $url = str_replace("||", "=", $url);
        $url = str_replace("|", "&", $url);

        $csw = new Cobiss_Detail_Window();
        //$csw->setUserAgent($userAgent);
        $csw->loadFromUrl($url);

        die();
        break;
}