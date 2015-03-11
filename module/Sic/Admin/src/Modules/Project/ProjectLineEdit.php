<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Literal;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;

class ProjectLineEdit {
    public function projLineSelect($args) {

        $id = Util::getArg($args, 'id', null);
        $row = DbUtil::selectRow('project_line', null, array('id' => $id));
        return array("data" => $row);
    }

    public function projLineUpdate($args) {

        $id = Util::getArg($args, 'id', null);
        if (!$id) return $this->projLineInsert($args);

        $data = Util::getArg($args, 'data', array());

        $projLineData = array(
            "title" => Util::getArg($data, 'title', ''),
            "author" => Util::getArg($data, 'author', ''),
            "cobiss" => Util::getArg($data, 'cobiss', ''),
            "issn" => Util::getArg($data, 'issn', ''),
            "publication_id" => Util::getArg($data, 'publication_id', 0)
        );
        DbUtil::updateTable('project_line', $projLineData, array('id' => $id));

        return $this->projLineSelect($args);
    }

    public function projLineInsert($args)
    {

        $data = Util::getArg($args, 'data', array());
        $projectId = Util::getArg($args, 'projectId', 0);

        $lastIdx = DbUtil::selectOne('project_line', array('idx' => new Literal('MAX(idx)')), array('project_id' => $projectId));

        $newIdx = $lastIdx ? $lastIdx +1 : 1;

        $projLineData = array(
            "idx" => $newIdx,
            "project_id" => $projectId,
            "title" => Util::getArg($data, 'title', ''),
            "author" => Util::getArg($data, 'author', ''),
            "cobiss" => Util::getArg($data, 'cobiss', ''),
            "issn" => Util::getArg($data, 'issn', ''),
            "publication_id" => Util::getArg($data, 'publication_id', 0)
        );
        DbUtil::insertInto('project_line', $projLineData);

        $args['id'] = DbUtil::$lastInsertId;

        return $this->projLineSelect($args);
    }

}
