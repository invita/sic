<?php
namespace Sic\Admin\Modules\Regular;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Where;
use Zend\Db\Sql\Predicate\Expression;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Zend\Db\Adapter\Driver\ResultInterface;
use Sic\Admin\Modules\Pub\PubEdit;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;


class RegDoublesSearch extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {

        //$select->from('view_publication_list');
        //$staticData = Util::getArg($args, 'staticData', array());

        $userId = Util::getUserId();

        $select->from('view_publication_list')
            ->join('publication_doubles_selected',
                new Expression('publication_doubles_selected.pub_id = view_publication_list.pub_id '.
                           'AND publication_doubles_selected.user_id = '.$userId),
                array("user_id"),
                Select::JOIN_LEFT);


        $where = new Where();
        $where->addPredicates(array(new Expression('(user_id IS NULL OR user_id = '.$userId.')')));
        $select->where($where);
    }

    public function defineDataTableResponseData($args, ResultInterface $result)
    {
        $userId = Util::getUserId();
        $responseData = array();
        foreach ($result as $row) {
            //print_r($row);
            $newRow = array(
                'user_id' => $row["user_id"] == $userId ? 1 : 0,
                'pub_id' => $row['pub_id'],
                'parent_id' => $row['parent_id'],
                'series_id' => $row['series_id'],

                'creator' => Util::shortenText($row['creator'], PubEdit::$creatorMaxLen),
                'title' => Util::shortenText($row['title'], PubEdit::$titleMaxLen),
                'addtitle' => Util::shortenText($row['addtitle'], PubEdit::$titleMaxLen),
                'idno' => $row['idno'],
                'year' => $row['year'],

                '__creator_long' => $row['creator'],
                '__title_long' => $row['title'],
                '__addtitle_long' => $row['addtitle'],

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


    /*
    public function defineDataTableResponseData($args, ResultInterface $result) {
        $responseData = array();
        foreach($result as $row) {
            $responseData[] = $row;
        }
        return $responseData;
    }
    */

    public function defineSqlDelete($args, Delete $delete)
    {

    }

    public function selectAll($args) {
        //print_r($args);
        $userId = Util::getUserId();
        $filter = Util::getArg($args, "filter", null);
        unset($filter["user_id"]);

        $adapter = GlobalAdapterFeature::getStaticAdapter(); $sql = new Sql($adapter); $select = $sql->select();
        $select->columns(array('pub_id'))->from('view_publication_list');

        if ($filter && !empty($filter)) {
            $filterWhere = DbUtil::prepareSqlFilter($filter);
            if (count($filterWhere->getPredicates()))
                $select->where->addPredicate($filterWhere);
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $pubsResult = $statement->execute();
        $pubs = array();
        foreach($pubsResult as $row) { $pubs[] = $row["pub_id"]; }

        foreach ($pubs as $pub) {
            $isSelected = DbUtil::selectOne('publication_doubles_selected', 'pub_id', array(
                'pub_id' => $pub, 'user_id' => $userId));

            if (!$isSelected)
                DbUtil::insertInto('publication_doubles_selected', array(
                    'pub_id' => $pub, 'user_id' => $userId));
        }
        return array("status" => true);
    }

    public function deselectAll($args) {
        //print_r($args);
        $userId = Util::getUserId();
        $filter = Util::getArg($args, "filter", null);
        unset($filter["user_id"]);

        $adapter = GlobalAdapterFeature::getStaticAdapter(); $sql = new Sql($adapter); $select = $sql->select();
        $select->columns(array('pub_id'))->from('view_publication_list');

        if ($filter && !empty($filter)) {
            $filterWhere = DbUtil::prepareSqlFilter($filter);
            if (count($filterWhere->getPredicates()))
                $select->where->addPredicate($filterWhere);
        }

        $statement = $sql->prepareStatementForSqlObject($select);
        $pubsResult = $statement->execute();
        $pubs = array();
        foreach($pubsResult as $row) { $pubs[] = $row["pub_id"]; }

        foreach ($pubs as $pub) {
            DbUtil::deleteFrom('publication_doubles_selected', array(
                'pub_id' => $pub, 'user_id' => $userId));
        }
        return array("status" => true);
    }

    public function selectLine($args) {
        $pubId = Util::getArg($args, "pub_id", 0);
        $userId = Util::getUserId();
        if (!$pubId || !$userId) return array("status" => false);

        DbUtil::insertInto('publication_doubles_selected', array(
            'pub_id' => $pubId, 'user_id' => $userId));

        return array("status" => true);
    }

    public function selectLineToggle($args) {
        $pubId = Util::getArg($args, "pub_id", 0);
        $userId = Util::getUserId();
        if (!$pubId || !$userId) return array("status" => false);

        $selected = DbUtil::selectOne('publication_doubles_selected', 'pub_id', array(
            'pub_id' => $pubId, 'user_id' => $userId));

        if ($selected) {
            DbUtil::deleteFrom('publication_doubles_selected', array(
                'pub_id' => $pubId, 'user_id' => $userId));
        } else {
            DbUtil::insertInto('publication_doubles_selected', array(
                'pub_id' => $pubId, 'user_id' => $userId));
        }

        return array("status" => true);
    }
}
