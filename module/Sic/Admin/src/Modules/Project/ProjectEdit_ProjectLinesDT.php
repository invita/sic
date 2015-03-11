<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;

class ProjectEdit_ProjectLinesDT extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $staticData = Util::getArg($args, 'staticData', null);
        $projectId = Util::getArg($staticData, 'projectId', 0);
        $select->columns(array('idx', 'title','author','cobiss','issn','publication_id'))
            ->from('project_lines')
            ->where(array('project_id' => $projectId));
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $staticData = Util::getArg($args, 'staticData', null);
        $projectId = Util::getArg($staticData, 'projectId', 0);
        $data = Util::getArg($args, 'data', null);
        $id = Util::getArg($data, 'id', 0);
        if (!$id) return false;

        $delete->from('project_lines')->where(array('project_id' => $projectId, 'id' => $id));
    }
}
