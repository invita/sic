<?php
namespace Sic\Admin\Models\Elastic;

use Sic\Admin\Models\Util;
use Sic\Admin\Modules\System\ElasticControl;

class ElasticHelper
{
    public static $entityIndexName = "entities";
    public static $lastQueryJson = "";

    public static $lastOutputBuffers = array();
    public static $lastOutputBuffer = "";

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

        return self::callElastic($url, $context);
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

        return self::callElastic($url, $context);
    }

    public static function autoSuggest($searchString, $count = 10, $fieldName = "auto_suggest"){
        $url = Util::getElasticUrl().self::$entityIndexName."/_search";

        $query = array(
            "from" => 0,
            "size" => $count
        );

        if ($searchString) {
            $query["query"] = array(
                "match" => array(
                    $fieldName => array(
                        "query" => $searchString."*"
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
        print_r(self::$lastOutputBuffer);

        return self::callElastic($url, $context);
    }


    public static function fullSearch($searchArgs, $pageStart = 0, $pageCount = 10, $sort = null){
        $url = Util::getElasticUrl().self::$entityIndexName."/_search";

        $query = array(
            "from" => $pageStart,
            "size" => $pageCount
        );

        if ($sort) {
            $query["sort"] = $sort;
        }

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

        return self::callElastic($url, $context);
    }

    public static function findPubId($pubId) {
        $url = Util::getElasticUrl().self::$entityIndexName."/entity/".$pubId;
        $respArray = self::callElastic($url);
        return Util::getArg($respArray, "_source", array());
    }


    /*
     * Sample data *

    $data = array(
        ...
        0: {
            _index: "entities",
            _type: "entity",
            _id: "1"
            _score: 1
            _source: {
                addidno: [""]
                addtitle: [""]
                child_id: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29",…]
                created_by: null
                created_date: "0000-00-00 00:00:00"
                creator: [{value: "author", codeId: "1"}, {value: "addAuthor", codeId: "2"}, {value: "editor", codeId: "3"},…]
                edition: [""]
                idno: [{value: "34491648", codeId: "1"}, {value: "1318-0185", codeId: "3"}]
                is_series: "0"
                issue: [""]
                modified_by: "50"
                modified_date: "2015-10-18 20:26:28"
                note: [""]
                online: [{value: "", codeId: "1"}]
                original_id: "0"
                page: [""]
                parent_id: "0"
                place: ["Koper; Milje"]
                pub_id: "1"
                publisher: ["Zgodovinsko društvo za Južno Primorsko"]
                regalt_modified_by: null
                source: [{value: "", codeId: "1"}]
                strng: [""]
                title: ["Acta Histriae"]
                volume: [""]
                year: [""]
    */
    public static function postProcessData($data, $columns) {
        for ($lineIdx = 0; $lineIdx < count($data); $lineIdx++) {
            $line = array();
            $lineData = Util::getArg($data[$lineIdx], "_source", array());

            if ($columns == null) {
                $columns2 = array_keys($lineData);
            }  else {
                $columns2 = $columns;
            }
            foreach ($columns2 as $colName) {
                $colData = Util::getArg($lineData, $colName, null);
                if (is_array($colData)) {
                    if (isset($colData[0]) && is_array($colData[0])) {
                        // Values are arrays also
                        if (isset($colData[0]["value"])) {
                            $r = "";
                            foreach ($colData as $crow) $r .= ($r ? "; " : "") . $crow["value"];
                            $colData = $r;
                        } else {
                            // Unknown array type?
                            $colData = print_r($colData, true);
                        }
                    } else {
                        // Values are basic type
                        $colData = join("; ", $colData);
                    }
                }

                $line[$colName] = $colData;
            }

            $line["_score"] = Util::getArg($data[$lineIdx], "_score", null);
            $data[$lineIdx] = $line;
        }
        return $data;
    }

    public static function reindexPubId($pubId, $customData = null) {
        $ec = new ElasticControl();
        return $ec->reindexPubId($pubId, $customData);
    }


    public static function updatePubId($pubId, $data) {
        $url = Util::getElasticUrl().self::$entityIndexName."/entity/".$pubId."/_update";
        $postData = json_encode(array("doc" => $data));
        $context  = stream_context_create(array('http' => array(
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $postData
        )));
        $message = file_get_contents($url, false, $context)."\n";
        return $message;
    }

    public static function callElastic($url, $context = null) {
        ob_start();
        if ($context)
            $respString = file_get_contents($url, false, $context);
        else
            $respString = file_get_contents($url);
        $respArray = json_decode($respString, true);
        if (self::$lastOutputBuffer)
            array_push(self::$lastOutputBuffers, self::$lastOutputBuffer);
        self::$lastOutputBuffer = ob_get_clean();
        return $respArray;
    }
}