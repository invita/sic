<?php
namespace Sic\Admin\Modules\User;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Authentication\Result;

class UserEdit {
    public function getUser($args) {

        $id = $args["id"];

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select()->from('user')->where(array('id' => $id));
        $statement = $sql->prepareStatementForSqlObject($select);
        $results = $statement->execute();
        $row = $results->current();
        unset($row['password']);


        return array("data" => $row);
    }

    public function updateUser($args) {

        $id = isset($args["id"]) ? $args["id"] : null;
        if (!$id) return $this->insertUser($args);

        $data = $args["data"];

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $update = $sql->update()->table('user')->set($data)->where(array('id' => $id));
        $statement = $sql->prepareStatementForSqlObject($update);
        $result = $statement->execute();

        return $this->getUser($args);
    }

    public function insertUser($args) {

        $data = isset($args["data"]) ? $args["data"] : array();

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $insert = $sql->insert()->into('user')->values($data);
        $statement = $sql->prepareStatementForSqlObject($insert);
        $result = $statement->execute();
        $args['id'] = $result->getGeneratedValue();

        return $this->getUser($args);
    }

    public function updatePassword($args) {

        $id = $args["id"];
        $data = $args["data"];

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $update = $sql->update()->table('user')->set(array("password" => sha1($data["password"])))->where(array('id' => $id));
        $statement = $sql->prepareStatementForSqlObject($update);
        $result = $statement->execute();

        return $this->getUser($args);
    }

    public function updatePermissions($args) {

        $id = $args["id"];
        $data = $args["data"];

        /*
        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $update = $sql->update()->table('user')->set(array("password" => sha1($data["password"])))->where(array('id' => $id));
        $statement = $sql->prepareStatementForSqlObject($update);
        $result = $statement->execute();
        */
        return $this->getUser($args);
    }


}
