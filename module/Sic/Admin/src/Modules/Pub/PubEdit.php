<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Sic\Admin\Modules\Project\ProjectLineSelect;

class PubEdit {

    public static $creatorMaxLen = 60;
    public static $titleMaxLen = 80;
    public static $publisherMaxLen = 60;

    public static function getCreatorShort($pub_id) {
        $creator = join(", ", DbUtil::selectFrom('publication_creator', 'creator', array('pub_id' => $pub_id, "code_id" => 1)));
        $creator = Util::shortenText($creator, self::$creatorMaxLen);
        return $creator;
    }

    public static function getTitleShort($pub_id) {
        $title = join(", ", DbUtil::selectFrom('publication_title', 'title', array('pub_id' => $pub_id)));
        $title = Util::shortenText($title, self::$titleMaxLen);
        return $title;
    }

    public function pubSelect($args) {

        $pub_id = Util::getArg($args, 'pub_id', null);
        $row = DbUtil::selectRow('publication', null, array('pub_id' => $pub_id));
        $row['idno'] = DbUtil::selectFrom('publication_idno', array('value' => 'idno', 'codeId' => 'code_id'), array('pub_id' => $pub_id));
        $row['addidno'] = DbUtil::selectFrom('publication_addidno', 'addidno', array('pub_id' => $pub_id));
        $row['title'] = DbUtil::selectFrom('publication_title', 'title', array('pub_id' => $pub_id));
        $row['addtitle'] = DbUtil::selectFrom('publication_addtitle', 'addtitle', array('pub_id' => $pub_id));
        $row['creator'] = DbUtil::selectFrom('publication_creator', array('value' => 'creator', 'codeId' => 'code_id'), array('pub_id' => $pub_id));
        $row['place'] = DbUtil::selectFrom('publication_place', 'place', array('pub_id' => $pub_id));
        $row['publisher'] = DbUtil::selectFrom('publication_publisher', 'publisher', array('pub_id' => $pub_id));
        $row['year'] = DbUtil::selectFrom('publication_year', 'year', array('pub_id' => $pub_id));
        $row['volume'] = DbUtil::selectFrom('publication_volume', 'volume', array('pub_id' => $pub_id));
        $row['issue'] = DbUtil::selectFrom('publication_issue', 'issue', array('pub_id' => $pub_id));
        $row['page'] = DbUtil::selectFrom('publication_page', 'page', array('pub_id' => $pub_id));
        $row['edition'] = DbUtil::selectFrom('publication_edition', 'edition', array('pub_id' => $pub_id));
        $row['source'] = DbUtil::selectFrom('publication_source', array('value' => 'source', 'codeId' => 'code_id'), array('pub_id' => $pub_id));
        $row['online'] = DbUtil::selectFrom('publication_online', array('value' => 'online', 'codeId' => 'code_id'), array('pub_id' => $pub_id));
        $row['strng'] = DbUtil::selectFrom('publication_strng', 'strng', array('pub_id' => $pub_id));
        $row['note'] = DbUtil::selectFrom('publication_note', 'note', array('pub_id' => $pub_id));
        $row['child_id'] = DbUtil::selectFrom('publication', 'pub_id', array('parent_id' => $pub_id));
        return array("data" => $row);
    }

    public function pubUpdate($args) {

        $pub_id = Util::getArg($args, 'pub_id', null);
        if (!$pub_id) return $this->pubInsert($args);

        $data = Util::getArg($args, 'data', array());

        $pubData = array(
            "parent_id" => intval(Util::getArg($data, 'parent_id', 0)),
            "original_id" => intval(Util::getArg($data, 'original_id', 0)),
            "is_series" => intval(Util::getArg($data, 'is_series', 0))
        );

        DbUtil::updateTable('publication', $pubData, array('pub_id' => $pub_id));

        $this->updateArrayFields($args);

        return $this->pubSelect($args);
    }

