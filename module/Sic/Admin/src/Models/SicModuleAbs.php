<?php
namespace Sic\Admin\Models;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Sql\Update;
use Zend\Db\Sql\Where;
use Zend\Db\Sql\Predicate\Operator;
use Zend\Db\Adapter\Driver\ResultInterface;
use Sic\Admin\Models\Util;

abstract class SicModuleAbs
{

//<editor-fold desc="*** DataTable ***">

    //<editor-fold desc="DataTable Select">
    public function defineSqlSelect($args, Select $select) {

    }

    public function defineSqlSelectLimit($args, Select $select) {
        $sortField = Util::getArg($args, 'sortField', null);
        $sortOrder = Util::getArg($args, 'sortOrder', 'asc');
        $pageStart = intval(Util::getArg($args, 'pageStart', 0));
        $pageCount = intval(Util::getArg($args, 'pageCount', 5));

        if ($sortField) $select->order($sortField." ".$sortOrder);
        $select->offset($pageStart);
        $select->limit($pageCount);
    }

    public function defineSqlSelectFilter($args, Select $select) {
        $filter = Util::getArg($args, 'filter', array());
        $filterWhere = DbUtil::prepareSqlFilter($filter);
        if (count($filterWhere->getPredicates()))
            $select->where->addPredicate($filterWhere);
    }

    public function defineDataTableResponseData($args, ResultInterface $result) {
        $responseData = array();
        foreach($result as $row) {
            $responseData[] = $row;
        }
        return $responseData;
    }

    public function defineRowCount($args, Select $select) {

        /*
        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select->columns(array("count" => new \Zend\Db\Sql\Expression('COUNT(*)')));
        $statement = $sql->prepareStatementForSqlObject($select);
        $sqlResult = $statement->execute();
        $row = $sqlResult->current();
        $rowCount = Util::getArg($row, 'count', 0);
        return $rowCount;
        */

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $statement = $sql->prepareStatementForSqlObject($select);
        $sqlResult = $statement->execute();
        return $sqlResult->getAffectedRows();
    }

    public function dataTableSelect($args) {

        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select = $sql->select();

        $this->defineSqlSelect($args, $select);
        $this->defineSqlSelectFilter($args, $select);

        $rowCount = $this->defineRowCount($args, clone($select));

        $this->defineSqlSelectLimit($args, $select);

        $statement = $sql->prepareStatementForSqlObject($select);
        //echo $statement->getSql(); die();
        $sqlResult = $statement->execute();

        $responseData = $this->defineDataTableResponseData($args, $sqlResult);

        return array(
            'data' => $responseData,
            'rowCount' => $rowCount,
            'sql' => $statement->getSql()
        );
    }

    //</editor-fold>

    //<editor-fold desc="DataTable Delete">
    public function defineSqlDelete($args, Delete $delete) {

    }

    public function dataTableDelete($args) {

        $data = Util::getArg($args, 'data', null);
        $rowsAffected = 0;

        if ($data) {
            $adapter = GlobalAdapterFeature::getStaticAdapter();
            $sql = new Sql($adapter);
            $delete = $sql->delete();
            $deleteArray = $this->defineSqlDelete($args, $delete);
            if ($deleteArray !== false) {
                if (!is_array($deleteArray)) {
                    $deleteArray = array($delete);
                }

                $conn = $adapter->getDriver()->getConnection();
                $conn->beginTransaction();
                foreach ($deleteArray as $deleteSql) {
                    $statement = $sql->prepareStatementForSqlObject($deleteSql);
                    $sqlResult = $statement->execute();
                    $rowsAffected = $rowsAffected + $sqlResult->getAffectedRows();
                }
                $conn->commit();
            }
        }

        $result = $this->dataTableSelect($args);
        $result['rowsAffected'] = $rowsAffected;
        return $result;
    }
    //</editor-fold>

    //<editor-fold desc="DataTable UpdateRow">
    public function defineSqlUpdateRow($args, Update $update) {

    }

    public function dataTableUpdateRow($args) {

        $data = Util::getArg($args, 'data', null);
        $rowsAffected = 0;

        if ($data) {
            $adapter = GlobalAdapterFeature::getStaticAdapter();
            $sql = new Sql($adapter);
            $update = $sql->update();
            $this->defineSqlUpdateRow($args, $update);
            $conn = $adapter->getDriver()->getConnection();
            $conn->beginTransaction();
            $statement = $sql->prepareStatementForSqlObject($update);
            $sqlResult = $statement->execute();
            $rowsAffected = $sqlResult->getAffectedRows();
            $conn->commit();
        }

        $result = $this->dataTableSelect($args);
        $result['rowsAffected'] = $rowsAffected;
        return $result;
    }
    //</editor-fold>

//</editor-fold>

//<editor-fold desc="*** Form ***">

//</editor-fold>

}