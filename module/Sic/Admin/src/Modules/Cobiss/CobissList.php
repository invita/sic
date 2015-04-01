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

        $pageStart = Util::getArg($args, 'pageStart', 0);
        $pageCount = Util::getArg($args, 'pageCount', 0);
        $staticData = Util::getArg($args, 'staticData', array());
        $search = Util::getArg($staticData, 'srch', null);
        $paginator = Util::getArg($staticData, 'paginator', array());
        $userAgent = Util::getArg($staticData, 'userAgent', null);
        $url = null;

        if($paginator && $userAgent){

            $url = $paginator["pages"][($pageStart/$pageCount)]["url"];
            $url = str_replace("&amp;", "&", $url);
            //die($url);

            $csw = new \Cobiss_Search_Window();
            $csw->setUserAgent($userAgent);
            $csw->loadFromUrl($url);

            //echo $csw->getLastResponse()->body;
            //die();

            $json = $csw->toArray();
        } else {
            $csw = new \Cobiss_Search_Window();
            $csw->search($search);
            $json = $csw->toArray();

            /*
            $id = 0;
            $inputArray = $json["form"]["inputArray"];
            for($c=0; $c<count($inputArray); $c++){
                if(isset($inputArray[$c]["ID"])){
                    $id = $inputArray[$c]["ID"];
                    break;
                }
            }
            $url = "http://cobiss4.izum.si/scripts/cobiss?ukaz=DIRE&amp;id=".$id."&amp;dfr=1&amp;ppg=10&amp;sid=1";
            $url = str_replace("&amp;", "&", $url);
            */

            //echo $url;
            //print_r($json);

            //$url = $json["paginator"]["pages"][0]["url"];
            //die($url);
        }

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

        return array(
            'data' => $data,
            'rowCount' => count($json["paginator"]["pages"])*$args["pageCount"],
            'userAgent' => $json["userAgent"],
            'paginator' => $json["paginator"],
            'url' => $url,
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