    public function pubInsert($args)
    {

        $data = Util::getArg($args, 'data', array());

        $pubData = array(
            "parent_id" => Util::getArg($data, 'parent_id', 0),
            "original_id" => Util::getArg($data, 'original_id', 0),
            "is_series" => intval(Util::getArg($data, 'is_series', 0))
        );
        DbUtil::insertInto('publication', $pubData);

        $args['pub_id'] = DbUtil::$lastInsertId;

        $this->updateArrayFields($args);

        $proj_id = Util::getArg($args, 'proj_id', null);
        if ($proj_id) {
            $line_id = Util::getArg($args, 'line_id', null);
            if ($line_id) {
                DbUtil::updateTable('project_line', array('pub_id' => $args['pub_id']),
                    array('line_id' => $line_id, 'proj_id' => $proj_id));
            }

            $link_id = DbUtil::selectOne('publication_project_link', 'link_id',
                array('pub_id' => $args['pub_id'], 'proj_id' => $proj_id));
            if (!$link_id) {
                DbUtil::insertInto('publication_project_link',
                    array('pub_id' => $args['pub_id'], 'proj_id' => $proj_id));
            }
        }

        return $this->pubSelect($args);
    }

    private function updateArrayFields($args) {

        $pub_id = Util::getArg($args, 'pub_id', null);
        $data = Util::getArg($args, 'data', array());

        $idno = Util::getArg($data, 'idno', array());
        DbUtil::deleteFrom('publication_idno', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($idno); $idx++)
            DbUtil::insertInto('publication_idno', array('pub_id' => $pub_id, 'idx' => $idx,
                'idno' => $idno[$idx]["value"], 'code_id' => $idno[$idx]["codeId"]));

        $addidno = Util::getArg($data, 'addidno', array());
        DbUtil::deleteFrom('publication_addidno', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($addidno); $idx++)
            DbUtil::insertInto('publication_addidno', array('pub_id' => $pub_id, 'idx' => $idx, 'addidno' => $addidno[$idx]));

        $title = Util::getArg($data, 'title', array());
        DbUtil::deleteFrom('publication_title', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($title); $idx++)
            DbUtil::insertInto('publication_title', array('pub_id' => $pub_id, 'idx' => $idx, 'title' => $title[$idx]));

        $addtitle = Util::getArg($data, 'addtitle', array());
        DbUtil::deleteFrom('publication_addtitle', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($addtitle); $idx++)
            DbUtil::insertInto('publication_addtitle', array('pub_id' => $pub_id, 'idx' => $idx, 'addtitle' => $addtitle[$idx]));

        $creator = Util::getArg($data, 'creator', array());
        DbUtil::deleteFrom('publication_creator', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($creator); $idx++)
            DbUtil::insertInto('publication_creator', array('pub_id' => $pub_id, 'idx' => $idx,
                'creator' => $creator[$idx]["value"], 'code_id' => $creator[$idx]["codeId"]));

        $place = Util::getArg($data, 'place', array());
        DbUtil::deleteFrom('publication_place', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($place); $idx++)
            DbUtil::insertInto('publication_place', array('pub_id' => $pub_id, 'idx' => $idx, 'place' => $place[$idx]));

        $publisher = Util::getArg($data, 'publisher', array());
        DbUtil::deleteFrom('publication_publisher', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($publisher); $idx++)
            DbUtil::insertInto('publication_publisher', array('pub_id' => $pub_id, 'idx' => $idx, 'publisher' => $publisher[$idx]));

        $year = Util::getArg($data, 'year', array());
        DbUtil::deleteFrom('publication_year', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($year); $idx++)
            DbUtil::insertInto('publication_year', array('pub_id' => $pub_id, 'idx' => $idx, 'year' => $year[$idx]));

        $volume = Util::getArg($data, 'volume', array());
        DbUtil::deleteFrom('publication_volume', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($volume); $idx++)
            DbUtil::insertInto('publication_volume', array('pub_id' => $pub_id, 'idx' => $idx, 'volume' => $volume[$idx]));

        $issue = Util::getArg($data, 'issue', array());
        DbUtil::deleteFrom('publication_issue', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($issue); $idx++)
            DbUtil::insertInto('publication_issue', array('pub_id' => $pub_id, 'idx' => $idx, 'issue' => $issue[$idx]));

        $page = Util::getArg($data, 'page', array());
        DbUtil::deleteFrom('publication_page', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($page); $idx++)
            DbUtil::insertInto('publication_page', array('pub_id' => $pub_id, 'idx' => $idx, 'page' => $page[$idx]));

        $edition = Util::getArg($data, 'edition', array());
        DbUtil::deleteFrom('publication_edition', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($edition); $idx++)
            DbUtil::insertInto('publication_edition', array('pub_id' => $pub_id, 'idx' => $idx, 'edition' => $edition[$idx]));

        $source = Util::getArg($data, 'source', array());
        DbUtil::deleteFrom('publication_source', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($source); $idx++)
            DbUtil::insertInto('publication_source', array('pub_id' => $pub_id, 'idx' => $idx,
                'source' => $source[$idx]["value"], 'code_id' => $source[$idx]["codeId"]));

        $online = Util::getArg($data, 'online', array());
        DbUtil::deleteFrom('publication_online', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($online); $idx++)
            DbUtil::insertInto('publication_online', array('pub_id' => $pub_id, 'idx' => $idx,
                'online' => $online[$idx]["value"], 'code_id' => $online[$idx]["codeId"]));

        $strng = Util::getArg($data, 'strng', array());
        DbUtil::deleteFrom('publication_strng', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($strng); $idx++)
            DbUtil::insertInto('publication_strng', array('pub_id' => $pub_id, 'idx' => $idx, 'strng' => $strng[$idx]));

        $note = Util::getArg($data, 'note', array());
        DbUtil::deleteFrom('publication_note', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($note); $idx++)
            DbUtil::insertInto('publication_note', array('pub_id' => $pub_id, 'idx' => $idx, 'note' => $note[$idx]));


        DbUtil::updateTable('publication', array('parent_id' => 0), array("parent_id" => $pub_id));
        $children = Util::getArg($data, 'child_id', array());
        for ($idx = 0; $idx < count($children); $idx++)
            DbUtil::updateTable('publication', array('parent_id' => $pub_id), array("pub_id" => $children[$idx]));
    }

