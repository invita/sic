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
        $select->columns(array('line_id', 'idx', 'title','author','cobiss','issn','pub_id'))
            ->from('project_line')
            ->where(array('proj_id' => $proj_id));
    }

    public function defineDataTableResponseData($args, ResultInterface $result) {
        $responseData = array();
        foreach($result as $row) {
            $line = array();

            $line['line_id'] = $row['line_id'];
            $line['idx'] = $row['idx'];
            $line['title'] = $row['title'];

            $line['line'] = $row;
            $line['publication'] = array();

            if ($row['pub_id']) {
                $line['publication'] = DbUtil::selectRow('view_publication_list', null, array('pub_id' => $row['pub_id']));
            }
            $responseData[] = $line;
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
