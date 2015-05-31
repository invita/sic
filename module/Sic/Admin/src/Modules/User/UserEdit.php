<?php
namespace Sic\Admin\Modules\User;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Authentication\Result;
use Sic\Admin\Models\DbUtil;

class UserEdit {
    public function getUser($args) {

        $id = $args["id"];

        $row = DbUtil::selectRow('user', null, array('id' => $id));
        unset($row['password']);

        return array("data" => $row);
    }

    public function updateUser($args) {

        $id = isset($args["id"]) ? $args["id"] : null;
        if (!$id) return $this->insertUser($args);

        $data = $args["data"];

        DbUtil::updateTable('user', $data, array('id' => $id));

        return $this->getUser($args);
    }

    public function insertUser($args) {

        $data = isset($args["data"]) ? $args["data"] : array();

        DbUtil::insertInto('user', $data);
        $args['id'] = DbUtil::$lastInsertId;

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
