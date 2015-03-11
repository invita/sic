<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Zend\Db\Adapter\Driver\ResultInterface;

class ProjectEdit_ProjectLinesDT extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $staticData = Util::getArg($args, 'staticData', null);
        $projectId = Util::getArg($staticData, 'projectId', 0);
        $select->columns(array('id', 'idx', 'title','author','cobiss','issn','publication_id'))
            ->from('project_line')
            ->where(array('project_id' => $projectId));
    }

    public function defineDataTableResponseData($args, ResultInterface $result) {
        $responseData = array();
        foreach($result as $row) {
            $line = array();

            $line['idx'] = $row['idx'];
            $line['title'] = $row['title'];

            $line['line'] = $row;
            if ($row['publication_id']) {
                $line['publication'] = DbUtil::selectRow('publication', null, array('id' => $row['publication_id']));
            }
            $responseData[] = $line;
        }
        return $responseData;
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $staticData = Util::getArg($args, 'staticData', null);
        $projectId = Util::getArg($staticData, 'projectId', 0);
        $data = Util::getArg($args, 'data', null);
        $id = Util::getArg($data, 'id', 0);
        if (!$id) return false;

        $delete->from('project_line')->where(array('project_id' => $projectId, 'id' => $id));
    }
}
