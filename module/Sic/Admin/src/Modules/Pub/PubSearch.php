<?php
namespace Sic\Admin\Modules\Pub;

use Sic\Admin\Models\Zotero;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Elastic\ElasticHelper;

class PubSearch extends SicModuleAbs {

    public function dataTableSelect($args) {

        //var_dump($args);

        $staticData = Util::getArg($args, "staticData", array());

        $q = Util::getArg($staticData, "q", "");
        $type = Util::getArg($staticData, "type", "quick");

        $sortField = Util::getArg($args, "sortField", "");
        $sortOrder = Util::getArg($args, "sortOrder", "");
        $pageStart = Util::getArg($args, "pageStart", "");
        $pageCount = Util::getArg($args, "pageCount", 10);

        //$sort = ($sortField && $sortOrder) ? $sortField." ".$sortOrder : "score desc";

        switch ($type) {
            case "quick": default:
                $resp = ElasticHelper::quickSearch($q, $pageStart, $pageCount);
                break;

            case "full":
                $resp = ElasticHelper::fullSearch($q, $pageStart, $pageCount);
                break;
        }

        /*
        $resp = ElasticHelper::search(array(
            "params" => array(
                "q" => $q,
                "from" => $pageStart,
                "size" => $pageCount
            )
        ));
        */

        $took = Util::getArg($resp, "took", 0);
        $tookStr = "Search took ".$took." miliseconds";
        $hits = Util::getArg($resp, "hits", null);

        $total = Util::getArg($hits, "total", 0);
        $max_score = Util::getArg($hits, "max_score", 0);
        $data = Util::getArg($hits, "hits", array());


        // Post process data

        $columns = array(
            "pub_id",
            "parent_id",
            "series_id",
            "original_id",
            "creator",
            "title",
            "year",


//            "edition",
//            "issue",
//            "online",
//            "source",
//            "volume",
//            "idno",

//            "addidno",
//            "addtitle",
//            "creator_author",
//            "idno_cobiss",
//            "is_series",
//            "note",
//            "page",
//            "place",
//            "proj_id",
//            "publisher",
//            "strng",

        );

        $data = ElasticHelper::postProcessData($data, $columns);

        return array(
            "data" => $data,
            "rowCount" => $total,
            "staticData" => array("q" => $q),
            "lastQueryJson" => ElasticHelper::$lastQueryJson
        );
    }

    public function autoComplete_search($args) {

        $typed = Util::getArg($args, "typed", "");
        $fieldName = Util::getArg($args, "fieldName", "auto_suggest");

        if (is_array($typed)) $typed = $typed["value"];
        if (!$typed) return array();

        $resp = ElasticHelper::autoSuggest($typed, 10, $fieldName);

        $took = Util::getArg($resp, "took", 0);
        $tookStr = "Search took ".$took." miliseconds";
        $hits = Util::getArg($resp, "hits", null);

        $total = Util::getArg($hits, "total", 0);
        $max_score = Util::getArg($hits, "max_score", 0);
        $data = Util::getArg($hits, "hits", array());

        $data = ElasticHelper::postProcessData($data, null);

        $result = array();
        foreach ($data as $rIdx => $row) {
            foreach ($row as $key => $val) {
                if ($fieldName != "auto_suggest" && $fieldName != $key) continue;
                if ($this->isSubstring($typed, $val) && !in_array($val, $result)) {
                    array_push($result, $val);
                }
            }
        }

        return $result;
        /*
        return array(
            "data" => $data,
            "rowCount" => $total,
            "typed" => $typed,
            "lastQueryJson" => ElasticHelper::$lastQueryJson
        );
        */

        /*
        $typed = Util::getArg($args, "typed", "");
        $fieldName = Util::getArg($args, "fieldName", "");

        // $typed is a string for normal inputs,
        // $typed can also be array of ("codeId" => codeId, "value" => stringValue) for inputs with dropdown
        if (is_array($typed))
            $typed = $typed["value"];
        if (!$typed) return array();

        $array = array();
        $data = array();

        if ($fieldName) {

            // Search by field

            if(strlen($typed) >= 2) {

                $solr = new \Solr();
                $solr->setQueryParams(array(
                    "q" => "quickSearch:*" . $typed . "*",
                    "wt" => "json",
                    "rows" => "10"
                ));
                $solr->run();
                $data = $solr->toArray();
            }


        } else {

            // Search by all fields

            if(strlen($typed) >= 3){
                $solr = new \Solr();
                $solr->setQueryParams(array(
                    "q" => "quickSearch:*".$typed."*",
                    "wt" => "json",
                    "rows" => "10"
                ));
                $solr->run();
                $data = $solr->toArray();
            }
        }

        for($lineNum = 0; $lineNum < count($data); $lineNum++){
            $row = $data[$lineNum];

            if ($fieldName)
                $vals = isset($row[$fieldName]) ? array($row[$fieldName]) : array();
            else
                $vals = array_values($row);

            //print_r($vals); die();

            // Split ||
            for ($i = 0; $i < count($vals); $i++){
                if (!$this->isSubstring($typed, $vals[$i])) continue;
                //if ($fieldName && $i != $fieldName) continue;

                if (strpos($vals[$i], "||") !== false) {
                    $exp = explode("||", $vals[$i]);
                    foreach ($exp as $e) {
                        if ($this->isSubstring($typed, $e) && !in_array($e, $array)) {
                            array_push($array, $e);
                        }
                    }
                } else {
                    if (!in_array($vals[$i], $array))
                        array_push($array, $vals[$i]);
                }
            }
        }

        return $array;
        */
    }

    private function isSubstring($sub, $main) {
        return strpos(strtoupper($main), strtoupper($sub)) !== false;
    }

    public function getZoteroUrl(){

        if (isset($_SESSION["Zend_Auth"]) && isset($_SESSION["Zend_Auth"]['storage']) &&
            isset($_SESSION["Zend_Auth"]['storage']["id"]) && $_SESSION["Zend_Auth"]['storage']["id"])
        {
            // Session ok
            $user_id = $_SESSION["Zend_Auth"]['storage']["id"];

            $row = DbUtil::selectRow("user", array("zotero_id", "zotero_key"), "id = ".$user_id);
            $zotero_id = $row["zotero_id"];
            $zotero_key = $row["zotero_key"];

            $url = null;
            if($zotero_id){
                $url = "https://api.zotero.org/users/".$zotero_id."/items";
                if($zotero_key){
                    $url .= "?key=".$zotero_key;
                }
            }

            return array(
                "url" => $url
            );

        } else {

            // Session expired
            return array(
                "url" => "",
                "sessionExpired" => true
            );
        }
    }

    function zoteroScrape($args) {
        $url = $args["url"];

        $zotero = new Zotero();
        $zotero->setUrl($url);
        $zotero->run();

        return array("data" => $zotero->toArray());

    }



}