<?php
namespace Sic\Admin\Models\Elastic;

use Sic\Admin\Models\Util;
use Sic\Admin\Modules\System\ElasticControl;

class ElasticHelper
{
    public static $entityIndexName = "entities";
    public static $lastQueryJson = "";

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

    public static function quickSearch($searchString, $pageStart = 0, $pageCount = 10){
        $url = Util::getElasticUrl().self::$entityIndexName."/_search";

        $query = array(
            "from" => $pageStart,
            "size" => $pageCount
        );

        if ($searchString) {
            $query["query"] = array(
                "match" => array(
                    "quick_search" => array(
                        "query" => $searchString
                    )
                )
            );
        }


        $context  = stream_context_create(array('http' => array(
            'method'  => "POST",
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => json_encode($query)
        )));
        self::$lastQueryJson = $query;

        //echo json_encode($query);

        $respString = file_get_contents($url, false, $context)."\n";
        $respArray = json_decode($respString, true);

        return $respArray;
    }


    public static function fullSearch($searchArgs, $pageStart = 0, $pageCount = 10){
        $url = Util::getElasticUrl().self::$entityIndexName."/_search";

        $query = array(
            "from" => $pageStart,
            "size" => $pageCount
        );

        if ($searchArgs) {

            $should = array();
            foreach ($searchArgs as $key => $val) {
                array_push($should, array("match" => array($key => $val)));
            }

            $query["query"] = array(
                "bool" => array(
                    "should" => $should
                )
            );
        }


        $context  = stream_context_create(array('http' => array(
            'method'  => "POST",
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => json_encode($query)
        )));
        self::$lastQueryJson = $query;

        //echo json_encode($query);

        $respString = file_get_contents($url, false, $context)."\n";
        $respArray = json_decode($respString, true);

        return $respArray;
    }

    public static function reindexPubId($pubId) {
        $ec = new ElasticControl();
        return $ec->reindexPubId($pubId);
    }
}