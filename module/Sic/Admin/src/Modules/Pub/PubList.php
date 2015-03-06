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
            ->join('publication_project_link', 'publication.id = publication_project_link.publication_id',
                array('project_id' => new Expression('GROUP_CONCAT(publication_project_link.project_id)')), Select::JOIN_LEFT)
            ->join('publication_title', 'publication.id = publication_title.publication_id',
                array('title' => new Expression('SUBSTR(GROUP_CONCAT(publication_title.title), 1, 100)')), Select::JOIN_LEFT)
            ->group('publication.id');

        $staticData = Util::getArg($args, 'staticData', array());
        $projectId = Util::getArg($staticData, 'projectId', null);

        // Filter on projectId
        if ($projectId) {
            $select->where(array('project_id' => $projectId));
        }
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $data = Util::getArg($args, 'data', null);
        $id = Util::getArg($data, 'id', 0);
        $staticData = Util::getArg($args, 'staticData', array());
        $projectId = Util::getArg($staticData, 'projectId', null);

        // If projectId, only delete relation between project and publication
        if ($projectId) {
            $delete->from('publication_project_link')->where(array("publication_id" => $id, "project_id" => $projectId));
        } else {
            $delete->from('publication_author')->where(array("publication_id" => $id));
            $delete->from('publication_title')->where(array("publication_id" => $id));
            $delete->from('publication')->where(array("id" => $id));
        }
    }

}
