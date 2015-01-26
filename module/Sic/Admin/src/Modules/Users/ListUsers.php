<?php
namespace Sic\Admin\Modules\Users;

class ListUsers {
    public function listUsers($args) {
        $users = array(
            array("username" => "TestUser1"),
            array("username" => "TestUser2")
        );

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select()->from('user')->where(array('username' => $this->username, "password" => sha1($this->password)));
        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute();
        $row = $results->current();

        return array(
            "users" => $users
        );
    }
}
