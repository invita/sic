<?php
namespace Sic\Admin\Modules\Users;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;

class ListUsers {
    public function dataTableSelect($args) {
        $users = array();

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select()->from('user');
        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute();

        foreach($results as $result) {
            $users[] = array("id" => $result["id"], "username" => $result["username"]);
        }

        return $users;
    }
}
