<?php
//ini_set("display_errors", 1);

include_once(realpath(__DIR__."/../library/Cobiss/Cobiss.php"));

$lib = $_GET["lib"];
$search = $_GET["search"];

$c = new Cobiss($lib);
$r = $c->search($search);
$r = Cobiss::parse($r);

echo json_encode($r);