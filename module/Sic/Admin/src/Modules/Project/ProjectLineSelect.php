<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Zend\Validator\GreaterThan;

class ProjectLineSelect extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $userId = Util::getUserId();
        $projId = Util::getArg($args, "proj_id", 0);
        $select->from('project_line_selected')
            ->where(array('user_id' => $userId, 'proj_id' => $projId, 'pub_id' => new Literal('> 0')));
    }

    public function defineSqlDelete($args, Delete $delete)
    {

    }
}
