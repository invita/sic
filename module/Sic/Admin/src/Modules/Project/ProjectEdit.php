<?php
namespace Sic\Admin\Modules\Project;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Authentication\Result;
use Zend\Math\BigInteger\Exception\DivisionByZeroException;

class ProjectEdit {
    public function projSelect($args) {

        $id = $args['id'];
        if ($id == 1)
            return array("data" => array("id" => 1, "title" => "Project 1"));
        else
            return array("data" => array("id" => 2, "title" => "Project 2"));
    }

    public function projUpdate($args) {

        $id = isset($args["id"]) ? $args["id"] : null;
        if (!$id) return $this->projInsert($args);

        return $this->projSelect($args);
    }

    public function projInsert($args) {

        $id = 3;
        return $this->projSelect(array("id"=>$id));
    }

}
