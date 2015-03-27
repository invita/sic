<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;

class PubEdit {

    public static $authorMaxLen = 60;
    public static $titleMaxLen = 60;

    public function pubSelect($args) {

        $pub_id = Util::getArg($args, 'pub_id', null);
        $row = DbUtil::selectRow('publication', null, array('pub_id' => $pub_id));
        $row['author'] = DbUtil::selectFrom('publication_author', 'author', array('pub_id' => $pub_id));
        $row['title'] = DbUtil::selectFrom('publication_title', 'title', array('pub_id' => $pub_id));
        $row['child_id'] = DbUtil::selectFrom('publication', 'pub_id', array('parent_id' => $pub_id));
        return array("data" => $row);
    }

    public function pubUpdate($args) {

        $pub_id = Util::getArg($args, 'pub_id', null);
        if (!$pub_id) return $this->pubInsert($args);

        $data = Util::getArg($args, 'data', array());

        $pubData = array(
            "parent_id" => Util::getArg($data, 'parent_id', 0),
            "year" => Util::getArg($data, 'year', 0),
            "cobiss" => Util::getArg($data, 'cobiss', ''),
            "issn" => Util::getArg($data, 'issn', ''),
            "original_id" => Util::getArg($data, 'original_id', 0)
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
            "year" => Util::getArg($data, 'year', 0),
            "cobiss" => Util::getArg($data, 'cobiss', ''),
            "issn" => Util::getArg($data, 'issn', ''),
            "original_id" => Util::getArg($data, 'original_id', 0)
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

        $author = Util::getArg($data, 'author', array());
        DbUtil::deleteFrom('publication_author', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($author); $idx++)
            DbUtil::insertInto('publication_author', array('pub_id' => $pub_id, 'idx' => $idx, 'author' => $author[$idx]));

        $title = Util::getArg($data, 'title', array());
        DbUtil::deleteFrom('publication_title', array('pub_id' => $pub_id));
        for ($idx = 0; $idx < count($title); $idx++)
            DbUtil::insertInto('publication_title', array('pub_id' => $pub_id, 'idx' => $idx, 'title' => $title[$idx]));

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
            $pub['author'] = self::getAuthorShort($pub_id);
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
            $pub['author'] = self::getAuthorShort($pub['pub_id']);
            $pub['title'] = self::getTitleShort($pub['pub_id']);
            $pubStack[] = $pub;
        }

        return $pubStack;
    }

    public static function getAuthorShort($pub_id) {
        $author = join(", ", DbUtil::selectFrom('publication_author', 'author', array('pub_id' => $pub_id)));
        if (strlen($author) > self::$authorMaxLen) $author = substr($author, 0, self::$authorMaxLen)."...";
        return $author;
    }

    public static function getTitleShort($pub_id) {
        $title = join(", ", DbUtil::selectFrom('publication_title', 'title', array('pub_id' => $pub_id)));
        if (strlen($title) > self::$titleMaxLen) $title = substr($title, 0, self::$titleMaxLen)."...";
        return $title;
    }
}
