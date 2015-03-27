<?php
namespace Sic\Admin\Modules\Cobiss;

include_once(realpath(__DIR__."/../../../../../../library/Cobiss/Cobiss.php"));

use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Literal;
use Zend\Db\Sql\Expression;
use Sic\Admin\Models\SicModuleAbs;
use Sic\Admin\Models\Util;
use Sic\Admin\Models\DbUtil;

class CobissList extends SicModuleAbs {


    public function dataTableSelect($args) {

        //print_r($args);
        //die();

        $staticData = Util::getArg($args, 'staticData', array());
        $search = Util::getArg($staticData, 'srch', null);


        if($search){
            $csw = new \Cobiss_Search_Window();
            $csw->search($search);
            $json = $csw->toArray();

            $rows = $json["dataTable"]["rows"];
            for($c=0; $c<count($rows); $c++){
                $row = $rows[$c];
                $data[] = array(
                    "number" => $row["number"],
                    "author" => $row["author"],
                    "title" => $row["title"],
                    //"language" => $row["language"],
                    //"year" => $row["year"]
                );
            }
        } else {
            //$data = array(array("number" => "", "author" =>"", "title" =>"", "language" => "", "year" => ""));
            $data = array(array("number" => "", "author" =>"", "title" =>""));
        }



        /*
        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select();

        $this->defineSqlSelect($args, $select);
        $this->defineSqlSelectFilter($args, $select);

        $rowCount = $this->defineRowCount($args, clone($select));

        $this->defineSqlSelectLimit($args, $select);

        $statement = $sql->prepareStatementForSqlObject($select);
        //echo $statement->getSql(); die();
        $sqlResult = $statement->execute();

        $responseData = $this->defineDataTableResponseData($args, $sqlResult);
        */

        return array(
            'data' => $data,
            'rowCount' => isset($json) ? count($json["paginator"]["pages"]) : 1
        );
    }

    /*
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

    public function defineSqlDelete($args, Delete $delete)
    {
        $data = Util::getArg($args, 'data', null);
        $pub_id = Util::getArg($data, 'pub_id', 0);
        $staticData = Util::getArg($args, 'staticData', array());
        $proj_id = Util::getArg($staticData, 'proj_id', null);

        $delete->from('publication_project_link')->where(array("pub_id" => $pub_id));
        $delete->from('publication_author')->where(array("pub_id" => $pub_id));
        $delete->from('publication_title')->where(array("pub_id" => $pub_id));
        $delete->from('publication')->where(array("pub_id" => $pub_id));
    }
    */

}