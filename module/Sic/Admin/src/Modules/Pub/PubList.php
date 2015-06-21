<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Zend\Db\Adapter\Driver\ResultInterface;

class PubList extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $select->from('view_publication_list');
        $staticData = Util::getArg($args, 'staticData', array());
        $proj_id = Util::getArg($staticData, 'proj_id', null);

        // Filter on project Id
        if ($proj_id) {
            $select->join('publication_project_link', 'publication.pub_id = publication_project_link.pub_id',
                array('filter_proj_id' => 'proj_id'))->where(array('filter_proj_id' => $proj_id));
        }
    }

    public function defineDataTableResponseData($args, ResultInterface $result) {
        $responseData = array();
        foreach($result as $row) {
            $newRow = array(
                'pub_id' => $row['pub_id'],
                'parent_id' => $row['parent_id'],
                'series_id' => $row['series_id'],
                'original_id' => $row['original_id'],
                'creator' => Util::shortenText($row['creator'], PubEdit::$creatorMaxLen),
                'title' => Util::shortenText($row['title'], PubEdit::$titleMaxLen),
                'year' => $row['year'],

                '__creator_long' => $row['creator'],
                '__title_long' => $row['title'],

                '__row' => $row
            );

            //$row['creator'] = Util::shortenText($row['creator'], PubEdit::$creatorMaxLen);
            //$row['title'] = Util::shortenText($row['title'], PubEdit::$titleMaxLen);
            //$row['publisher'] = Util::shortenText($row['publisher'], PubEdit::$publisherMaxLen);
            //$row['is_series'] = $row['parent_id'] == 0;

            $responseData[] = $newRow;
        }
        return $responseData;
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $data = Util::getArg($args, 'data', null);
        $pub_id = Util::getArg($data, 'pub_id', 0);
        $staticData = Util::getArg($args, 'staticData', array());
        $proj_id = Util::getArg($staticData, 'proj_id', null);

        $joinedTables = array(
            'publication_addidno',
            'publication_addtitle',
            'publication_creator',
            'publication_edition',
            'publication_idno',
            'publication_issue',
            'publication_note',
            'publication_page',
            'publication_place',
            'publication_project_link',
            'publication_publisher',
            'publication_source',
            'publication_online',
            'publication_strng',
            'publication_title',
            'publication_volume',
            'publication_year'
        );

        foreach ($joinedTables as $i => $tableName)
            $delete->from($tableName)->where(array("pub_id" => $pub_id));

        $delete->from('publication')->where(array("pub_id" => $pub_id));
    }
}
