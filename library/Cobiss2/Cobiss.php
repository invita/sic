<?php
namespace Cobiss;

require_once(realpath(__DIR__."/../Httpful/httpful.phar"));
require_once(realpath(__DIR__."/../SimpleHtmlDom/simple_html_dom.php"));

require_once(__DIR__."/UserAgent.php");
require_once(__DIR__."/Search.php");
require_once(__DIR__."/Display.php");


class Cobiss
{

    public static function search($search)
    {
        return new Search($search);
    }

    public function display($id)
    {
        $uri = "http://cobiss6.izum.si/scripts/cobiss?ukaz=DISP&id=".$id."&rec=2&sid=1";
        $response = Request::get($uri)->addHeader('User-agent:', $this->userAgent)->send();

        var_dump($response);
    }

}

$co = new \Cobiss\Cobiss();
$co->search("Andrej");



//$co->display("1437095949036662");