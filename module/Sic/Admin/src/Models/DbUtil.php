<?php
namespace Sic\Admin\Models;

use Zend\Db\Sql\Predicate\Like;
use Zend\Db\Sql\Predicate\Between;
use Zend\Db\Sql\Predicate\Operator;
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\Sql\Where;
use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;

class DbUtil
{
    public static $lastInsertId = 0;
    public static $lastRowsAffected = 0;
    public static $lastSqlSelect = 0;

    public static $pubTableNames = array(
        "addidno","addtitle","creator","edition","idno","issue","note","online",
        "page","place","publisher","source","strng","title","volume","year"
    );

    // Sql Select
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
        self::$lastSqlSelect = $select;

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

    public static function selectOne($table, $field = null, $where = null) {
        $result = self::selectRow($table, array($field), $where);
        if ($result && count($result)) return array_pop($result);
        return null;
    }

    // Sql Insert
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

    // Sql Update
    public static function updateTable($table, $values, $where){

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $update = $sql->update($table)->set($values)->where($where);
        $statement = $sql->prepareStatementForSqlObject($update);
        $result = $statement->execute();

        self::$lastRowsAffected = $result->getAffectedRows();

        return $result;
    }

    // Sql Delete
    public static function deleteFrom($table, $where) {
        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $delete = $sql->delete($table)->where($where);
        $statement = $sql->prepareStatementForSqlObject($delete);
        $result = $statement->execute();

        self::$lastRowsAffected = $result->getAffectedRows();

        return $result;
    }


    // Sql Where
    public static function prepareSqlFilter($filterData) {

        $whereFinal = new Where(null, PredicateSet::COMBINED_BY_AND);

        foreach($filterData as $fKey => $fValue) {
            $fValue = trim($fValue);
            if (!$fValue) continue;

            $fValueExplode = explode(",", $fValue);
            $whereOr = new Where(null, PredicateSet::COMBINED_BY_OR);

            foreach ($fValueExplode as $fVal) {

                $whereAnd = new Where(null, PredicateSet::COMBINED_BY_AND);

                // Like (*)
                if (strpos($fVal, "*") !== false) {
                    $fVal = str_replace("*", "%", $fVal);
                    $whereAnd->addPredicate(new Like($fKey, $fVal));
                } else

                // Range (x..y)
                if (strpos($fVal, "..") !== false) {
                    $leftRight = explode("..", $fVal);
                    $left = isset($leftRight[0]) ? $leftRight[0] : null;
                    $right = isset($leftRight[1]) ? $leftRight[1] : null;
                    if ($left) $whereAnd->addPredicate(new Operator($fKey, Operator::OP_GTE, $left));
                    if ($right) $whereAnd->addPredicate(new Operator($fKey, Operator::OP_LTE, $right));
                } else

                // Default
                {
                    $whereAnd->addPredicate(new Operator($fKey, Operator::OP_EQ, $fVal));
                }

                $whereOr->addPredicate($whereAnd);
            }

            $whereFinal->addPredicate($whereOr);
        }

        return $whereFinal;
    }
}