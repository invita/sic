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
        $select->from('project')->columns(array('proj_id','title','date_created',
            'lines_count' => new Literal('(SELECT COUNT(*) FROM project_line WHERE project_line.proj_id = project.proj_id)')));
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $data = Util::getArg($args, 'data', null);
        $proj_id = Util::getArg($data, 'proj_id', 0);
        if (!$proj_id) return false;

        $deleteArray = array();

        $deleteSql = new Delete();
        $deleteSql->from('project')->where(array("proj_id" => $proj_id));
        $deleteArray[] = $deleteSql;

        $deleteSql = new Delete();
        $deleteSql->from('project_line')->where(array("proj_id" => $proj_id));
        $deleteArray[] = $deleteSql;

        return $deleteArray;
    }
}
