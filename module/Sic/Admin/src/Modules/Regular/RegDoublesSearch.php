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

        $filter = Util::getArg($args, 'filter', null);
        $creatorFilter = Util::getArg($filter, 'creator', '');

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
                'original_id' => $row['original_id'],

                'creator' => Util::shortenText($row['creator'], PubEdit::$creatorMaxLen),
                'title' => Util::shortenText($row['title'], PubEdit::$titleMaxLen),
                'addtitle' => Util::shortenText($row['addtitle'], PubEdit::$titleMaxLen),
                'idno' => $row['idno'],
                'addidno' => $row['addidno'],
                'year' => $row['year'],

                'publisher' => $row['publisher'],
                'edition' => $row['edition'],
                'place' => $row['place'],
                'issue' => $row['issue'],
                'online' => $row['online'],
                'note' => $row['note'],
                'strng' => $row['strng'],
                'source' => $row['source'],
                'page' => $row['page'],
                'volume' => $row['volume'],

                'leven' => $row['leven'],

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
        foreach($pubsResult as $row) { $pubs[] = array("pub_id" => $row["pub_id"]); }

        foreach ($pubs as $pub) {
            $this->_selectPub($pub['pub_id']);
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
        foreach($pubsResult as $row) { $pubs[] = array('pub_id' => $row["pub_id"]); }

        foreach ($pubs as $pub) {
            DbUtil::deleteFrom('publication_doubles_selected', array(
                'pub_id' => $pub['pub_id'], 'user_id' => $userId));
        }
        return array("status" => true);
    }

    /*
    public function selectLine($args) {
        $pubId = Util::getArg($args, "pub_id", 0);
        $userId = Util::getUserId();
        if (!$pubId || !$userId) return array("status" => false);

        $original_id = DbUtil::selectOne('publication', 'original_id', array('pub_id' => $pubId));
        DbUtil::insertInto('publication_doubles_selected', array(
            'pub_id' => $pubId, 'user_id' => $userId, 'temp_original_id' => $original_id));

        return array("status" => true);
    }
    */

    public function selectLineToggle($args) {
        $pubId = Util::getArg($args, "pub_id", 0);
        $userId = Util::getUserId();
        if (!$pubId || !$userId) return array("status" => false);

        if ($this->_isPubSelected($pubId)) {
            $this->_deselectPub($pubId);
        } else {
            $this->_selectPub($pubId);
        }

        return array("status" => true);
    }

    public function _isPubSelected($pubId) {
        $userId = Util::getUserId();
        $selected = DbUtil::selectOne('publication_doubles_selected', 'pub_id', array(
            'pub_id' => $pubId, 'user_id' => $userId));
        return $selected ? true : false;
    }

    public function _selectPub($pubId) {
        $userId = Util::getUserId();
        if ($this->_isPubSelected($pubId)) return;

        $original_id = DbUtil::selectOne('publication', 'original_id', array('pub_id' => $pubId));

        if ($original_id == -1) {

            // Select all with pub.original_id = pubId + this one
            $pubs = DbUtil::selectFrom('publication', array('pub_id', 'original_id'), array('original_id' => $pubId));

            foreach($pubs as $pub) {
                if (!$this->_isPubSelected($pub['pub_id']))
                    DbUtil::insertInto('publication_doubles_selected', array(
                        'pub_id' => $pub['pub_id'], 'user_id' => $userId, 'temp_original_id' => $pub['original_id']));
            }

            if (!$this->_isPubSelected($pubId))
                DbUtil::insertInto('publication_doubles_selected', array(
                    'pub_id' => $pubId, 'user_id' => $userId, 'temp_original_id' => $original_id));


        } else if ($original_id > 0) {

            // Select all with pub.original_id = original_id + original one
            $pubs = DbUtil::selectFrom('publication', array('pub_id', 'original_id'), array('original_id' => $original_id));

            foreach($pubs as $pub) {
                if (!$this->_isPubSelected($pub['pub_id']))
                    DbUtil::insertInto('publication_doubles_selected', array(
                        'pub_id' => $pub['pub_id'], 'user_id' => $userId, 'temp_original_id' => $pub['original_id']));
            }

            if (!$this->_isPubSelected($original_id))
                DbUtil::insertInto('publication_doubles_selected', array(
                    'pub_id' => $original_id, 'user_id' => $userId, 'temp_original_id' => -1));

        } else if ($original_id == 0) {

            // Unspecified pub, only select it
            if (!$this->_isPubSelected($pubId))
                DbUtil::insertInto('publication_doubles_selected', array(
                    'pub_id' => $pubId, 'user_id' => $userId, 'temp_original_id' => $original_id));
        }



    }

    public function _deselectPub($pubId) {
        $userId = Util::getUserId();
        if (!$this->_isPubSelected($pubId)) return;

        $original_id = DbUtil::selectOne('publication', 'original_id', array('pub_id' => $pubId));

        if ($original_id == -1) {

            // Deselect all with pub.original_id = pubId + this one
            $pubs = DbUtil::selectFrom('publication', array('pub_id', 'original_id'), array('original_id' => $pubId));

            foreach($pubs as $pub) {
                DbUtil::deleteFrom('publication_doubles_selected', array(
                    'pub_id' => $pub['pub_id'], 'user_id' => $userId));
            }

            DbUtil::deleteFrom('publication_doubles_selected', array(
                'pub_id' => $pubId, 'user_id' => $userId));


        } else if ($original_id > 0) {

            // Deselect all with pub.original_id = original_id + original one
            $pubs = DbUtil::selectFrom('publication', array('pub_id', 'original_id'), array('original_id' => $original_id));

            foreach($pubs as $pub) {
                DbUtil::deleteFrom('publication_doubles_selected', array(
                    'pub_id' => $pub['pub_id'], 'user_id' => $userId));
            }

            DbUtil::deleteFrom('publication_doubles_selected', array(
                'pub_id' => $original_id, 'user_id' => $userId));

        } else if ($original_id == 0) {

            // Unspecified pub, only Deselect it
            DbUtil::deleteFrom('publication_doubles_selected', array(
                'pub_id' => $pubId, 'user_id' => $userId));
        }
    }

}
