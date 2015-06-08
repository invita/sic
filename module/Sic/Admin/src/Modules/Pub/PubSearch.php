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


        $solr = new \Solr();
        $solr->setQuery("*:*");
        $solr->run();
        $data = $solr->toArray();


        return array(
            "data" => $data,
            "rowCount" => count($data)
        );
    }


    public function getZoteroUrl(){

        $user_id = $_SESSION["Zend_Auth"]['storage']["id"];

        $row = DbUtil::selectRow("user", array("zotero_id", "zotero_col", "zotero_key"), "id = ".$user_id);
        $zotero_id = $row["zotero_id"];
        $zotero_col = $row["zotero_col"];
        $zotero_key = $row["zotero_key"];

        $url = null;
        if($zotero_id && $zotero_col){
            $url = "https://api.zotero.org/users/".$zotero_id."/collections/".$zotero_col."/items";
            if($zotero_key){
                $url .= "?key=".$zotero_key;
            }
        }

        return array("url"=>$url);
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

    public function autoComplete_title($args) {
        $typed = Util::getArg($args, 'typed', "");

        // $typed is a string for normal inputs,
        // $typed can also be array of ("codeId" => codeId, "value" => stringValue) for inputs with dropdown

        return array(
            $typed." Test",
            $typed." Test 2",
            $typed." Test 3"
        );
    }

}