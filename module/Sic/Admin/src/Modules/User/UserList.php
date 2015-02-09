<?php
namespace Sic\Admin\Modules\User;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;

class UserList {
    public function dataTableSelect($args) {
        $users = array();

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select()->from('user');
        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute();

        foreach($results as $result) {
            unset($result['password']);
            $result['password'] = '(hidden)';
            $users[] = $result;
        }

        return array('data' => $users);
    }

    public function dataTableDelete($args) {

        $data = isset($args['data']) ? $args['data'] : null;
        if ($data) {
            $adapter = GlobalAdapterFeature::getStaticAdapter();
            $sql = new Sql($adapter);
            $delete = $sql->delete()->from('user')->where(array("id" => $data['id']));
            $statement = $sql->prepareStatementForSqlObject($delete);
            $results = $statement->execute();
        }

        return $this->dataTableSelect($args);
    }
}
