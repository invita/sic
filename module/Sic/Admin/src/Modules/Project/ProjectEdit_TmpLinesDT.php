<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;

class ProjectEdit_TmpLinesDT extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $staticData = Util::getArg($args, 'staticData', null);
        $projectId = Util::getArg($staticData, 'projectId', 0);

        $select->from('project_tmplines')->where(array('project_id' => $projectId));

        if ($projectId) $select->where(array('project_id', $projectId));
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $staticData = Util::getArg($args, 'staticData', null);
        $projectId = Util::getArg($staticData, 'projectId', 0);
        $data = Util::getArg($args, 'data', null);
        $id = Util::getArg($data, 'id', 0);
        if (!$id) return false;

        $delete->from('project_tmplines')->where(array('project_id' => $projectId, 'id' => $id));
    }
}
