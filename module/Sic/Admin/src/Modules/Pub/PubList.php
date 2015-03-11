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

            /*
            ->columns(array('id', 'parent_id', 'year', 'cobiss', 'issn', 'original_id',
                'author' => new Literal('(SELECT SUBSTR(GROUP_CONCAT(author SEPARATOR \', \'), 1, 100) FROM publication_author WHERE
                            publication_author.publication_id = publication.id)'),
                'title' => new Literal('(SELECT SUBSTR(GROUP_CONCAT(title  SEPARATOR \', \'), 1, 100) FROM publication_title WHERE
                            publication_title.publication_id = publication.id)'),
                'project_id' => new Literal('(SELECT SUBSTR(GROUP_CONCAT(project_id SEPARATOR \', \'), 1, 100) FROM publication_project_link WHERE
                            publication_project_link.publication_id = publication.id)')
                //"title" => new Expression('SUBSTR(GROUP_CONCAT(publication_title.title), 1, 100)'),
                //"author" => new Expression('SUBSTR(GROUP_CONCAT(publication_author.author), 1, 100)')
            ))
            //->join('publication_project_link', 'publication.id = publication_project_link.publication_id',
            //    array('project_id' => new Expression('GROUP_CONCAT(publication_project_link.project_id)')), Select::JOIN_LEFT)
            //->join('publication_title', 'publication.id = publication_title.publication_id',
            //    array('title' => new Expression('SUBSTR(GROUP_CONCAT(publication_title.title), 1, 100)')), Select::JOIN_LEFT)
            //->join('publication_author', 'publication.id = publication_author.publication_id',
            //    array('author' => new Expression('SUBSTR(GROUP_CONCAT(publication_author.author), 1, 100)')), Select::JOIN_LEFT)
            ->group('publication.id');
            */

        //$select->where(array('title' => 'Naslov 1,Naslov 2'));
        //echo $select->getSqlString(); die();

        $staticData = Util::getArg($args, 'staticData', array());
        $projectId = Util::getArg($staticData, 'projectId', null);

        // Filter on projectId
        if ($projectId) {
            $select->join('publication_project_link', 'publication.id = publication_project_link.publication_id',
                array('filter_project_id' => 'project_id'))->where(array('filter_project_id' => $projectId));
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
