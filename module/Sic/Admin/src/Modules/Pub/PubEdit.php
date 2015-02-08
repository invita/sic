<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Authentication\Result;

class PubEdit {
    public function pubSelect($args) {

        // Select publication ...

        $id = $args['id'];

        $pub = array(
            "id" => "",
            "name" => ""
        );

        return array("data" => $pub);
    }

    public function pubUpdate($args) {

        $id = isset($args["id"]) ? $args["id"] : null;
        if (!$id) return $this->pubInsert($args);

        $data = $args["data"];

        // Update ...

        return $this->pubSelect($args);
    }

    public function pubInsert($args) {

        $data = $args["data"];

        // Insert ...

        return $this->pubSelect($args);
    }

}
