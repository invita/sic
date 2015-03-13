<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Where;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Sic\Admin\Models\SicModuleAbs;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;

class PubSearch extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $staticData = Util::getArg($args, 'staticData', array());
        $search = Util::getArg($staticData, 'search', null);

        $select->from('view_publication_list');

        $where = new Where();
        $where->literal(
            "(view_publication_list.title LIKE '%".$search."%' OR ".
            "view_publication_list.author LIKE '%".$search."%' OR ".
            "view_publication_list.year LIKE '%".$search."%')"
        );
        $select->where($where);

    }
}