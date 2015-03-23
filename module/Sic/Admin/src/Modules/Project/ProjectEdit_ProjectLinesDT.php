<?php
namespace Sic\Admin\Modules\Project;

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
        $select //->columns(array('line_id', 'idx', 'proj_id', 'title','author','year','cobiss','issn','pub_id'))
            ->from('project_line')
            ->where(array('proj_id' => $proj_id));
    }

    public function defineDataTableResponseData($args, ResultInterface $result) {
        $responseData = array();

        $lineColumns = array('line_id','idx',     'title','author','year','cobiss','issn');
        $pubColumns = array('pub_id','parent_id', 'title','author','year','cobiss','issn','original_id');

        foreach($result as $row) {
            $resultLine = array();

            // Copy system Line columns
            $resultLine['line_id'] = $row['line_id'];
            $resultLine['idx'] = $row['idx'];
            $resultLine['proj_id'] = $row['proj_id'];
            $resultLine['title'] = $row['title'];

            // Copy Line columns
            $resultLine['line'] = array();
            foreach ($lineColumns as $lineColName) {
                $resultLine['line'][$lineColName] = $row[$lineColName];

                // Add hr after idx
                if ($lineColName == 'idx') $resultLine['line']['---'] = "";
            }

            // Select Publication columns
            $resultLine['publication'] = array();
            if ($row['pub_id']) {
                $pubVals = DbUtil::selectRow('view_publication_list', $pubColumns, array('pub_id' => $row['pub_id']));
                foreach ($pubVals as $pubKey => $pubVal) {
                    $resultLine['publication'][$pubKey] = $pubVal;

                    // Add hr after parent_id
                    if ($pubKey == 'parent_id') $resultLine['publication']['---'] = "";
                }
            }

            $responseData[] = $resultLine;
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
