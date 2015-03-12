<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\Sql\Predicate\Like;
use Zend\Db\Sql\Predicate\Predicate;
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Where;
use Zend\Authentication\Result;
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
            "view_publication_list.title LIKE '%".$search."%' OR ".
            "view_publication_list.author LIKE '%".$search."%'"
        );
        $select->where($where);


    }
}