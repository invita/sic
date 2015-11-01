<?php
namespace Sic\Admin\Modules\Pub;

ini_set("display_errors", 1);

use Sic\Admin\Models\Zotero;
use Zend\Authentication\Storage\Session;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Where;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Sic\Admin\Models\SicModuleAbs;
use Zend\Db\Adapter\Driver\ResultInterface;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;

require_once(realpath(__DIR__."/../../../../../../library/Solr/Solr.php"));

class PubSearch extends SicModuleAbs {

    public function dataTableSelect($args) {

        //var_dump($args);

        $q = $args["staticData"]["q"];
        $fq = $args["staticData"]["fq"];

        $sortField = Util::getArg($args, "sortField", "");
        $sortOrder = Util::getArg($args, "sortOrder", "");
        $pageStart = Util::getArg($args, "pageStart", "");
        $pageCount = Util::getArg($args, "pageCount", 10);

        $rows = "rows=".$pageCount;
        $wt = "wt=json";

        $sort = ($sortField && $sortOrder) ? $sortField." ".$sortOrder : "score desc";

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

/*
            "edition",
            "issue",
            "online",
            "source",
            "volume",
            "idno",

            "addidno",
            "addtitle",
            "creator_author",
            "idno_cobiss",
            "is_series",
            "note",
            "page",
            "place",
            "proj_id",
            "publisher",
            "strng",
*/
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
    }

    public function autoComplete_search($args) {
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

    function zoteroScrape($args) {
        $url = $args["url"];

        $zotero = new Zotero();
        $zotero->setUrl($url);
        $zotero->run();

        return array("data" => $zotero->toArray());

    }



}