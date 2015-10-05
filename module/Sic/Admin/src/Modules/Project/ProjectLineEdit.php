<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;

class ProjectLineEdit {
    public function projLineSelect($args) {

        $line_id = Util::getArg($args, "line_id", null);
        $row = DbUtil::selectRow("project_line", null, array("line_id" => $line_id));
        return array("data" => $row);
    }

    public function projLineUpdate($args) {

        $data = Util::getArg($args, "data", array());
        $line_id = Util::getArg($args, "line_id", null);
        $proj_id = Util::getArg($args, "proj_id", null);
        $pub_id = Util::getArg($data, "pub_id", null);
        if (!$line_id) return $this->projLineInsert($args);

        $this->deleteOldPubProjLinkIfExists($proj_id, $pub_id, $line_id);

        $projLineData = array(
            "xml" => Util::getArg($data, "xml", ""),
            "pub_id" => Util::getArg($data, "pub_id", 0)
        );
        DbUtil::updateTable("project_line", $projLineData, array("line_id" => $line_id));

        $this->createPubProjLink($proj_id, $pub_id, $line_id);

        DbUtil::touchProject($proj_id);

        return $this->projLineSelect($args);
    }

    public function projLineInsert($args)
    {

        $data = Util::getArg($args, "data", array());
        $proj_id = Util::getArg($args, "proj_id", 0);
        $line_id = Util::getArg($args, "line_id", null);
        $pub_id = Util::getArg($data, "pub_id", 0);

        $lastIdx = DbUtil::selectOne("project_line", new Literal("MAX(idx)"), array("proj_id" => $proj_id));

        $newIdx = $lastIdx ? $lastIdx +1 : 1;

        $projLineData = array(
            "idx" => $newIdx,
            "proj_id" => $proj_id,
            "xml" => Util::getArg($data, "xml", ""),
            "pub_id" => Util::getArg($data, "pub_id", 0)
        );
        DbUtil::insertInto("project_line", $projLineData);

        $args["line_id"] = DbUtil::$lastInsertId;

        $this->createPubProjLink($proj_id, $pub_id, $line_id);

        DbUtil::touchProject($proj_id);

        return $this->projLineSelect($args);
    }

    public function linkLine($args) {
        $line_id = Util::getArg($args, 'line_id', null);
        $pub_id = Util::getArg($args, 'pub_id', null);
        $proj_id = Util::getArg($args, 'proj_id', null);
        if (!$line_id || !$proj_id || !$pub_id) return;

        $this->deleteOldPubProjLinkIfExists($proj_id, $pub_id, $line_id);
        DbUtil::updateTable("project_line", array('pub_id' => $pub_id), array("line_id" => $line_id));
        $this->createPubProjLink($proj_id, $pub_id, $line_id);

        DbUtil::touchProject($proj_id);

        return array("status" => true);
    }

    private function deleteOldPubProjLinkIfExists($proj_id, $pub_id, $line_id) {
        if (!$line_id || !$proj_id || !$pub_id) return;
        $old_pub_id = DbUtil::selectOne("project_line", "pub_id", array("line_id" => $line_id));
        if ($old_pub_id && $old_pub_id != $pub_id)
            DbUtil::deleteFrom("publication_project_link", array("pub_id" => $old_pub_id, "proj_id" => $proj_id));
    }

    private function createPubProjLink($proj_id, $pub_id, $line_id) {
        if (!$line_id || !$proj_id || !$pub_id) return;
        $link_id = DbUtil::selectOne("publication_project_link", "link_id", array("pub_id" => $pub_id, "proj_id" => $proj_id));
        if (!$link_id)
            DbUtil::insertInto("publication_project_link", array("pub_id" => $pub_id, "proj_id" => $proj_id));
    }
}
