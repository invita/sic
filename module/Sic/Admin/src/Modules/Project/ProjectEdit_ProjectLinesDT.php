<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\Sql\Expression;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;
use Zend\Db\Adapter\Driver\ResultInterface;

class ProjectEdit_ProjectLinesDT extends SicModuleAbs {

    public function defineSqlSelect($args, Select $select)
    {
        $staticData = Util::getArg($args, 'staticData', null);
        $proj_id = Util::getArg($staticData, 'proj_id', 0);
        $select //->columns(array('line_id', 'idx', 'proj_id', 'title','creator','year','cobiss','issn','pub_id'))
            ->from('project_line')
            ->where(array('proj_id' => $proj_id));
    }

    public function defineDataTableResponseData($args, ResultInterface $result) {
        $responseData = array();

        $lineColumns = array(                     'title','addTitle','creator','year','idno','addIdno','volume',
                                                  'issue','page','edition','place','publisher','source','online','strng','note');
        $pubColumns = array('pub_id','parent_id', 'title','addTitle','creator','year','idno','addIdno','volume',
                                                  'issue','page','edition','place','publisher','source','online','strng','note');

        $pubIdsToSelect = array();
        foreach($result as $row) {
            $resultLine = array();

            // Copy system Line columns
            $resultLine['line_id'] = $row['line_id'];
            $resultLine['idx'] = $row['idx'];
            $resultLine['proj_id'] = $row['proj_id'];
            //$resultLine['xml'] = $row['xml'];

            // Copy Line columns
            $resultLine['line'] = array(
                "line_id" => $row['line_id'],
                "idx" => $row['idx'],
                "---" => ""
            );

            if ($row['xml']) {
                $entity = new \SimpleXMLElement($row['xml']);

                foreach ($lineColumns as $lineColName) {

                    $resultLine['line'][$lineColName] = Util::getXmlFieldValue($entity, $lineColName, false);

                    // Add hr after idx
                    //if ($lineColName == 'idx') $resultLine['line']['---'] = "";
                }

                // Select Publication columns: Add to queue, to select them all at once
                if ($row['pub_id']) {
                    $resultLine['publication'] = array("pub_id" => $row['pub_id']);
                    $pubIdsToSelect[] = $row['pub_id'];
                }
            }

            $responseData[] = $resultLine;
        }

        // Select all queued pubs
        if ($pubIdsToSelect) {

            $pubDict = array();
            $pubs = DbUtil::selectFrom('view_publication_list', $pubColumns, new Literal("pub_id in (".join(", ", $pubIdsToSelect).")"));
            foreach ($pubs as $pubRecord) {
                $pubId = $pubRecord["pub_id"];
                $pubDict[$pubId] = array();
                foreach ($pubRecord as $pubKey => $pubVal) {
                    $pubDict[$pubId][$pubKey] = str_replace("||", ", ", $pubVal);
                }
            }

            foreach($responseData as $rrIdx => $responseRecord) {
                if (!isset($responseData[$rrIdx]['publication'])) continue;
                $pubId = $responseData[$rrIdx]['publication']['pub_id'];
                $responseData[$rrIdx]['publication'] = $pubDict[$pubId];
            }
        }


        return $responseData;
    }

    public function defineSqlDelete($args, Delete $delete)
    {
        $staticData = Util::getArg($args, 'staticData', null);
        $proj_id = Util::getArg($staticData, 'proj_id', 0);
        $data = Util::getArg($args, 'data', null);
        $line_id = Util::getArg($data, 'line_id', 0);
        if (!$line_id) return false;

        $delete->from('project_line')->where(array('proj_id' => $proj_id, 'line_id' => $line_id));
    }
}
