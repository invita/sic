<?php
namespace Sic\Admin\Modules\Regular;

use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Sic\Admin\Models\Elastic\ElasticHelper;
use Sic\Admin\Modules\Pub\PubEdit;


class RegDoublesSearch extends SicModuleAbs {


    public function dataTableSelect($args) {

        $userId = Util::getUserId();
        $filter = Util::getArg($args, "filter", array());

        $sortField = Util::getArg($args, "sortField", "");
        $sortOrder = Util::getArg($args, "sortOrder", "");
        $pageStart = Util::getArg($args, "pageStart", "");
        $pageCount = Util::getArg($args, "pageCount", 10);

        //$sort = ($sortField && $sortOrder) ? $sortField." ".$sortOrder : "score desc";

        $sort = array(
            array("_score" => "desc"),
            array("creator" => "asc"),
            array("title" => "asc")
        );
        $resp = ElasticHelper::fullSearch($filter, $pageStart, $pageCount, $sort);
        print_r(" ");

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
            "addtitle",
            "idno",
            "addidno",
            "year",
            "publisher",
            "edition",
            "place",
            "issue",
            "online",
            "note",
            "strng",
            "source",
            "page",
            "volume",
            "rds_selected"
        );

        $data = ElasticHelper::postProcessData($data, $columns);

        foreach ($data as $rIdx => $row) {
            $rds_selected = explode("; ", isset($row["rds_selected"]) ? $row["rds_selected"] : "");
            unset($row["rds_selected"]);

            $newRow = array(
                'user_id' => in_array("user".$userId, $rds_selected) ? 1 : 0);
            $row = array_merge($newRow, $row);
            $row['__creator_long'] = $row['creator'];
            $row['__title_long'] = $row['title'];
            $row['__addtitle_long'] = $row['addtitle'];
            $row['creator'] = Util::shortenText($row['__creator_long'], PubEdit::$creatorMaxLen);
            $row['title'] = Util::shortenText($row['__title_long'], PubEdit::$titleMaxLen);
            $row['addtitle'] = Util::shortenText($row['__addtitle_long'], PubEdit::$titleMaxLen);
            $data[$rIdx] = $row;
        }

        return array(
            "data" => $data,
            "rowCount" => $total,
            "filter" => $filter,
            "lastQueryJson" => ElasticHelper::$lastQueryJson
        );
    }

    /*
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

                '__creator_long' => $row['creator'],
                '__title_long' => $row['title'],
                '__addtitle_long' => $row['addtitle'],

                '__row' => $row
            );

            if (isset($row['leven']))
                $newRow['leven'] = $row['leven'];

            //$row['creator'] = Util::shortenText($row['creator'], PubEdit::$creatorMaxLen);
            //$row['title'] = Util::shortenText($row['title'], PubEdit::$titleMaxLen);
            //$row['publisher'] = Util::shortenText($row['publisher'], PubEdit::$publisherMaxLen);
            //$row['is_series'] = $row['parent_id'] == 0;

            $responseData[] = $newRow;
        }
        return $responseData;
    }

    */

/*
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
*/
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

        $pub = ElasticHelper::findPubId($pubId);
        $rdsSelected = Util::getArg($pub, "rds_selected", array());

        if (isset($rdsSelected) && in_array("user".$userId, $rdsSelected)) {
            $idx = array_search("user".$userId, $rdsSelected);
            unset($rdsSelected[$idx]);
        } else {
            $rdsSelected[] = "user".$userId;
        }

        //$pub["rdsSelected"] = $rdsSelected;
        //ElasticHelper::reindexPubId($pubId, array("rds_selected" => $rdsSelected));
        ElasticHelper::updatePubId($pubId, array("rds_selected" => $rdsSelected));

        //if ($this->_isPubSelected($pubId)) {
        //    $this->_deselectPub($pubId);
        //} else {
        //    $this->_selectPub($pubId);
        //}

        return array("status" => true);
    }


    /*

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
    */
}
