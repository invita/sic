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

        for ($lineIdx = 0; $lineIdx < count($data); $lineIdx++) {
            $line = array();
            foreach ($columns as $colName) {
                $colData = Util::getArg($data[$lineIdx]["_source"], $colName, null);
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

            $line["_score"] = $data[$lineIdx]["_score"];
            $data[$lineIdx] = $line;
        }


        return array(
            "data" => $data,
            "rowCount" => $total,
            "staticData" => array("q" => $q),
            "lastQueryJson" => ElasticHelper::$lastQueryJson
    );


        //print_r($resp);

/*

        $solr = new \Solr();
        //$solr->setQueryString("?q=".$query."&".$wt."&".$rows_all);
        $solr->setQueryParams(array(
            "q" => $q,
            "fq" => $fq,
            "wt" => "json",
            "rows" => "2147483647"
        ));
        $solr->run();
        $rowCountData = $solr->toArray();


        $solr = new \Solr();
        //$solr->setQueryString("?q=".$query."&".$wt."&".$rows."&start=".$pageStart."&sort=".$sort);
        $solr->setQueryParams(array(
            "q" => $q,
            "fq" => $fq,
            "wt" => "json",
            "rows" => $pageCount,
            "start" => $pageStart,
            "sort" => $sort
        ));
        $solr->run();
        $data = $solr->toArray();

        if ($data === null) $data = array();

        // Sort columns
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


        for ($lineIdx = 0; $lineIdx < count($data); $lineIdx++) {
            $line = array();
            foreach ($columns as $colName)
                $line[$colName] = Util::getArg($data[$lineIdx], $colName, null);

            $data[$lineIdx] = $line;
        }

        return array(
            "data" => $data,
            "rowCount" => count($rowCountData),
            "staticData" => array("q" => $q, "fq" => $fq)
        );

*/
    }

    public function autoComplete_search($args) {
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



    /*

    public function defineSqlSelect($args, Select $select)
    {
        $staticData = Util::getArg($args, 'staticData', array());

        $searchType = Util::getArg($staticData, 'searchType', null);

        $where = new Where();

        switch ($searchType) {
            case "quickSearch":
                $quickSearch = Util::getArg($staticData, 'quickSearch', null);
                $where->literal(
                    "(view_publication_list.creator LIKE '%".$quickSearch."%' OR ".
                    "view_publication_list.title LIKE '%".$quickSearch."%' OR ".
                    "view_publication_list.year LIKE '%".$quickSearch."%')"
                );
                break;

            case "pubSearch": default:
                $fields = Util::getArg($staticData, 'fields', array());


                // ----- TODO: Temporary Solution
                $arrayFields = array("idno", "title", "creator", "year", "addidno", "addtitle", "place", "publisher",
                    "volume", "issue", "page", "edition", "source", "online", "strng", "note");
                foreach ($arrayFields as $arrayField) {
                    if (is_array($fields[$arrayField]))
                        $fields[$arrayField] = $fields[$arrayField][0];
                    if (is_array($fields[$arrayField]))
                        $fields[$arrayField] = $fields[$arrayField]["value"];
                }
                // -----

                $fieldsWhere = DbUtil::prepareSqlFilter($fields);
                if (count($fieldsWhere->getPredicates()))
                    $where->addPredicate($fieldsWhere);
                break;
        }

        //$select->columns(array(
        //    "pub_id", "parent_id", "creator", "title", "year"));
        $select->from('view_publication_list');
        $select->where($where);
    }

    public function defineDataTableResponseData($args, ResultInterface $result) {
        $responseData = array();
        foreach($result as $row) {
            $newRow = array(
                'pub_id' => $row['pub_id'],
                'parent_id' => $row['parent_id'],
                'series_id' => $row['series_id'],
                'creator' => Util::shortenText($row['creator'], PubEdit::$creatorMaxLen),
                'title' => Util::shortenText($row['title'], PubEdit::$titleMaxLen),
                '__creator_long' => $row['creator'],
                '__title_long' => $row['title'],
                'year' => $row['year'],
                //'is_series' => $row['is_series'],

                '__row' => $row
            );

            //$row['creator'] = Util::shortenText($row['creator'], PubEdit::$creatorMaxLen);
            //$row['title'] = Util::shortenText($row['title'], PubEdit::$titleMaxLen);
            //$row['publisher'] = Util::shortenText($row['publisher'], PubEdit::$publisherMaxLen);
            //$row['is_series'] = $row['parent_id'] == 0;

            $responseData[] = $newRow;
        }
        return $responseData;
    }
    */


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