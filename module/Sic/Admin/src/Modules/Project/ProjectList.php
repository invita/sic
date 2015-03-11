<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;

class ProjectList extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $select->from('project')->columns(array('id','title','date_created',
            'lines_count' => new Literal('(SELECT COUNT(*) FROM project_lines WHERE project_lines.project_id = project.id)')));
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $data = Util::getArg($args, 'data', null);
        $id = Util::getArg($data, 'id', 0);
        if (!$id) return false;
        $delete->from('project')->where(array("id" => $id));
    }
}
