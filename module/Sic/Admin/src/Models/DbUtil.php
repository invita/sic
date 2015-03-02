<?php
namespace Sic\Admin\Models;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;

class DbUtil
{
    public static $lastInsertId = 0;
    public static $lastRowsAffected = 0;


    public static function selectFrom($table, $fields = null, $where = null, $limit = null) {
        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select($table);
        if ($fields){
            if (is_array($fields))
                $select->columns($fields);
            else
                $select->columns(array($fields));
        }
        if ($where) $select->where($where);
        if ($limit) $select->limit($limit);
        $statement = $sql->prepareStatementForSqlObject($select);
        $result = $statement->execute();

        $conn = $adapter->getDriver()->getConnection();
        self::$lastInsertId = $conn->getLastGeneratedValue();
        self::$lastRowsAffected = $result->getAffectedRows();

        $array = array();
        foreach($result as $row) {
            if (is_string($fields))
                $array[] = $row[$fields];
            else
                $array[] = $row;
        }

        return $array;
    }

    public static function selectRow($table, $fields = null, $where = null) {
        $result = self::selectFrom($table, $fields, $where, 1);
        $row = array();
        if ($result && isset($result[0])) $row = $result[0];
        return $row;
    }

    public static function insertInto($table, $values){

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $insert = $sql->insert($table)->values($values);
        $statement = $sql->prepareStatementForSqlObject($insert);
        $result = $statement->execute();

        $conn = $adapter->getDriver()->getConnection();
        self::$lastInsertId = $conn->getLastGeneratedValue();
        self::$lastRowsAffected = $result->getAffectedRows();

        return $result;
    }

    public static function updateTable($table, $values, $where){

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $update = $sql->update($table)->set($values)->where($where);
        $statement = $sql->prepareStatementForSqlObject($update);
        $result = $statement->execute();

        $conn = $adapter->getDriver()->getConnection();
        self::$lastRowsAffected = $result->getAffectedRows();

        return $result;
    }

    public static function deleteFrom($table, $where) {
        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $delete = $sql->delete($table)->where($where);
        $statement = $sql->prepareStatementForSqlObject($delete);
        $result = $statement->execute();

        $conn = $adapter->getDriver()->getConnection();
        self::$lastRowsAffected = $result->getAffectedRows();

        return $result;
    }
}