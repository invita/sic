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
            'allArray' => $json
        );
    }

    public function getCobissDetail($args){

        $cobissRow = Util::getArg($args, 'cobissRow', null);
        $userAgent = Util::getArg($cobissRow, 'userAgent', null);
        $url = Util::getArg($cobissRow, 'url', null);
        $url = str_replace("&amp;", "&", $url);
       // die($url);

        $cdw = new \Cobiss_Detail_Window();
        $cdw->setUserAgent($userAgent);
        $cdw->loadFromUrl($url);
        $array = $cdw->toArray();


        return $array;
    }

}