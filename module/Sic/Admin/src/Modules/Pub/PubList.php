<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;

class PubList extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $select->from('publication')
            ->columns(array('id', 'parent_id', 'year', 'cobiss', 'issn', 'original_id'))
            ->join('publication_title', 'publication.id = publication_title.publication_id',
                array('title' => new Expression('SUBSTR(GROUP_CONCAT(publication_title.title), 1, 100)')))
            ->group('publication.id');
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $data = Util::getArg($args, 'data', null);
        $id = Util::getArg($data, 'id', 0);
        $delete->from('publication_author')->where(array("publication_id" => $id));
        $delete->from('publication_title')->where(array("publication_id" => $id));
        $delete->from('publication')->where(array("id" => $id));
    }

}
