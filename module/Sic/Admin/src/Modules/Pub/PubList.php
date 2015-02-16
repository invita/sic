<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;

class PubList {
    public function dataTableSelect($args) {

        // S
        $publications = array(
            array(
                "id" => "1",
                "name" => "Test publication",
                "foo" => "Test publication",
                "bar" => "Test publication"
            )
        );

        return array('data' => $publications);
    }

    public function dataTableDelete($args) {

        $data = $args['data']; // Record to delete
        $id = $data['id'];


        // Do delete...

        return $this->dataTableSelect($args);
    }
}
