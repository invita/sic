<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Where;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Sic\Admin\Models\SicModuleAbs;
use Zend\Db\Adapter\Driver\ResultInterface;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;

class PubSearch extends SicModuleAbs {

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
                '_creator_long' => $row['creator'],
                '_title_long' => $row['title'],
                'year' => $row['year'],
                //'is_series' => $row['is_series'],

                '_row' => $row
            );

            $newRow['_parentRow'] = array();
            if ($row['parent_id'])
                $newRow['_parentRow'] = DbUtil::selectRow("view_publication_list", null, array("pub_id" => $row['parent_id']));

            //$row['creator'] = Util::shortenText($row['creator'], PubEdit::$creatorMaxLen);
            //$row['title'] = Util::shortenText($row['title'], PubEdit::$titleMaxLen);
            //$row['publisher'] = Util::shortenText($row['publisher'], PubEdit::$publisherMaxLen);
            //$row['is_series'] = $row['parent_id'] == 0;

            $responseData[] = $newRow;
        }
        return $responseData;
    }

}