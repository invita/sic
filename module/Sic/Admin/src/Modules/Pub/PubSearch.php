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
                $arrayFields = array("creator", "idno", "year", "title");
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

        $select->columns(array(
            "pub_id", "parent_id", "year", "idno_cobiss", "idno_issn", "creator", "title", "publisher", "place"));
        $select->from('view_publication_list');
        $select->where($where);
    }

    public function defineDataTableResponseData($args, ResultInterface $result) {
        $responseData = array();
        foreach($result as $row) {
            $row['creator'] = Util::shortenText($row['creator'], PubEdit::$creatorMaxLen);
            $row['title'] = Util::shortenText($row['title'], PubEdit::$titleMaxLen);

            $row['publisher'] = Util::shortenText($row['publisher'], PubEdit::$publisherMaxLen);
            $responseData[] = $row;
        }
        return $responseData;
    }

}