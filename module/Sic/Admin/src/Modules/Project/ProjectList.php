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
        $select->from('project');
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $data = Util::getArg($args, 'data', null);
        $id = Util::getArg($data, 'id', 0);
        if (!$id) return false;
        $delete->from('project')->where(array("id" => $id));
    }
}
