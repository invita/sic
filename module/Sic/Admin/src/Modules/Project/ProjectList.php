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
            'lines_count' => new Literal('(SELECT COUNT(*) FROM project_line WHERE project_line.project_id = project.id)')));
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $data = Util::getArg($args, 'data', null);
        $id = Util::getArg($data, 'id', 0);
        if (!$id) return false;

        $deleteArray = array();

        $deleteSql = new Delete();
        $deleteSql->from('project')->where(array("id" => $id));
        $deleteArray[] = $deleteSql;

        $deleteSql = new Delete();
        $deleteSql->from('project_line')->where(array("project_id" => $id));
        $deleteArray[] = $deleteSql;

        return $deleteArray;
    }
}
