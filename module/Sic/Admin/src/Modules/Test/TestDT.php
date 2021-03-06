<?php
namespace Sic\Admin\Modules\Test;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Where;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Sic\Admin\Models\SicModuleAbs;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;

class TestDT extends SicModuleAbs {

    public function dataTableSelect($args)
    {
        //print_r($args);
        //die();

        return array("data" => array(
            array("id" => 1, "name" => "Foo"),
            array("id" => 2, "name" => "Bar")
        ),
            "rowCount" => 15);
    }
    /*
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
    */
}