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


class RegDoublesDefine extends SicModuleAbs
{

    public function defineSqlSelect($args, Select $select)
    {

        $userId = Util::getUserId();

        $select->from('view_publication_list')
            ->join('publication_doubles_selected',
                new Expression('publication_doubles_selected.pub_id = view_publication_list.pub_id ' .
                    'AND publication_doubles_selected.user_id = ' . $userId),
                array("user_id", "temp_original_id"),
                Select::JOIN_INNER);


        $where = new Where();
        $where->equalTo('user_id', $userId);
        //$where->addPredicates(array(new Expression('(user_id IS NULL OR user_id = '.$userId.')')));
        $select->where($where);
    }

    public function defineDataTableResponseData($args, ResultInterface $result)
    {
        $responseData = array();
        foreach ($result as $row) {
            $newRow = array(
                'pub_id' => $row['pub_id'],
                'parent_id' => $row['parent_id'],
                'series_id' => $row['series_id'],
                'temp_original_id' => $row['temp_original_id'],

                'creator' => Util::shortenText($row['creator'], PubEdit::$creatorMaxLen),
                'title' => Util::shortenText($row['title'], PubEdit::$titleMaxLen),
                'year' => $row['year'],

                '__creator_long' => $row['creator'],
                '__title_long' => $row['title'],

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
        $data = Util::getArg($args, "data", null);
        $pubId = Util::getArg($data, "pub_id", 0);
        $userId = Util::getUserId();

        if ($pubId && $userId) {
            $delete->from('publication_doubles_selected')->where(array('pub_id' => $pubId, 'user_id' => $userId));
        }
    }

    public function setRegular($args) {
        $pubId = Util::getArg($args, "pub_id", 0);
        $userId = Util::getUserId();
        if (!$pubId || !$userId) return array("status" => false);

        $selectedPubs = DbUtil::selectFrom("publication_doubles_selected", null, array("user_id" => $userId));

        foreach ($selectedPubs as $selPub) {
            $selPubId = $selPub["pub_id"];
            if ($selPubId == $pubId)
                DbUtil::updateTable("publication_doubles_selected", array("temp_original_id" => -1), array("pub_id" => $selPubId, "user_id" => $userId));
            else
                DbUtil::updateTable("publication_doubles_selected", array("temp_original_id" => $pubId), array("pub_id" => $selPubId, "user_id" => $userId));
        }

        return array("status" => true);
    }

    public function setAlternative($args) {

        $pubId = Util::getArg($args, "pub_id", 0);
        $userId = Util::getUserId();
        if (!$pubId || !$userId) return array("status" => false);

        $selectedPubs = DbUtil::selectFrom("publication_doubles_selected", null, array("user_id" => $userId));

        $regularPubId = null;
        foreach ($selectedPubs as $selPub) {
            //$pub = DbUtil::selectRow("publication", null, array("pub_id" => $selPub["pub_id"]));
            if (isset($selPub["temp_original_id"]) && $selPub["temp_original_id"] == -1) {
                $regularPubId = $selPub["pub_id"];
                break;
            }
        }

        if (!$regularPubId) return array("status" => false, "alert" => "Entity can not be marked as Alternative because no listed entity is marked Regular!");

        DbUtil::updateTable("publication_doubles_selected", array("temp_original_id" => $regularPubId), array("pub_id" => $pubId));

        return array("status" => true);
    }

    public function saveSelected($args) {
        $userId = Util::getUserId();
        $selectedPubs = DbUtil::selectFrom("publication_doubles_selected", null, array("user_id" => $userId));

        // Check if Regular selected
        foreach ($selectedPubs as $selPub) {
            DbUtil::updateTable("publication", array("original_id" => $selPub['temp_original_id']), array("pub_id" => $selPub['pub_id']));
            DbUtil::touchPublication($selPub['pub_id']);
        }

        //foreach ($selectedPubs as $selPub) {
        //    DbUtil::updateTable("publication", array("original_id" => $selPub['temp_original_id']), array("pub_id" => $selPub['pub_id']));
        //}

        DbUtil::deleteFrom("publication_doubles_selected", array("user_id" => $userId));

        return array("status" => true);
    }

}