    public function pubHierarchy($args) {

        // Get Parents
        $pub_id = Util::getArg($args, 'pub_id', null);
        $pubStack = array();
        $cnt = 0;

        while ($pub_id) {
            $pub = DbUtil::selectRow('publication', null, array('pub_id' => $pub_id));
            $pub['creator'] = self::getCreatorShort($pub_id);
            $pub['title'] = self::getTitleShort($pub_id);
            $pubStack[] = $pub;

            if ($pub_id == $pub['parent_id'])
                $pub_id = 0;
            else
                $pub_id = $pub['parent_id'];

            $cnt++;
            if ($cnt > 10) break;
        }
        $pubStack = array_reverse($pubStack);

        // Get Children
        $pub_id = Util::getArg($args, 'pub_id', null);

        $pubs = DbUtil::selectFrom('publication', null, array('parent_id' => $pub_id));
        foreach ($pubs as $pub) {
            $pub['creator'] = self::getCreatorShort($pub['pub_id']);
            $pub['title'] = self::getTitleShort($pub['pub_id']);
            $pubStack[] = $pub;
        }

        return $pubStack;
    }

    public function importQuotesFromProject($args) {
        $pub_id = Util::getArg($args, 'pub_id', null);
        $proj_id = Util::getArg($args, 'proj_id', null);

        $projLineSelect = new ProjectLineSelect();
        $projLines = $projLineSelect->dataTableSelect(array("staticData" => array("proj_id" => $proj_id),
            "pageCount" => 1000000));
        $projLines = $projLines["data"];

        //print_r($projLines); die();
        //$projLines = DbUtil::selectFrom("project_line", null, array("proj_id" => $proj_id));

        foreach ($projLines as $projLine) {
            if (!$projLine["user_id"]) continue;

            $quoted_pub_id = $projLine["pub_id"];

            DbUtil::insertInto("quote", array(
                "pub_id" => $pub_id,
                "on_page" => 0,
                "quoted_pub_id" => $quoted_pub_id,
                "cited_page" => 0
            ));
        }

        return array("status" => true);
    }

}
