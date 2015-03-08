<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;

class PubEdit {
    public function pubSelect($args) {

        $id = Util::getArg($args, 'id', null);
        $row = DbUtil::selectRow('publication', null, array('id' => $id));
        $row['author'] = DbUtil::selectFrom('publication_author', 'author', array('publication_id' => $id));
        $row['title'] = DbUtil::selectFrom('publication_title', 'title', array('publication_id' => $id));
        $row['child_id'] = DbUtil::selectFrom('publication', 'id', array('parent_id' => $id));
        return array("data" => $row);
    }

    public function pubUpdate($args) {

        $id = Util::getArg($args, 'id', null);
        if (!$id) return $this->pubInsert($args);

        $data = Util::getArg($args, 'data', array());

        $pubData = array(
            "parent_id" => Util::getArg($data, 'parent_id', 0),
            "year" => Util::getArg($data, 'year', 0),
            "cobiss" => Util::getArg($data, 'cobiss', ''),
            "issn" => Util::getArg($data, 'issn', ''),
            "original_id" => Util::getArg($data, 'original_id', 0)
        );
        DbUtil::updateTable('publication', $pubData, array('id' => $id));

        $this->updateArrayFields($args);

        return $this->pubSelect($args);
    }

    public function pubInsert($args)
    {

        $data = Util::getArg($args, 'data', array());

        $pubData = array(
            "parent_id" => Util::getArg($data, 'parent_id', 0),
            "year" => Util::getArg($data, 'year', 0),
            "cobiss" => Util::getArg($data, 'cobiss', ''),
            "issn" => Util::getArg($data, 'issn', ''),
            "original_id" => Util::getArg($data, 'original_id', 0)
        );
        DbUtil::insertInto('publication', $pubData);

        $args['id'] = DbUtil::$lastInsertId;

        $this->updateArrayFields($args);

        $projectId = Util::getArg($args, 'projectId', null);
        if ($projectId) {
            $row = DbUtil::selectRow('publication_project_link', array('id'),
                array('publication_id' => $args['id'], 'project_id' => $projectId));

            if (!isset($row['id']) || !$row['id']) {
                DbUtil::insertInto('publication_project_link',
                    array('publication_id' => $args['id'], 'project_id' => $projectId));
            }
        }

        return $this->pubSelect($args);
    }


    private function updateArrayFields($args) {

        $id = Util::getArg($args, 'id', null);
        $data = Util::getArg($args, 'data', array());

        $author = Util::getArg($data, 'author', array());
        DbUtil::deleteFrom('publication_author', array('publication_id' => $id));
        for ($idx = 0; $idx < count($author); $idx++)
            DbUtil::insertInto('publication_author', array('publication_id' => $id, 'idx' => $idx, 'author' => $author[$idx]));

        $title = Util::getArg($data, 'title', array());
        DbUtil::deleteFrom('publication_title', array('publication_id' => $id));
        for ($idx = 0; $idx < count($title); $idx++)
            DbUtil::insertInto('publication_title', array('publication_id' => $id, 'idx' => $idx, 'title' => $title[$idx]));

    }

}
