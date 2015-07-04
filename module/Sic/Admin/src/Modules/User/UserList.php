<?php
namespace Sic\Admin\Modules\User;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;

class UserList extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $select->from('user')->columns(array(
            'id', 'username', 'email', 'notes', 'power',
            'password' => new Literal("'(hidden)'")
        ));
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $data = Util::getArg($args, 'data', null);
        $id = Util::getArg($data, 'id', 0);
        if (!$id) return false;
        $delete->from('user')->where(array("id" => $id));
    }

}
