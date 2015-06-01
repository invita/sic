<?php
include_once(realpath(__DIR__."/../library/Zotero/Zotero.php"));

$zotero = new Zotero();
$zotero->setUser("475425");
$zotero->setCollection("9KH9TNSJ");
$zotero->run();