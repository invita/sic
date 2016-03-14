<?php
namespace Sic\Admin\Modules\Regular;

use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
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
        //print_r(ElasticHelper::$lastOutputBuffers);

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

        //print_r($data);

        return array(
            "data" => $data,
            "rowCount" => $total,
            "filter" => $filter,
            "lastQueryJson" => ElasticHelper::$lastQueryJson
        );
    }

    public function deselectAll($args) {
        $userId = Util::getUserId();
        if (!$userId) return array("status" => false);

        $selectedPubs = ElasticHelper::findSelectedPubs($userId);

        foreach ($selectedPubs as $idx => $pub) {
            if (isset($pub["rds_selected"]) && in_array("user".$userId, $pub["rds_selected"])) {
                $idx = array_search("user" . $userId, $pub["rds_selected"]);
                unset($pub["rds_selected"][$idx]);
                ElasticHelper::updatePubId($pub["pub_id"], array("rds_selected" => $pub["rds_selected"]));
            }
        }

        return array("status" => true);
    }

    public function selectAll($args) {

        return array("status" => true);
    }

    private function selectPub($pub, $userId = null) {
        if (!$userId) $userId = Util::getUserId();
        $pubId = intval(Util::arrayFirst($pub["pub_id"]));
        $rdsSelected = Util::getArg($pub, "rds_selected", array());
        $rdsSelected[] = "user".$userId;
        ElasticHelper::updatePubId($pubId, array("rds_selected" => $rdsSelected, "temp_original_id" => null));
    }
    private function deselectPub($pub, $userId = null) {
        if (!$userId) $userId = Util::getUserId();
        $pubId = intval(Util::arrayFirst($pub["pub_id"]));
        $rdsSelected = Util::getArg($pub, "rds_selected", array());
        $idx = array_search("user".$userId, $rdsSelected);
        if ($idx !== false) {
            unset($rdsSelected[$idx]);
            ElasticHelper::updatePubId($pubId, array("rds_selected" => $rdsSelected, "temp_original_id" => null));
        }
    }

    public function selectLineToggle($args) {
        $pubId = Util::getArg($args, "pub_id", 0);
        $userId = Util::getUserId();
        if (!$pubId || !$userId) return array("status" => false);

        $pub = ElasticHelper::findPubId($pubId);
        $selectDeselect = isset($pub["rds_selected"]) && in_array("user".$userId, $pub["rds_selected"]) ? false : true;

        $original_id = intval(Util::arrayFirst($pub["original_id"]));
        if ($original_id == -1) {

            // Original
            if ($selectDeselect)
                $this->selectPub($pub, $userId);
            else
                $this->deselectPub($pub, $userId);

            $altPubs = ElasticHelper::findAltPubs($pubId);
            foreach ($altPubs as $idx => $altPub) {
                if ($selectDeselect)
                    $this->selectPub($altPub, $userId);
                else
                    $this->deselectPub($altPub, $userId);
            }

        } else if ($original_id > 0) {

            // Alternative
            $args["pub_id"] = $original_id;
            return $this->selectLineToggle($args);
        } else {

            // Not yet defined
            if ($selectDeselect)
                $this->selectPub($pub, $userId);
            else
                $this->deselectPub($pub, $userId);
        }

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
