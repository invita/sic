<?php
namespace Sic\Admin\Models;

use Zend\Db\TableGateway\Feature\GlobalAdapterFeature;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Delete;
use Zend\Db\Adapter\Driver\ResultInterface;
use Sic\Admin\Models\Util;

abstract class SicModuleAbs
{

    // *** DataTable Select ***

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
        $select->where($filter);
    }

    public function defineDataTableResponseData($args, ResultInterface $result) {
        $responseData = array();
        foreach($result as $row) {
            $responseData[] = $row;
        }
        return $responseData;
    }

    public function defineRowCount($args, Select $select) {
        $adapter = GlobalAdapterFeature::getStaticAdapter();
        $sql = new Sql($adapter);
        $select->columns(array("count" => new \Zend\Db\Sql\Expression('COUNT(*)')));
        $statement = $sql->prepareStatementForSqlObject($select);
        $sqlResult = $statement->execute();
        $row = $sqlResult->current();
        $rowCount = Util::getArg($row, 'count', 0);
        return $rowCount;
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
        $sqlResult = $statement->execute();

        $responseData = $this->defineDataTableResponseData($args, $sqlResult);

        return array(
            'data' => $responseData,
            'rowCount' => $rowCount
        );
    }


    // *** DataTable Delete ***

    public function defineSqlDelete($args, Delete $delete) {

    }

    public function dataTableDelete($args) {

        $data = Util::getArg($args, 'data', null);
        $rowsAffected = 0;

        if ($data) {
            $adapter = GlobalAdapterFeature::getStaticAdapter();
            $sql = new Sql($adapter);
            $delete = $sql->delete();
            if ($this->defineSqlDelete($args, $delete) !== false) {
                $conn = $adapter->getDriver()->getConnection();

                $conn->beginTransaction();
                $statement = $sql->prepareStatementForSqlObject($delete);
                $sqlResult = $statement->execute();
                $conn->commit();

                $rowsAffected = $sqlResult->getAffectedRows();
            }
        }

        $result = $this->dataTableSelect($args);
        $result['rowsAffected'] = $rowsAffected;
        return $result;
    }

}