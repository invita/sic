<?php
namespace Sic\Admin\Modules\Users;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Authentication\Result;

class Manage {
    public function getUser($args) {

        //print_r($args); die();
        $userId = $args["userId"];

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select()->from('user')->where(array('id' => $userId));
        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute();
        $row = $results->current();
        $user = array("id" => $row["id"], "username" => $row["username"]);

        return array(
            "userData" => $user
        );
    }

    public function updateUser($args) {

        $userId = $args["userId"];
        $userData = $args["userData"];

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $update = $sql->update()->table('user')->set($userData)->where(array('id' => $userId));
        $statement = $sql->prepareStatementForSqlObject($update);
        $result = $statement->execute();

        return $this->getUser($args);
    }

    public function insertUser($args) {

        $data = $args["data"];

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $insert = $sql->insert()->into('user')->values($data);
        $statement = $sql->prepareStatementForSqlObject($insert);
        $result = $statement->execute();

        return $this->getUser($args);
    }

    public function updatePassword($args) {

        $userId = $args["userId"];
        $userData = $args["userData"];

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $update = $sql->update()->table('user')->set(array("password" => sha1($userData["password"])))->where(array('id' => $userId));
        $statement = $sql->prepareStatementForSqlObject($update);
        $result = $statement->execute();

        return $this->getUser($args);
    }
}
