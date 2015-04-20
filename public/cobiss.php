<?php
include_once(realpath(__DIR__."/../library/Cobiss/Cobiss.php"));

$url = $_POST["url"];

$csw = new Cobiss_Detail_Window();
$csw->setUserAgent($csw->getRandomUserAgent());
$csw->loadFromUrl($url);
$array = $csw->toArray();

print_r($array);