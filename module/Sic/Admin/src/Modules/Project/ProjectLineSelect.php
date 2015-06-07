<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\Sql\Predicate\Predicate;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Where;
//use Zend\Db\Sql\Expression;
//use Zend\Db\Sql\Literal;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Zend\Db\Adapter\Driver\ResultInterface;
use Zend\Db\Sql\Predicate\Expression;

class ProjectLineSelect extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $userId = Util::getUserId();
        $staticData = Util::getArg($args, "staticData", null);
        $projId = Util::getArg($staticData, "proj_id", 0);

        $select->columns(array("line_id", "pub_id"))->from('project_line')
            ->join(
                'project_line_selected',
                new Expression('project_line_selected.line_id = project_line.line_id AND project_line_selected.user_id = '.$userId),
                array("user_id"),
                Select::JOIN_LEFT);

        $where = new Where();
        $where->equalTo('project_line.proj_id', $projId);
        $where->notEqualTo('project_line.pub_id', 0);
        $where->addPredicates(array(new Expression('(user_id IS NULL OR user_id = '.$userId.')')));

        $select->where($where);

        //echo $select->getSqlString();
    }

    public function defineDataTableResponseData($args, ResultInterface $result) {
        $userId = Util::getUserId();
        $responseData = array();
        foreach($result as $row) {

            $newRow = array(
                "user_id" => $row["user_id"] == $userId ? 1 : 0,
                "line_id" => $row["line_id"],
                "pub_id" => $row["pub_id"]
            );

            $newRow['title'] = DbUtil::selectRow('publication_title', 'title', array('pub_id' => $row['pub_id']));
            $newRow['creator'] = DbUtil::selectRow('publication_creator', 'creator', array('pub_id' => $row['pub_id']));

            $responseData[] = $newRow;
        }
        return $responseData;
    }

    public function defineSqlDelete($args, Delete $delete)
    {

    }

    public function dataTableUpdateRow($args)
    {

    }

    public function selectAll($args) {
        $projId = Util::getArg($args, "proj_id", 0);
        $userId = Util::getUserId();
        if (!$projId || !$userId) return array("status" => false);

        $this->deselectAll($args);

        //$lines = DbUtil::selectFrom('project_line', 'line_id', array('proj_id' => $projId));
        $lines = $this->dataTableSelect(array("staticData" => array("proj_id" => $projId), "pageCount" => 1000000));
        $lines = $lines["data"];

        //print_r($lines); die();

        foreach ($lines as $line)
            DbUtil::insertInto('project_line_selected', array('proj_id' => $projId, 'user_id' => $userId, 'line_id' => $line["line_id"]));

        return array("status" => true);
    }

    public function deselectAll($args) {
        $projId = Util::getArg($args, "proj_id", 0);
        $userId = Util::getUserId();
        if (!$projId || !$userId) return array("status" => false);

        DbUtil::deleteFrom('project_line_selected', array('proj_id' => $projId, 'user_id' => $userId));

        return array("status" => true);
    }

    public function selectLineToggle($args) {
        $projId = Util::getArg($args, "proj_id", 0);
        $lineId = Util::getArg($args, "line_id", 0);
        $userId = Util::getUserId();
        if (!$projId || !$lineId || !$userId) return array("status" => false);

        $selected = DbUtil::selectOne('project_line_selected', 'line_id', array(
            'proj_id' => $projId, 'line_id' => $lineId, 'user_id' => $userId));

        if ($selected) {
            DbUtil::deleteFrom('project_line_selected', array(
                'proj_id' => $projId, 'line_id' => $lineId, 'user_id' => $userId));
        } else {
            DbUtil::insertInto('project_line_selected', array(
                'proj_id' => $projId, 'line_id' => $lineId, 'user_id' => $userId));
        }

        return array("status" => true);
    }
}
