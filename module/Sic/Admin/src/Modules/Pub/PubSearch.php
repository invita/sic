<?php
namespace Sic\Admin\Modules\Pub;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Authentication\Result;

class PubSearch {
    function search($args) {
        $data = $args['data'];
        $search = $data['search'];
        return array(
            array("id" => 1, "title" => $search, "text" => "text...", "image" => "test.png"),
            array("id" => 2, "title" => "Title2", "text" => $search, "image" => "test.png"),
            array("id" => 3, "title" => "Title3", "text" => "text3...", "image" => $search),
            array("id" => 4, "title" => $search, "text" => "text4...", "image" => "test2.png"),
        );
    }
}