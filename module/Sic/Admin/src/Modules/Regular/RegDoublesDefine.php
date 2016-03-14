<?php
namespace Sic\Admin\Modules\Regular;

use Zend\Db\Sql\Delete;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Sic\Admin\Modules\Pub\PubEdit;
use Sic\Admin\Models\Elastic\ElasticHelper;


class RegDoublesDefine extends SicModuleAbs
{


    public function dataTableSelect($args) {

        $userId = Util::getUserId();
        //$filter = Util::getArg($args, "filter", array());

        //$pageStart = Util::getArg($args, "pageStart", "");
        //$pageCount = Util::getArg($args, "pageCount", 10);

        //$resp = ElasticHelper::fullSearch($filter, $pageStart, $pageCount);
        $data = ElasticHelper::findSelectedPubs($userId);
        //print_r(ElasticHelper::$lastOutputBuffers);

        // Post process data

        $columns = array(
            "pub_id",
            "parent_id",
            "series_id",
            "original_id",
            "creator",
            "title",
            "year",
            "temp_original_id"
        );

        $data = ElasticHelper::postProcessData($data, $columns);
        //print_r($data);

        foreach ($data as $rIdx => $row) {
            //$rds_selected = explode("; ", isset($row["rds_selected"]) ? $row["rds_selected"] : "");
            //unset($row["rds_selected"]);

            $newRow = array(
                //'user_id' => in_array("user".$userId, $rds_selected) ? 1 : 0
            );
            $row = array_merge($newRow, $row);
            $row['__creator_long'] = $row['creator'];
            $row['__title_long'] = $row['title'];
            $row['creator'] = Util::shortenText($row['__creator_long'], PubEdit::$creatorMaxLen);
            $row['title'] = Util::shortenText($row['__title_long'], PubEdit::$titleMaxLen);
            if (!isset($row['temp_original_id']))
                $row['temp_original_id'] = $row['original_id'];
            unset($row['_score']);
            $data[$rIdx] = $row;
        }

        //print_r($data);

        return array(
            "data" => $data,
            "rowCount" => count($data),
            "lastQueryJson" => ElasticHelper::$lastQueryJson
        );
    }

    public function dataTableDelete($args) {
        $data = Util::getArg($args, "data", array());
        $pubId = Util::getArg($data, "pub_id", 0);
        ElasticHelper::updatePubId($pubId, array("temp_original_id" => 0));
        $result = $this->dataTableSelect($args);
        foreach ($result["data"] as $i => $r) if ($r["pub_id"] == $pubId) $result["data"][$i]["temp_original_id"] = 0;
        return $result;
    }

    public function setRegular($args) {

        $userId = Util::getUserId();
        $pubId = Util::getArg($args, "pub_id", 0);

        $selectedPubs = ElasticHelper::findSelectedPubs($userId);
        foreach ($selectedPubs as $selectedPub) {
            $selPubId = intval(Util::arrayFirst($selectedPub["pub_id"]));
            if ($selPubId == $pubId)
                ElasticHelper::updatePubId($selPubId, array("temp_original_id" => -1));
            else
                ElasticHelper::updatePubId($selPubId, array("temp_original_id" => $pubId));
        }

        return array("status" => true);
    }

    public function setAlternative($args) {

        return array("status" => true);
    }

    public function saveSelected($args) {

        $userId = Util::getUserId();

        $selectedPubs = ElasticHelper::findSelectedPubs($userId);
        foreach ($selectedPubs as $selectedPub) {
            $selPubId = intval(Util::arrayFirst($selectedPub["pub_id"]));
            if (isset($selectedPub["temp_original_id"]))
                $temp_original_id = intval(Util::arrayFirst($selectedPub["temp_original_id"]));
            else
                $temp_original_id = intval(Util::arrayFirst($selectedPub["original_id"]));

            ElasticHelper::updatePubId($selPubId, array(
                "original_id" => $temp_original_id,
                "temp_original_id" => null
            ));
        }

        $regDoublesSearch = new RegDoublesSearch();
        $regDoublesSearch->deselectAll($args);

        return array("status" => true);
    }

}
