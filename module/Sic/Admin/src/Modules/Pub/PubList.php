<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;

class PubList extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $select->from('view_publication_list');
        $staticData = Util::getArg($args, 'staticData', array());
        $proj_id = Util::getArg($staticData, 'proj_id', null);

        // Filter on project Id
        if ($proj_id) {
            $select->join('publication_project_link', 'publication.pub_id = publication_project_link.pub_id',
                array('filter_proj_id' => 'proj_id'))->where(array('filter_proj_id' => $proj_id));
        }
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $data = Util::getArg($args, 'data', null);
        $pub_id = Util::getArg($data, 'pub_id', 0);
        $staticData = Util::getArg($args, 'staticData', array());
        $proj_id = Util::getArg($staticData, 'proj_id', null);

        $delete->from('publication_project_link')->where(array("pub_id" => $pub_id));
        $delete->from('publication_creator')->where(array("pub_id" => $pub_id));
        $delete->from('publication_title')->where(array("pub_id" => $pub_id));
        $delete->from('publication')->where(array("pub_id" => $pub_id));
    }

}
