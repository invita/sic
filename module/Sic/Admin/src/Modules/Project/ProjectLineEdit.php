<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Literal;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;

class ProjectLineEdit {
    public function projLineSelect($args) {

        $line_id = Util::getArg($args, 'line_id', null);
        $row = DbUtil::selectRow('project_line', null, array('line_id' => $line_id));
        return array("data" => $row);
    }

    public function projLineUpdate($args) {

        $line_id = Util::getArg($args, 'line_id', null);
        if (!$line_id) return $this->projLineInsert($args);

        $data = Util::getArg($args, 'data', array());

        $projLineData = array(
            "title" => Util::getArg($data, 'title', ''),
            "author" => Util::getArg($data, 'author', ''),
            "cobiss" => Util::getArg($data, 'cobiss', ''),
            "issn" => Util::getArg($data, 'issn', ''),
            "pub_id" => Util::getArg($data, 'pub_id', 0)
        );
        DbUtil::updateTable('project_line', $projLineData, array('line_id' => $line_id));

        return $this->projLineSelect($args);
    }

    public function projLineInsert($args)
    {

        $data = Util::getArg($args, 'data', array());
        $proj_id = Util::getArg($args, 'proj_id', 0);

        $lastIdx = DbUtil::selectOne('project_line', array('idx' => new Literal('MAX(idx)')), array('proj_id' => $proj_id));

        $newIdx = $lastIdx ? $lastIdx +1 : 1;

        $projLineData = array(
            "idx" => $newIdx,
            "proj_id" => $proj_id,
            "title" => Util::getArg($data, 'title', ''),
            "author" => Util::getArg($data, 'author', ''),
            "cobiss" => Util::getArg($data, 'cobiss', ''),
            "issn" => Util::getArg($data, 'issn', ''),
            "pub_id" => Util::getArg($data, 'pub_id', 0)
        );
        DbUtil::insertInto('project_line', $projLineData);

        $args['line_id'] = DbUtil::$lastInsertId;

        return $this->projLineSelect($args);
    }

}
