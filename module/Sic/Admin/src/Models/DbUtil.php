<?php
namespace Sic\Admin\Models;

use Zend\Db\Sql\Predicate\Like;
use Zend\Db\Sql\Predicate\Between;
use Zend\Db\Sql\Predicate\Operator;
use Zend\Db\Sql\Predicate\PredicateSet;
use Zend\Db\Sql\Where;
use Zend\Db\Sql\Expression;
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

                // Auto add stars to strings on both ends
                if (is_string($fVal) && !is_numeric($fVal) && strpos($fVal, "..") === false)
                    $fVal = '*'.$fVal.'*';

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

    // Sql Where For DuhecSearch algorithm
    public static function prepareSqlFilterDuhec($filterData) {

        $where = new Where(null, PredicateSet::COMBINED_BY_OR);

        // For a string "Today is a sunny day" for n=3 returns "Tod*is *unn*ay" and "*ay *a s*y d*"
        $getNs = function($str, $n) {
            $str = $str."";
            $r1 = ""; $r2 = "";
            $switch = false;
            for ($idx = 0; $idx < strlen($str); $idx++) {
                $letter = $str[$idx];
                if ($idx % $n == 0) {
                    $switch = !$switch;
                    if ($switch) $r1 .= "*"; if (!$switch) $r2 .= "*";
                }
                if ($switch) $r1 .= $letter; if (!$switch) $r2 .= $letter;
            }
            $r1 .= "*"; $r2 .= "*";
            $r1 = str_replace("**", "*", $r1); $r2 = str_replace("**", "*", $r2);
            return array($r1, $r2);
        };

        foreach($filterData as $fKey => $fValue) {
            $fValue = str_replace("*", "", trim($fValue));
            if (!$fValue) continue;

            $len = strlen($fValue);
            if ($len <= 5) {
                if (strpos($fValue, "*") === false) $fValue = "*".$fValue."*";
                $fValue = str_replace("*", "%", $fValue);
                $where->addPredicate(new Like($fKey, $fValue));
            } else if ($len > 5 && $len <= 9) {
                $ns = $getNs($fValue, 3);
                $ns[0] = str_replace("*", "%", $ns[0]);
                $ns[1] = str_replace("*", "%", $ns[1]);
                $where->addPredicate(new Like($fKey, $ns[0]));
                $where->addPredicate(new Like($fKey, $ns[1]));
            } else if ($len > 9) {
                $ns = $getNs($fValue, 5);
                $ns[0] = str_replace("*", "%", $ns[0]);
                $ns[1] = str_replace("*", "%", $ns[1]);
                //print_r($ns);
                $where->addPredicate(new Like($fKey, $ns[0]));
                $where->addPredicate(new Like($fKey, $ns[1]));
            }
        }

        return $where;
    }


    public static function touchPublication($pub_id) {
        DbUtil::updateTable("publication",
            array(
                'modified_date' => new Expression('NOW()'),
                'modified_by' => Util::getUserId()
            ),
            array("pub_id" => $pub_id));
    }

    public static function touchProject($proj_id) {
        DbUtil::updateTable("project",
            array(
                'modified_date' => new Expression('NOW()'),
                'modified_by' => Util::getUserId()
            ),
            array("proj_id" => $proj_id));
    }

    public static function touchQuote($quote_id) {
        DbUtil::updateTable("quote",
            array(
                'modified_date' => new Expression('NOW()'),
                'modified_by' => Util::getUserId()
            ),
            array("quote_id" => $quote_id));
    }
}