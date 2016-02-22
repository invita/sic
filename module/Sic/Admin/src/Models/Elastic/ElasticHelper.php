<?php
namespace Sic\Admin\Models\Elastic;

use Sic\Admin\Models\Util;

class ElasticHelper
{
    public static $entityIndexName = "entities";

    // function ElasticHelper::search expects:
    // $args["params"] - associative array to be passed as get parameters to the elastic web service
    public static function search($args = array()){
        $urlParams = "";
        if (isset($args["params"])) {
            foreach ($args["params"] as $key => $val)
                $urlParams .= ($urlParams ? "&" : "") . $key."=".$val;
            $urlParams = $urlParams ? "?".$urlParams : "";
        }
        $url = Util::getElasticUrl().self::$entityIndexName."/_search".$urlParams;

        $context  = stream_context_create(array('http' => array(
            'method'  => "POST",
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => ""
        )));

        $respString = file_get_contents($url, false, $context)."\n";
        $respArray = json_decode($respString, true);

        return $respArray;
    }
}